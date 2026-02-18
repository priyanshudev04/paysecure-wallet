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
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${payload.userId}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatar")
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("avatar")
      .getPublicUrl(fileName);

    const avatarUrl = data.publicUrl;

    await supabaseAdmin
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("user_id", payload.userId);

    return NextResponse.json({ success: true, avatarUrl });

  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
