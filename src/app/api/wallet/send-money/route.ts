import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    /* ===========================
       AUTH CHECK
    ============================ */

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    /* ===========================
       REQUEST BODY
    ============================ */

    const body = await req.json();
    const receiverPhone = body.receiverPhone?.trim();
    const amount = Number(body.amount);
    const pin = body.pin;

    if (!receiverPhone || !amount || amount <= 0 || !pin) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    /* ===========================
       GET SENDER
    ============================ */

    const { data: sender, error: senderError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", payload.userId)
      .single();

    if (senderError || !sender) {
      return NextResponse.json(
        { error: "Sender not found" },
        { status: 404 }
      );
    }

    // Prevent sending to yourself
    if (sender.phone_number === receiverPhone) {
      return NextResponse.json(
        { error: "Cannot send money to yourself" },
        { status: 400 }
      );
    }

    // Check balance
    if (Number(sender.balance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    /* ===========================
       VERIFY PIN
    ============================ */

    if (!sender.transaction_pin) {
      return NextResponse.json(
        { error: "Transaction PIN not set" },
        { status: 400 }
      );
    }

    const isPinValid = await bcrypt.compare(
      pin,
      sender.transaction_pin
    );

    if (!isPinValid) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 401 }
      );
    }

    /* ===========================
       GET RECEIVER
    ============================ */

    const { data: receiver, error: receiverError } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", receiverPhone)
      .single();

    if (receiverError || !receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    /* ===========================
       UPDATE BALANCES
    ============================ */

    const newSenderBalance = Number(sender.balance) - amount;
    const newReceiverBalance = Number(receiver.balance) + amount;

    const { error: deductError } = await supabase
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("user_id", sender.user_id);

    if (deductError) {
      return NextResponse.json(
        { error: "Failed to deduct balance" },
        { status: 500 }
      );
    }

    const { error: creditError } = await supabase
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("user_id", receiver.user_id);

    if (creditError) {
      return NextResponse.json(
        { error: "Failed to credit receiver" },
        { status: 500 }
      );
    }

    /* ===========================
       INSERT TRANSACTIONS
    ============================ */

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: sender.user_id,
          type: "debit",
          amount,
          description: `Sent to ${receiver.phone_number}`,
          source: "Wallet Transfer",
          category: "Transfer",
        },
        {
          user_id: receiver.user_id,
          type: "credit",
          amount,
          description: `Received from ${sender.phone_number}`,
          source: "Wallet Transfer",
          category: "Transfer",
        },
      ]);

    if (transactionError) {
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
