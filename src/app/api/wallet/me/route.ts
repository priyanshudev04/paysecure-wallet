import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
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

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("user_id", user.userId)
      .single();

    if (error) throw error;

    return NextResponse.json({
      balance: data.balance || 0,
    });

  } catch (error) {
    console.error("Fetch Balance Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
