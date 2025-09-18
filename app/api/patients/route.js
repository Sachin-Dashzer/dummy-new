import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";



// POST new patient
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const response = await Patient.insertMany(body);
  return NextResponse.json(response);
}
