import { createHmac, timingSafeEqual } from "node:crypto";

export type AuthRole = "renter" | "admin";

export const SESSION_COOKIE = "ev_car_rent_session";

const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const AUTH_SECRET = process.env.AUTH_SECRET ?? "ev-car-rent-local-prototype-secret-2026";

type SessionPayload = {
  role: AuthRole;
  expiresAt: number;
};

function sign(payload: string) {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(role: AuthRole) {
  const payload: SessionPayload = {
    role,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, suppliedSignature] = token.split(".");
  if (!encodedPayload || !suppliedSignature) return null;

  const expectedSignature = sign(encodedPayload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      !["renter", "admin"].includes(payload.role) ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const sessionMaxAge = SESSION_DURATION_SECONDS;
