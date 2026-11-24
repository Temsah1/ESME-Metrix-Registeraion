import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  try {
    // 1. Verify authenticated admin session
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Admin authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Registrant ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 2. Delete attendance records for this user first if foreign key constraint exists
    await supabase.from("attendance").delete().eq("registrant_id", id);

    // 3. Delete registrant
    const { error } = await supabase.from("registrants").delete().eq("id", id);

    if (error) {
      console.error("Delete registrant error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Registrant deleted successfully" });
  } catch (err) {
    console.error("Delete API error:", err);
    return NextResponse.json({ error: "Failed to delete registrant" }, { status: 500 });
  }
}
