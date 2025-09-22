import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  // const me = getUserFromCookie();
  // if (!me || me.role !== "Admin") return NextResponse.json({ message:"Admin only" }, { status:403 });
  
  try {
    await dbConnect();
    
    // Parse the request body
    const body = await req.json();
    
    // Check if users array exists and is valid
    if (!body || !Array.isArray(body.users)) {
      return NextResponse.json(
        { error: "Invalid request: 'users' array is required" },
        { status: 400 }
      );
    }
    
    const { users } = body;
    const created = [];
    
    for (const u of users) {
      try { 
        const user = new User(u); 
        await user.save(); 
        created.push(user._id); 
      }
      catch (e) { 
        console.log(`Failed to create user ${u.email}:`, e.message);
        // ignore duplicates or other errors
      }
    }
    
    return NextResponse.json({ ok:true, count: created.length, ids: created });
    
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}