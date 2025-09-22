
import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";



export async function GET() {
    
    await dbConnect();
    const users = await User.find({}).select("-password");
    return NextResponse.json({lenght : users.length , user :  users  });
}