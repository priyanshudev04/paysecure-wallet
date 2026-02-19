import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const bankName = body?.bankName?.trim();
    const accountNumber = body?.accountNumber?.trim();
    const ifsc = body?.ifsc?.trim().toUpperCase();
    const accountHolderName = body?.accountHolderName?.trim();

    if (!bankName || !accountNumber || !ifsc || !accountHolderName) {
      return NextResponse.json(
        { error: "All bank fields are required" },
        { status: 400 }
      );
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
      return NextResponse.json(
        { error: "Invalid account number" },
        { status: 400 }
      );
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      return NextResponse.json(
        { error: "Invalid IFSC code (e.g. HDFC0001234)" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        bank_name: bankName,
        bank_account_number: accountNumber,
        bank_ifsc: ifsc,
        bank_account_holder: accountHolderName,
      })
      .eq("user_id", payload.userId);

    if (error) {
      console.error("Link bank error:", error);
      return NextResponse.json(
        { error: "Failed to link bank. Check if columns exist in users table." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bank linked successfully",
    });
  } catch (err) {
    console.error("Link bank error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
