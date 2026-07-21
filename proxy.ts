import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";

const destinations = {
  renter: "/renter/account",
  admin: "/admin/dashboard",
} as const;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL(destinations[session.role], request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestedRole = pathname.startsWith("/admin") ? "admin" : "renter";
  if (session.role !== requestedRole) {
    return NextResponse.redirect(new URL(destinations[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/renter/:path*"],
};
