import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req) {
  await dbConnect();

  const data = await req.json();
  const { branch = "All", from, to } = data;

  console.log(data);

  // ✅ Common filter for branch
  const branchFilter = branch === "All" ? {} : { "personal.location": branch };

  // ✅ Default dates → today if not provided
  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setHours(0, 0, 0, 0); // start of today

  const defaultTo = new Date(today);
  defaultTo.setHours(23, 59, 59, 999); // end of today

  const fromDate = from ? new Date(from) : defaultFrom;
  fromDate.setHours(0, 0, 0, 0);

  const toDate = to ? new Date(to) : defaultTo;
  toDate.setHours(23, 59, 59, 999);

  // ✅ Date range filter
  const dateRangeFilter = {
    $gte: fromDate,
    $lte: toDate,
  };

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
      "personal.visitDate": dateRangeFilter,
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
    }),

    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.counsellor": { $exists: true },
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.counsellor": { $exists: true },
    }),

    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.readyForSurgery": true,
    }),
    Patient.find({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.readyForSurgery": true,
    }),

    Patient.countDocuments({
      ...branchFilter,
      "surgery.surgeryDate": dateRangeFilter,
    }),
    Patient.find({
      ...branchFilter,
      "surgery.surgeryDate": dateRangeFilter,
    }),

    // ✅ Revenue aggregation - filter by transaction date range only
    Patient.aggregate([
      {
        $match: branchFilter,
      },
      {
        $unwind: {
          path: "$payments.transactions",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "payments.transactions.date": dateRangeFilter,
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
    dateRange: {
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    },
    branch: branch === "All" ? "All" : branch,
    appointments: [appointmentsCount, appointmentsDocs],
    visited: [visitedCount, visitedDocs],
    surgeryConfirmations: [surgeryConfirmCount, surgeryConfirmDocs],
    surgeries: [surgeriesCount, surgeriesDocs],
    amountReceived,
    amountByMethod: revenueAgg,
  });
}
