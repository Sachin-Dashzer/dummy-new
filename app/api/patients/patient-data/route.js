import Patient from "@/models/Patient";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";

export async function GET(req) {
  await dbConnect();

  // ✅ Extract id from query string
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Please provide a valid id" },
      { status: 400 }
    );
  }

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      );
    }

    // ✅ Send patient directly so frontend can use `setPatientData(data)`
    return NextResponse.json(patient, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching patient", error: error.message },
      { status: 500 }
    );
  }
}
