import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req) {
  await dbConnect();

  const data = await req.json();
  const { branch = "All", date } = data;

  // ✅ Common filter for branch
  const branchFilter = branch === "All" ? {} : { "personal.location": branch };

  // ✅ Convert date once
  const visitDate = new Date(date);
  const nextDay = new Date(visitDate);
  nextDay.setDate(visitDate.getDate() + 1);

  // ✅ Run all queries in parallel
  const [
    appointmentsCount,
    appointmentsDocs,
    visitedCount,
    visitedDocs,
    surgeryConfirmCount,
    surgeryConfirmDocs,
    surgeriesCount,
    surgeriesDocs,
    revenueAgg,
  ] = await Promise.all([
    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": visitDate,
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": visitDate,
    }),

    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": visitDate,
      "counselling.counsellor": { $exists: true },
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": visitDate,
      "counselling.counsellor": { $exists: true },
    }),

    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": visitDate,
      "counselling.readyForSurgery": true,
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": visitDate,
      "counselling.readyForSurgery": true,
    }),

    Patient.countDocuments({
      ...branchFilter,
      "surgery.surgeryDate": visitDate,
    }),
    Patient.find({
      ...branchFilter,
      "surgery.surgeryDate": visitDate,
    }),

    // ✅ Fixed revenue aggregation - filter by transaction date
    Patient.aggregate([
      {
        $match: branchFilter ,
        $match: {
          "payments.transactions.date": visitDate,
        },
      },
      {
        $unwind: {
          path: "$payments.transactions",
          preserveNullAndEmptyArrays: false, // Changed to false to exclude documents without transactions
        },
      },

      {
        $group: {
          _id: "$payments.transactions.method",
          total: { $sum: "$payments.transactions.amount" },
        },
      },
    ]),
  ]);

  // ✅ Revenue calculation
  const amountReceived = revenueAgg.reduce((sum, r) => sum + (r.total || 0), 0);

  return NextResponse.json({
    appointments: [appointmentsCount, appointmentsDocs],
    visited: [visitedCount, visitedDocs],
    surgeryConfirmations: [surgeryConfirmCount, surgeryConfirmDocs],
    surgeries: [surgeriesCount, surgeriesDocs],
    amountReceived,
    amountByMethod: revenueAgg,
  });
}
