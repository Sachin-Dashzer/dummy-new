import { NextResponse } from 'next/server';
import Patient from '@/models/Patient';
import { dbConnect } from '@/lib/mongodb';

export async function GET() {
  await dbConnect();

  try {
    // Get all staff names (counsellors, implanters, technicians)
    const counsellors = await Patient.distinct('counselling.counsellor', {
      'counselling.counsellor': { $exists: true, $ne: '' }
    });
    
    const implantersRight = await Patient.distinct('surgery.implanterRight', {
      'surgery.implanterRight': { $exists: true, $ne: '' }
    });
    
    const implantersLeft = await Patient.distinct('surgery.implanterLeft', {
      'surgery.implanterLeft': { $exists: true, $ne: '' }
    });
    
    const technicians = await Patient.distinct('surgery.seniorTech', {
      'surgery.seniorTech': { $exists: true, $ne: '' }
    });
    
    // Combine all staff and remove duplicates
    const allStaff = [...new Set([...counsellors, ...implantersRight, ...implantersLeft, ...technicians])].filter(Boolean);

    // Get techniques
    const techniques = await Patient.distinct('surgery.technique', {
      'surgery.technique': { $exists: true, $ne: '' }
    });

    // Get statuses
    const status = await Patient.distinct('ops.status', {
      'ops.status': { $exists: true, $ne: '' }
    });

    return NextResponse.json({
      success: true,
      data: {
        staff: allStaff,
        techniques: techniques.filter(Boolean),
        status: status.filter(Boolean)
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error fetching filter options",
      error: error.message
    }, { status: 500 });
  }
}