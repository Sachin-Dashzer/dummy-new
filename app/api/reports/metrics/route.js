import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function GET() {
  await dbConnect();
  const appointments = await Patient.countDocuments();
  const visited = await Patient.countDocuments({ "ops.status": "VISITED" });
  const surgeryConfirmations = await Patient.countDocuments({ "counselling.readyForSurgery": true });
  const surgeries = await Patient.countDocuments({ "ops.status": "SURGERY_SCHEDULED" });
  const revenue = await Patient.aggregate([
    { $unwind: { path: "$payments.transactions", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$payments.transactions.method", total: { $sum: "$payments.transactions.amount" } } }
  ]);
  return NextResponse.json({
    appointments, visited, surgeryConfirmations, surgeries,
    amountReceived: revenue.reduce((a,b)=>a+(b.total||0),0),
    amountByMethod: revenue
  });
}
