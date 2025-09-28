import Patient from "@/models/Patient";
import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  await dbConnect();

  try {
    // Counsellors Statistics
    const counsellorStats = await Patient.aggregate([
      {
        $match: {
          "counselling.counsellor": { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$counselling.counsellor",
          totalPatients: { $sum: 1 },
          convertedPatients: {
            $sum: { $cond: [{ $eq: ["$counselling.readyForSurgery", true] }, 1, 0] }
          },
          totalRevenue: { $sum: "$payments.amountReceived" }
        }
      },
      {
        $project: {
          name: "$_id",
          role: "Counsellor",
          totalPatients: 1,
          convertedPatients: 1,
          totalRevenue: 1,
          conversionRate: {
            $round: [{ $multiply: [{ $divide: ["$convertedPatients", "$totalPatients"] }, 100] }, 2]
          },
          _id: 0
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Implanters Statistics
    const implanterStats = await Patient.aggregate([
      {
        $match: {
          $or: [
            { "surgery.implanterRight": { $exists: true, $ne: null, $ne: "" } },
            { "surgery.implanterLeft": { $exists: true, $ne: null, $ne: "" } }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $and: [
                { $ne: ["$surgery.implanterRight", null] },
                { $ne: ["$surgery.implanterRight", ""] }
              ]},
              "$surgery.implanterRight",
              "$surgery.implanterLeft"
            ]
          },
          totalPatients: { $sum: 1 },
          totalRevenue: { $sum: "$payments.amountReceived" },
          totalGrafts: { $sum: "$surgery.graftsImplanted" }
        }
      },
      {
        $project: {
          name: "$_id",
          role: "Implanter",
          totalPatients: 1,
          totalRevenue: 1,
          totalGrafts: 1,
          averageGraftsPerPatient: {
            $round: [{ $divide: ["$totalGrafts", "$totalPatients"] }, 2]
          },
          _id: 0
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Technicians Statistics
    const technicianStats = await Patient.aggregate([
      {
        $match: {
          "surgery.seniorTech": { $exists: true, $ne: null, $ne: "" }
        }
      },
      {
        $group: {
          _id: "$surgery.seniorTech",
          totalPatients: { $sum: 1 },
          totalRevenue: { $sum: "$payments.amountReceived" },
          totalGrafts: { $sum: "$surgery.graftsImplanted" }
        }
      },
      {
        $project: {
          name: "$_id",
          role: "Technician",
          totalPatients: 1,
          totalRevenue: 1,
          totalGrafts: 1,
          averageGraftsPerPatient: {
            $round: [{ $divide: ["$totalGrafts", "$totalPatients"] }, 2]
          },
          _id: 0
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    const allStats = {
      counsellors: counsellorStats,
      implanters: implanterStats,
      technicians: technicianStats,
    };

    if (!counsellorStats.length && !implanterStats.length && !technicianStats.length) {
      return Response.json({ 
        message: "No staff data found" 
      }, { status: 404 });
    }

    const overallStats = {
      totalCounsellors: counsellorStats.length,
      totalImplanters: implanterStats.length,
      totalTechnicians: technicianStats.length,
      totalStaff: counsellorStats.length + implanterStats.length + technicianStats.length
    };

    return Response.json({
      success: true,
      data: allStats,
      overall: overallStats
    });

  } catch (error) {
    return Response.json({ 
      success: false,
      message: "Error fetching staff statistics",
      error: error.message 
    }, { status: 500 });
  }
}