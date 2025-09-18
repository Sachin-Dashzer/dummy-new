import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function getUserFromCookie() {
  const cookieStore = cookies();
  const token = cookieStore.get("crm_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch {
    return null;
  }
}
