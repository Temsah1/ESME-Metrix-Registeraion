import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { REGISTRATION_ID_REGEX } from "@/lib/registration-id";

export async function POST(request: NextRequest) {
  try {
    const { registration_id } = await request.json();

    if (typeof registration_id !== "string" || !REGISTRATION_ID_REGEX.test(registration_id)) {
      return NextResponse.json({ error: "Valid registration_id required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("registrants")
      .update({ linkedin_shared: true })
      .eq("registration_id", registration_id)
      .select("id");

    if (error) {
      console.error("Failed to update linkedin_shared status:", error);
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/linkedin-shared:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
