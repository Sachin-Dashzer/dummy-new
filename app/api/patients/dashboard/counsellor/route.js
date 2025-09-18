import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const me = getUserFromCookie();
  if (!me) return NextResponse.json({ message:"Unauthorized" }, { status:401 });
  await dbConnect();
  const mine = await Patient.countDocuments({ "counselling.counsellor": me.name });
  const ready = await Patient.countDocuments({ "counselling.readyForSurgery": true });
  const byTechnique = await Patient.aggregate([{ $group:{ _id:"$counselling.techniqueSuggested", count:{ $sum:1 } } }]);
  const byPackageQuoted = await Patient.aggregate([{ $group:{ _id:"$counselling.packageQuoted", count:{ $sum:1 } } }]);
  return NextResponse.json({ counsellingCount: mine, readyForSurgery: ready, byTechnique, byPackageQuoted });
}
