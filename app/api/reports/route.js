import { NextResponse } from 'next/server';
import Patient from '@/models/Patient';
import { dbConnect } from '@/lib/mongodb';

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'patients';
    const period = searchParams.get('period') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const specificFilter = searchParams.get('specificFilter');

    // Build date filter
    const dateFilter = buildDateFilter(period, startDate, endDate);

    let data = [];

    switch (reportType) {
      case 'patients':
        data = await getPatientsReport(dateFilter);
        break;
      case 'counsellors':
        data = await getCounsellorsReport(dateFilter, specificFilter);
        break;
      case 'agents':
        data = await getAgentsReport(dateFilter, specificFilter);
        break;
      case 'implanters':
        data = await getImplantersReport(dateFilter, specificFilter);
        break;
      case 'technicians':
        data = await getTechniciansReport(dateFilter, specificFilter);
        break;
      case 'techniques':
        data = await getTechniquesReport(dateFilter, specificFilter);
        break;
      case 'transactions':
        data = await getTransactionsReport(dateFilter);
        break;
      case 'status':
        data = await getStatusReport(dateFilter);
        break;
      default:
        data = await getPatientsReport(dateFilter);
    }

    return NextResponse.json({
      success: true,
      data: data,
      reportType: reportType,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({
      success: false,
      message: "Error generating report",
      error: error.message
    }, { status: 500 });
  }
}

function buildDateFilter(period, startDate, endDate) {
  const filter = {};
  const now = new Date();

  switch (period) {
    case 'daily':
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.createdAt = {
        $gte: today,
        $lte: new Date(now.setHours(23, 59, 59, 999))
      };
      break;
    case 'weekly':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      filter.createdAt = {
        $gte: startOfWeek,
        $lte: endOfWeek
      };
      break;
    case 'monthly':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      filter.createdAt = {
        $gte: startOfMonth,
        $lte: endOfMonth
      };
      break;
    case 'custom':
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + 'T23:59:59.999Z')
        };
      }
      break;
    default:
      // 'all' - no date filter
      break;
  }

  return filter;
}

// Patients Report
async function getPatientsReport(dateFilter) {
  const patients = await Patient.find(dateFilter)
    .select('personal counselling surgery payments ops createdAt')
    .lean();

  if (!patients.length) return [{ 'Message': 'No patient data found' }];

  return patients.map(patient => ({
    'Patient ID': patient._id?.toString() || 'N/A',
    'Name': patient.personal?.name || 'N/A',
    'Phone': patient.personal?.phone || 'N/A',
    'Email': patient.personal?.email || 'N/A',
    'Age': patient.personal?.age || 'N/A',
    'Gender': patient.personal?.gender || 'N/A',
    'Location': patient.personal?.location || 'N/A',
    'Visit Date': patient.personal?.visitDate ? new Date(patient.personal.visitDate).toLocaleDateString() : 'N/A',
    'Counsellor': patient.counselling?.counsellor || 'N/A',
    'Ready for Surgery': patient.counselling?.readyForSurgery ? 'Yes' : 'No',
    'Surgery Date': patient.surgery?.surgeryDate ? new Date(patient.surgery.surgeryDate).toLocaleDateString() : 'N/A',
    'Total Quoted': patient.payments?.totalQuoted || 0,
    'Amount Received': patient.payments?.amountReceived || 0,
    'Pending Amount': patient.payments?.pendingAmount || 0,
    'Status': patient.ops?.status || 'N/A'
  }));
}

// Counsellors Report
async function getCounsellorsReport(dateFilter, specificCounsellor) {
  const matchStage = { ...dateFilter };
  
  if (specificCounsellor && specificCounsellor !== 'all') {
    matchStage['counselling.counsellor'] = specificCounsellor;
  } else {
    matchStage['counselling.counsellor'] = { $exists: true, $ne: '' };
  }

  const counsellors = await Patient.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$counselling.counsellor',
        totalPatients: { $sum: 1 },
        convertedPatients: {
          $sum: { $cond: [{ $eq: ['$counselling.readyForSurgery', true] }, 1, 0] }
        },
        totalRevenue: { $sum: '$payments.amountReceived' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  if (!counsellors.length) return [{ 'Message': 'No counsellor data found' }];

  return counsellors.map(counsellor => ({
    'Counsellor Name': counsellor._id || 'N/A',
    'Total Patients': counsellor.totalPatients,
    'Converted Patients': counsellor.convertedPatients,
    'Conversion Rate': counsellor.totalPatients ? 
      ((counsellor.convertedPatients / counsellor.totalPatients) * 100).toFixed(2) + '%' : '0%',
    'Total Revenue': counsellor.totalRevenue
  }));
}

// Agents Report
async function getAgentsReport(dateFilter, specificAgent) {
  const matchStage = { ...dateFilter };
  
  if (specificAgent && specificAgent !== 'all') {
    matchStage['personal.reference'] = specificAgent;
  } else {
    matchStage['personal.reference'] = { $exists: true, $ne: '' };
  }

  const agents = await Patient.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$personal.reference',
        totalPatients: { $sum: 1 },
        totalRevenue: { $sum: '$payments.amountReceived' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  if (!agents.length) return [{ 'Message': 'No agent data found' }];

  return agents.map(agent => ({
    'Agent Name': agent._id || 'N/A',
    'Total Patients': agent.totalPatients,
    'Total Revenue': agent.totalRevenue
  }));
}

// Implanters Report
async function getImplantersReport(dateFilter, specificImplanter) {
  const matchStage = { ...dateFilter };
  
  if (specificImplanter && specificImplanter !== 'all') {
    matchStage['$or'] = [
      { 'surgery.implanterRight': specificImplanter },
      { 'surgery.implanterLeft': specificImplanter }
    ];
  } else {
    matchStage['$or'] = [
      { 'surgery.implanterRight': { $exists: true, $ne: '' } },
      { 'surgery.implanterLeft': { $exists: true, $ne: '' } }
    ];
  }

  const patients = await Patient.find(matchStage)
    .select('surgery payments personal')
    .lean();

  if (!patients.length) return [{ 'Message': 'No implanter data found' }];

  const implanterMap = new Map();

  patients.forEach(patient => {
    const implanters = new Set();
    if (patient.surgery?.implanterRight) implanters.add(patient.surgery.implanterRight);
    if (patient.surgery?.implanterLeft) implanters.add(patient.surgery.implanterLeft);

    implanters.forEach(implanter => {
      if (!implanterMap.has(implanter)) {
        implanterMap.set(implanter, {
          totalPatients: 0,
          totalRevenue: 0,
          totalGrafts: 0
        });
      }
      const stats = implanterMap.get(implanter);
      stats.totalPatients++;
      stats.totalRevenue += patient.payments?.amountReceived || 0;
      stats.totalGrafts += patient.surgery?.graftsImplanted || 0;
    });
  });

  return Array.from(implanterMap.entries()).map(([name, stats]) => ({
    'Implanter Name': name,
    'Total Patients': stats.totalPatients,
    'Total Revenue': stats.totalRevenue,
    'Total Grafts': stats.totalGrafts
  }));
}

// Technicians Report
async function getTechniciansReport(dateFilter, specificTech) {
  const matchStage = { ...dateFilter, 'surgery.seniorTech': { $exists: true, $ne: '' } };
  
  if (specificTech && specificTech !== 'all') {
    matchStage['surgery.seniorTech'] = specificTech;
  }

  const technicians = await Patient.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$surgery.seniorTech',
        totalPatients: { $sum: 1 },
        totalRevenue: { $sum: '$payments.amountReceived' },
        totalGrafts: { $sum: '$surgery.graftsImplanted' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  if (!technicians.length) return [{ 'Message': 'No technician data found' }];

  return technicians.map(tech => ({
    'Technician Name': tech._id || 'N/A',
    'Total Patients': tech.totalPatients,
    'Total Revenue': tech.totalRevenue,
    'Total Grafts': tech.totalGrafts
  }));
}

// Techniques Report
async function getTechniquesReport(dateFilter, specificTechnique) {
  const matchStage = { ...dateFilter, 'surgery.technique': { $exists: true, $ne: '' } };
  
  if (specificTechnique && specificTechnique !== 'all') {
    matchStage['surgery.technique'] = specificTechnique;
  }

  const techniques = await Patient.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$surgery.technique',
        totalPatients: { $sum: 1 },
        totalRevenue: { $sum: '$payments.amountReceived' },
        totalGrafts: { $sum: '$surgery.graftsImplanted' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  if (!techniques.length) return [{ 'Message': 'No technique data found' }];

  return techniques.map(tech => ({
    'Technique': tech._id || 'N/A',
    'Total Patients': tech.totalPatients,
    'Total Revenue': tech.totalRevenue,
    'Total Grafts': tech.totalGrafts
  }));
}

// Transactions Report
async function getTransactionsReport(dateFilter) {
  const patients = await Patient.find(dateFilter)
    .select('personal payments')
    .lean();

  const transactions = [];

  patients.forEach(patient => {
    if (patient.payments?.transactions) {
      patient.payments.transactions.forEach(transaction => {
        transactions.push({
          'Patient Name': patient.personal?.name || 'N/A',
          'Date': transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A',
          'Method': transaction.method || 'N/A',
          'Service': transaction.service || 'N/A',
          'Amount': transaction.amount || 0
        });
      });
    }
  });

  if (!transactions.length) return [{ 'Message': 'No transaction data found' }];

  return transactions;
}

// Status Report
async function getStatusReport(dateFilter) {
  const statusData = await Patient.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$ops.status',
        totalPatients: { $sum: 1 },
        totalRevenue: { $sum: '$payments.amountReceived' }
      }
    },
    { $sort: { totalPatients: -1 } }
  ]);

  if (!statusData.length) return [{ 'Message': 'No status data found' }];

  return statusData.map(status => ({
    'Status': status._id || 'N/A',
    'Total Patients': status.totalPatients,
    'Total Revenue': status.totalRevenue
  }));
}


// Add this to your existing API route
async function getFilteredPatientsReport(dateFilter, staffFilter, techniqueFilter, statusFilter) {
  let matchStage = { ...dateFilter };
  
  // Add staff filter (counsellors, implanters, technicians)
  if (staffFilter) {
    matchStage['$or'] = [
      { 'counselling.counsellor': staffFilter },
      { 'surgery.implanterRight': staffFilter },
      { 'surgery.implanterLeft': staffFilter },
      { 'surgery.seniorTech': staffFilter }
    ];
  }
  
  // Add technique filter
  if (techniqueFilter) {
    matchStage['surgery.technique'] = techniqueFilter;
  }
  
  // Add status filter
  if (statusFilter) {
    matchStage['ops.status'] = statusFilter;
  }

  const patients = await Patient.find(matchStage)
    .select('personal counselling surgery payments ops createdAt')
    .lean();

  if (!patients.length) return [{ 'Message': 'No patient data found with the selected filters' }];

  return patients.map(patient => ({
    'Patient ID': patient._id?.toString() || 'N/A',
    'Name': patient.personal?.name || 'N/A',
    'Phone': patient.personal?.phone || 'N/A',
    'Email': patient.personal?.email || 'N/A',
    'Age': patient.personal?.age || 'N/A',
    'Gender': patient.personal?.gender || 'N/A',
    'Location': patient.personal?.location || 'N/A',
    'Counsellor': patient.counselling?.counsellor || 'N/A',
    'Technique': patient.surgery?.technique || 'N/A',
    'Status': patient.ops?.status || 'N/A',
    'Ready for Surgery': patient.counselling?.readyForSurgery ? 'Yes' : 'No',
    'Total Quoted': patient.payments?.totalQuoted || 0,
    'Amount Received': patient.payments?.amountReceived || 0,
    'Pending Amount': patient.payments?.pendingAmount || 0,
    'Created Date': patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'
  }));
}