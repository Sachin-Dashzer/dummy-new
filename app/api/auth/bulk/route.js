import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  await dbConnect();
  const users = await req.json();
  try {
    const created = await User.insertMany(users);
    return NextResponse.json({ count: created.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
