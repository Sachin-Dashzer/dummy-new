import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function POST(req) {
  await dbConnect();
  
  try {
    const patientData = await req.json();
    
    // Create a single patient
    const createdPatient = await Patient.create(patientData);
    
    return NextResponse.json({ 
      success: true, 
      patient: createdPatient,
      message: "Patient registered successfully" 
    });
    
  } catch (e) {
    return NextResponse.json({ 
      error: e.message,
      success: false 
    }, { status: 400 });
  }
}