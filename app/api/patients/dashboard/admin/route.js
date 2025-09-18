import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const me = getUserFromCookie();
  if (!me) return NextResponse.json({ message:"Unauthorized" }, { status:401 });
  await dbConnect();

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);

  const todaysPatients = await Patient.countDocuments({ "personal.visitDate": { $gte:start, $lte:end } });
  const todaysSurgeries = await Patient.countDocuments({ "surgery.surgeryDate": { $gte:start, $lte:end } });
  const readyForSurgery = await Patient.countDocuments({ "counselling.readyForSurgery": true });

  const revenueByMethod = await Patient.aggregate([
    { $unwind: { path: "$payments.transactions", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$payments.transactions.method", total: { $sum: "$payments.transactions.amount" } } }
  ]);
  const revenueByLocation = await Patient.aggregate([
    { $unwind: { path: "$payments.transactions", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$personal.location", total: { $sum: "$payments.transactions.amount" } } }
  ]);

  return NextResponse.json({ todaysPatients, todaysSurgeries, readyForSurgery, revenueByMethod, revenueByLocation });
}
