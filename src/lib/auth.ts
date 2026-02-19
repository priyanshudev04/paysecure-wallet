import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";


const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET!
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!
);

export interface JWTPayload {
  userId: string;
  phoneNumber: string;
}

// 🔹 ACCESS TOKEN
export async function signAccessToken(payload: JWTPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

// 🔹 REFRESH TOKEN (with jti for rotation / reuse detection)
export async function signRefreshToken(payload: JWTPayload) {
  return new SignJWT({
    ...payload,
    jti: crypto.randomUUID(),
  } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

// 🔹 VERIFY ACCESS TOKEN
export async function verifyAccessToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// 🔹 VERIFY REFRESH TOKEN (returns payload including jti for rotation)
export async function verifyRefreshToken(
  token: string
): Promise<(JWTPayload & { jti?: string }) | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as JWTPayload & { jti?: string };
  } catch {
    return null;
  }
}

// 🔹 SET COOKIES (NEW SAFE WAY)
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}


export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
