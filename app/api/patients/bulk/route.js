import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req) {
  await dbConnect();
  const patients = await req.json();
  try {
    const created = await Patient.insertMany(patients);
    return NextResponse.json({ count: created.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
