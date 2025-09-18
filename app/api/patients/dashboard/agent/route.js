import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const me = getUserFromCookie();
  if (!me) return NextResponse.json({ message:"Unauthorized" }, { status:401 });
  await dbConnect();

  const total = await Patient.countDocuments();
  const byLocation = await Patient.aggregate([{ $group:{ _id:"$personal.location", count:{ $sum:1 } } }]);
  const byPackage = await Patient.aggregate([{ $group:{ _id:"$personal.package", count:{ $sum:1 } } }]);
  const upcomingVisits = await Patient.find({ "personal.visitDate": { $gte: new Date() } })
    .select("personal.name personal.phone personal.location personal.visitDate")
    .sort({ "personal.visitDate": 1 }).limit(20);

  return NextResponse.json({ total, byLocation, byPackage, upcomingVisits });
}
