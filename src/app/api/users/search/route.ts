import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ users: [] });
    }

    const digits = q.replace(/\D/g, "");
    const searchPhone = digits.length >= 2 ? `%${digits}%` : null;
    const searchName = q.length >= 2 ? `%${q}%` : null;

    const seen = new Set<string>();
    const users: { user_id: string; phone_number: string; name: string | null }[] = [];

    if (searchPhone) {
      const { data: byPhone } = await supabaseAdmin
        .from("users")
        .select("user_id, phone_number, name")
        .neq("user_id", payload.userId)
        .ilike("phone_number", searchPhone)
        .limit(8);
      for (const u of byPhone || []) {
        if (!seen.has(u.user_id)) {
          seen.add(u.user_id);
          users.push({
            user_id: u.user_id,
            phone_number: u.phone_number,
            name: u.name || null,
          });
        }
      }
    }

    if (searchName && users.length < 8) {
      const { data: byName } = await supabaseAdmin
        .from("users")
        .select("user_id, phone_number, name")
        .neq("user_id", payload.userId)
        .ilike("name", searchName)
        .limit(8 - users.length);
      for (const u of byName || []) {
        if (!seen.has(u.user_id)) {
          seen.add(u.user_id);
          users.push({
            user_id: u.user_id,
            phone_number: u.phone_number,
            name: u.name || null,
          });
        }
      }
    }

    return NextResponse.json({
      users: users.slice(0, 8).map((u) => ({
        user_id: u.user_id,
        phone_number: u.phone_number,
        name: u.name || null,
      })),
    });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
