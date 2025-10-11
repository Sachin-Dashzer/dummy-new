// app/api/agents/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient"; // Your Patient schema

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "day"; // day | week | month

    // ----------------- DATE FILTER -----------------
    const now = new Date();
    let fromDate;
    if (filter === "day") {
      fromDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (filter === "week") {
      fromDate = new Date();
      fromDate.setDate(now.getDate() - 7);
    } else if (filter === "month") {
      fromDate = new Date();
      fromDate.setMonth(now.getMonth() - 1);
    }

    // ----------------- AGGREGATION -----------------
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: fromDate },
          "personal.reference": { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$personal.reference", // <-- agent name
          totalSales: { $sum: "$payments.amountReceived" },
          totalPatients: { $sum: 1 },
          techniques: { $push: "$surgery.technique" },
          counsellingTechniques: { $push: "$counselling.techniqueSuggested" },
        },
      },
      {
        $addFields: {
          avgRevenue: {
            $cond: [
              { $eq: ["$totalPatients", 0] },
              0,
              { $divide: ["$totalSales", "$totalPatients"] },
            ],
          },
        },
      },
      { $sort: { totalSales: -1 } },
    ];

    const results = await Patient.aggregate(pipeline);

    // ----------------- RESHAPE -----------------
    const agents = results.map((a) => {
      const techniqueCounts = {};
      [...(a.techniques || []), ...(a.counsellingTechniques || [])].forEach(
        (t) => {
          if (t) {
            techniqueCounts[t] = (techniqueCounts[t] || 0) + 1;
          }
        }
      );

      return {
        name: a._id,
        totalSales: a.totalSales,
        totalPatients: a.totalPatients,
        avgRevenue: Math.round(a.avgRevenue),
        techniques: techniqueCounts,
      };
    });

    return NextResponse.json({ success: true, data: agents });
  } catch (err) {
    console.error("Agent API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
