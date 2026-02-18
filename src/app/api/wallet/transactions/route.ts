import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyAccessToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get range from query
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "all";

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.userId);

    // 🧠 Date Filtering Logic
    const now = new Date();

    if (range === "last7days") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);
      query = query.gte("created_at", last7.toISOString());
    }

    if (range === "thismonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      query = query.gte("created_at", firstDay.toISOString());
    }

    if (range === "lastmonth") {
      const firstDayLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const lastDayLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0
      );

      query = query
        .gte("created_at", firstDayLastMonth.toISOString())
        .lte("created_at", lastDayLastMonth.toISOString());
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch transactions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ transactions: data });
  } catch (error) {
    console.error("Transactions API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
