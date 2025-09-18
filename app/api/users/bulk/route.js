import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  const me = getUserFromCookie();
  if (!me || me.role !== "Admin") return NextResponse.json({ message:"Admin only" }, { status:403 });
  await dbConnect();
  const { users } = await req.json(); // array of {name,email,phone,password,role}
  const created = [];
  for (const u of users) {
    try { const user = new User(u); await user.save(); created.push(user._id); }
    catch (e) { /* ignore duplicates */ }
  }
  return NextResponse.json({ ok:true, count: created.length, ids: created });
}
