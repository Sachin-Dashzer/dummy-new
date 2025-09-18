import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function GET() {
  await dbConnect();
  const [locations, techniques, counsellors] = await Promise.all([
    Patient.distinct("personal.location"),
    Patient.distinct("counselling.techniqueSuggested"),
    Patient.distinct("counselling.counsellor"),
  ]);
  return NextResponse.json({ locations, techniques, counsellors });
}
