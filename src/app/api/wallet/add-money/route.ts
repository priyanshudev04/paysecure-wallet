import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawAmount = body?.amount;
    const amount = Number(rawAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Get user safely
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("balance")
      .eq("user_id", payload.userId)
      .maybeSingle();

    if (fetchError) {
      console.error(fetchError);
      return NextResponse.json(
        { error: "User fetch failed" },
        { status: 500 }
      );
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newBalance = (existingUser.balance || 0) + amount;

    // 🔹 Update balance
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ balance: newBalance })
      .eq("user_id", payload.userId);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Failed to update balance" },
        { status: 500 }
      );
    }

    // 🔹 Insert transaction
    const { error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          user_id: payload.userId,
          type: "credit",
          amount,
          description: "Added via HDFC Bank",
          source: "HDFC Bank",
          category: "top-up",
        },
      ]);

    if (transactionError) {
      console.error(transactionError);
      return NextResponse.json(
        { error: "Transaction insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Money added successfully",
      balance: newBalance,
    });

  } catch (error) {
    console.error("Add Money Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
