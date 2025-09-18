import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

// GET patients
export async function GET(req) {
  await dbConnect();

  const params = new URL(req.url).searchParams;
  const filter = {};

  if (params.get("location"))
    filter["personal.location"] = params.get("location");
  if (params.get("status")) filter["ops.status"] = params.get("status");

  const patients = await Patient.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  return NextResponse.json({ items: patients });
}