import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { oldPin, newPin } = await req.json();

    if (!newPin || newPin.length !== 4) {
      return NextResponse.json(
        { error: "PIN must be 4 digits" },
        { status: 400 }
      );
    }

    // 1️⃣ Get user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🟢 CASE 1: PIN not set yet → Just set it
    if (!user.transaction_pin) {
      const hashedPin = await bcrypt.hash(newPin, 10);

      await supabase
        .from("users")
        .update({ transaction_pin: hashedPin })
        .eq("user_id", user.user_id);

      return NextResponse.json({
        success: true,
        message: "PIN set successfully",
      });
    }

    // 🔵 CASE 2: PIN exists → Require old PIN
    if (!oldPin) {
      return NextResponse.json(
        { error: "Current PIN required" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(oldPin, user.transaction_pin);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect current PIN" },
        { status: 401 }
      );
    }

    const hashedPin = await bcrypt.hash(newPin, 10);

    await supabase
      .from("users")
      .update({ transaction_pin: hashedPin })
      .eq("user_id", user.user_id);

    return NextResponse.json({
      success: true,
      message: "PIN updated successfully",
    });

  } catch (err) {
    console.error("Update PIN error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
