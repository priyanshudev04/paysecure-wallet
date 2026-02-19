import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  getOtpData,
  incrementAttempts,
  deleteOtp,
  MAX_OTP_ATTEMPTS,
} from "@/lib/redis";
import { supabaseAdmin } from "@/lib/supabase";
import {
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
} from "@/lib/auth";

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^91(?=\d{10})/, '') || phone;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawPhone = body?.phoneNumber || '';
    const phoneNumber = normalizePhone(String(rawPhone).trim());
    const otp = body?.otp?.toString().trim() || '';

    if (!phoneNumber || !otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const otpData = await getOtpData(phoneNumber);

    if (!otpData) {
      return NextResponse.json(
        { error: "OTP expired or not requested" },
        { status: 400 }
      );
    }

    if (otpData.attempts >= MAX_OTP_ATTEMPTS) {
      await deleteOtp(phoneNumber);
      return NextResponse.json(
        { error: "Max attempts reached. Request a new OTP." },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, otpData.otp);

    if (!isValid) {
      await incrementAttempts(phoneNumber, otpData);
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ✅ OTP Verified
    await deleteOtp(phoneNumber);

    // 🔹 Get or Create User
    let { data: user } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (!user) {
      const { data: newUser, error: createError } =
        await supabaseAdmin
          .from("users")
          .insert([{ phone_number: phoneNumber, is_verified: true }])
          .select()
          .single();

      if (createError) throw createError;
      user = newUser;
    } else if (!user.is_verified) {
      await supabaseAdmin
        .from("users")
        .update({ is_verified: true })
        .eq("user_id", user.user_id);
    }

    const payload = {
      userId: user.user_id,
      phoneNumber: user.phone_number,
    };

    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // ✅ CREATE RESPONSE FIRST
    const response = NextResponse.json({
      message: "Login successful",
      user,
    });

    // ✅ SET COOKIES PROPERLY
    return setAuthCookies(response, accessToken, refreshToken);

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
