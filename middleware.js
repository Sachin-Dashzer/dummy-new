import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("crm_token")?.value;
  const path = req.nextUrl.pathname;
  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
