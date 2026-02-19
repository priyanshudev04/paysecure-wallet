import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    /* ================= AUTH ================= */

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    /* ================= BODY ================= */

    const { receiverPhone, amount, pin } = await req.json();

    const cleanPhone = receiverPhone?.trim();
    const cleanAmount = Number(amount);

    if (!cleanPhone || !cleanAmount || cleanAmount <= 0 || !pin) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    /* ================= GET SENDER ================= */

    const { data: sender, error: senderError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("user_id", payload.userId)
      .maybeSingle();

    if (senderError) {
      console.error(senderError);
      return NextResponse.json({ error: "Sender fetch failed" }, { status: 500 });
    }

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    if (sender.phone_number === cleanPhone) {
      return NextResponse.json(
        { error: "Cannot send money to yourself" },
        { status: 400 }
      );
    }

    if (Number(sender.balance) < cleanAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    /* ================= VERIFY PIN ================= */

    if (!sender.transaction_pin) {
      return NextResponse.json(
        { error: "Transaction PIN not set" },
        { status: 400 }
      );
    }

    const isPinValid = await bcrypt.compare(pin, sender.transaction_pin);

    if (!isPinValid) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    /* ================= GET RECEIVER ================= */

    const { data: receiver, error: receiverError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("phone_number", cleanPhone)
      .maybeSingle();

    if (receiverError) {
      console.error(receiverError);
      return NextResponse.json({ error: "Receiver fetch failed" }, { status: 500 });
    }

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    /* ================= UPDATE BALANCES ================= */

    const newSenderBalance = Number(sender.balance) - cleanAmount;
    const newReceiverBalance = Number(receiver.balance) + cleanAmount;

    const { error: deductError } = await supabaseAdmin
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("user_id", sender.user_id);

    if (deductError) {
      console.error(deductError);
      return NextResponse.json(
        { error: "Failed to deduct balance" },
        { status: 500 }
      );
    }

    const { error: creditError } = await supabaseAdmin
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("user_id", receiver.user_id);

    if (creditError) {
      console.error(creditError);
      return NextResponse.json(
        { error: "Failed to credit receiver" },
        { status: 500 }
      );
    }

    /* ================= INSERT TRANSACTIONS ================= */

    const { error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert([
        {
          user_id: sender.user_id,
          type: "debit",
          amount: cleanAmount,
          description: `Sent to ${receiver.phone_number}`,
          source: "Wallet Transfer",
          category: "Transfer",
        },
        {
          user_id: receiver.user_id,
          type: "credit",
          amount: cleanAmount,
          description: `Received from ${sender.phone_number}`,
          source: "Wallet Transfer",
          category: "Transfer",
        },
      ]);

    if (transactionError) {
      console.error(transactionError);
      return NextResponse.json(
        { error: "Transaction logging failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Money sent successfully",
    });

  } catch (error) {
    console.error("Send money error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
