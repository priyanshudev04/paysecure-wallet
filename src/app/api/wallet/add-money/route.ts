import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // 1️⃣ Get access token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify token
    const user = await verifyAccessToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ Get current balance
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("user_id", user.userId)
      .single();

    if (fetchError) throw fetchError;

    const newBalance = (existingUser?.balance || 0) + amount;

    // 4️⃣ Update balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("user_id", user.userId);

    if (updateError) throw updateError;

    // 5️⃣ Insert transaction record
    const { error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.userId,
          type: "credit",
          amount,
          description: `Added via HDFC Bank`,
          source: "HDFC Bank",
          category: "top-up",
        },
      ]);

    if (transactionError) throw transactionError;

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
