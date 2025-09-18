import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  await dbConnect();
  const { name, email, phone, password, role } = await req.json();
  try {
    const user = await User.create({ name, email, phone, password, role });
    const token = signToken(user);
    const res = NextResponse.json({ message: "Registered", role: user.role });
    res.cookies.set("crm_token", token, { httpOnly: true, path: "/" });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
