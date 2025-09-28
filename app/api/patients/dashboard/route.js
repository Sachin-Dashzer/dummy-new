import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req) {
  await dbConnect();

  const data = await req.json();
  const { branch = "All", from, to } = data;

  const branchFilter = branch === "All" ? {} : { "personal.location": branch };

  const today = new Date();
  const defaultFrom = new Date(today);
  defaultFrom.setHours(0, 0, 0, 0);

  const defaultTo = new Date(today);
  defaultTo.setHours(23, 59, 59, 999);

  const fromDate = from ? new Date(from) : defaultFrom;
  fromDate.setHours(0, 0, 0, 0);

  const toDate = to ? new Date(to) : defaultTo;
  toDate.setHours(23, 59, 59, 999);

  // ✅ Date range filter
  const dateRangeFilter = {
    $gte: fromDate,
    $lte: toDate,
  };

  // ✅ Last 7 days and last 30 days ranges
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 29);
  last30Days.setHours(0, 0, 0, 0);

  // ✅ Helper: revenue by method
  const revenueByMethod = (dateFilter) => [
    { $match: branchFilter },
    { $unwind: "$payments.transactions" },
    { $match: { "payments.transactions.date": dateFilter } },
    {
      $group: {
        _id: "$payments.transactions.method",
        total: { $sum: "$payments.transactions.amount" },
      },
    },
  ];

  // ✅ Helper: revenue by technique
  const revenueByTechnique = (dateFilter) => [
    { $match: branchFilter },
    { $unwind: "$payments.transactions" },
    { $match: { "payments.transactions.date": dateFilter } },
    {
      $group: {
        _id: "$surgery.technique",
        total: { $sum: "$payments.transactions.amount" },
      },
    },
  ];

  // ✅ Helper: revenue per day
  const revenuePerDay = (dateFilter) => [
    { $match: branchFilter },
    { $unwind: "$payments.transactions" },
    { $match: { "payments.transactions.date": dateFilter } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$payments.transactions.date" },
        },
        total: { $sum: "$payments.transactions.amount" },
      },
    },
    { $sort: { _id: 1 } },
  ];

  // ✅ Run queries in parallel
  const [
    appointmentsCount,
    visitedCount,
    surgeryConfirmCount,
    surgeriesCount,
    revenueAgg,
    last7DaysByDay,
    last7DaysByMethod,
    last7DaysByTech,
    last30DaysByDay,
    last30DaysByMethod,
    last30DaysByTech,
  ] = await Promise.all([
    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
    }),
   
    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.counsellor": { $exists: true },
    }),
   
    Patient.countDocuments({
      ...branchFilter,
      "personal.visitDate": dateRangeFilter,
      "counselling.readyForSurgery": true,
    }),
   
    Patient.countDocuments({
      ...branchFilter,
      "surgery.surgeryDate": dateRangeFilter,
    }),
   
    // ✅ Revenue by method (current range)
    Patient.aggregate(revenueByMethod(dateRangeFilter)),


    // ✅ Last 7 days
    Patient.aggregate(revenuePerDay({ $gte: last7Days, $lte: today })),
    Patient.aggregate(revenueByMethod({ $gte: last7Days, $lte: today })),
    Patient.aggregate(revenueByTechnique({ $gte: last7Days, $lte: today })),

    // ✅ Last 30 days
    Patient.aggregate(revenuePerDay({ $gte: last30Days, $lte: today })),
    Patient.aggregate(revenueByMethod({ $gte: last30Days, $lte: today })),
    Patient.aggregate(revenueByTechnique({ $gte: last30Days, $lte: today })),
  ]);

  // ✅ Totals
  const amountReceived = revenueAgg.reduce((sum, r) => sum + (r.total || 0), 0);
  const last7DaysTotal = last7DaysByDay.reduce((sum, r) => sum + (r.total || 0), 0);
  const last30DaysTotal = last30DaysByDay.reduce((sum, r) => sum + (r.total || 0), 0);

  return NextResponse.json({
    dateRange: {
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    },
    branch: branch === "All" ? "All" : branch,
    appointments: appointmentsCount, 
    visited: visitedCount,
    surgeryConfirmations: surgeryConfirmCount,
    surgeries: surgeriesCount,

    // ✅ Current range
    amountReceived,

    // ✅ Last 7 days
    last7Days: {
      total: last7DaysTotal,
      amountByMethod: last7DaysByMethod,
      amountByTechnique: last7DaysByTech,
      perDay: last7DaysByDay.map((d) => ({ date: d._id, total: d.total })),
    },

    // ✅ Last 30 days
    last30Days: {
      total: last30DaysTotal,
      amountByMethod: last30DaysByMethod,
      amountByTechnique: last30DaysByTech,
      perDay: last30DaysByDay.map((d) => ({ date: d._id, total: d.total })),
    },
  });
}
