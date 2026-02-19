import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import {
  isRefreshTokenUsed,
  markRefreshTokenUsed,
} from "@/lib/redis";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const jti = payload.jti;
    if (jti && (await isRefreshTokenUsed(jti))) {
      return NextResponse.json(
        { error: "Refresh token reuse detected" },
        { status: 401 }
      );
    }

    if (jti) {
      await markRefreshTokenUsed(jti);
    }

    const newAccessToken = await signAccessToken({
      userId: payload.userId,
      phoneNumber: payload.phoneNumber,
    });

    const newRefreshToken = await signRefreshToken({
      userId: payload.userId,
      phoneNumber: payload.phoneNumber,
    });

    const response = NextResponse.json({
      message: "Token refreshed",
    });

    return setAuthCookies(response, newAccessToken, newRefreshToken);

  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
