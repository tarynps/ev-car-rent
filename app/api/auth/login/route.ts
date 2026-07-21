import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionMaxAge,
  type AuthRole,
} from "@/lib/auth-session";

const accounts: Record<AuthRole, string> = {
  renter: "ev-renter@gmail.com",
  admin: "ev-admin@gmail.com",
};

export async function POST(request: Request) {
  let credentials: { role?: string; email?: string; password?: string };

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const role = credentials.role as AuthRole;
  const isValidRole = role === "renter" || role === "admin";
  const isValidAccount = isValidRole && accounts[role] === credentials.email;
  const isValidPassword = credentials.password === "Mtel2026!";

  if (!isValidAccount || !isValidPassword) {
    return NextResponse.json(
      { message: "The account or password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ role });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(role),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });

  return response;
}
