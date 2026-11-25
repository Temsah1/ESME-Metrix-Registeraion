import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyQrPayload } from "@/lib/qr";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const REGISTRANT_FIELDS =
  "id, full_name, university, faculty, department, academic_year, is_esme_member, committee, role, registration_id, id_photo_url";

export async function POST(request: NextRequest) {
  try {
    const authClient = await createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { status: "UNAUTHORIZED", error: "Admin session required to record attendance." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { qr_payload, manual_registrant_id, notes } = body ?? {};
    const scannedBy = user.email ?? "admin";

    const supabase = createAdminClient();

    let registrantUuid: string;

    if (manual_registrant_id !== undefined) {
      if (typeof manual_registrant_id !== "string" || !UUID_REGEX.test(manual_registrant_id)) {
        return NextResponse.json({ status: "INVALID", error: "Invalid registrant identifier" });
      }
      registrantUuid = manual_registrant_id;
    } else {
      const verification = verifyQrPayload(qr_payload);
      if (!verification.valid) {
        return NextResponse.json({ status: "INVALID", error: verification.reason });
      }
      if (verification.legacy) {
        console.warn("Legacy (pre-HMAC) QR accepted for registrant", verification.payload.registrant_id);
      }
      registrantUuid = verification.payload.registrant_id;
    }

    const { data: registrant, error: regError } = await supabase
      .from("registrants")
      .select(REGISTRANT_FIELDS)
      .eq("id", registrantUuid)
      .maybeSingle();

    if (regError || !registrant) {
      return NextResponse.json({ status: "INVALID", error: "Attendee record not found" });
    }

    const { data: existingAttendance } = await supabase
      .from("attendance")
      .select("id, scanned_at, scanned_by")
      .eq("registrant_id", registrant.id)
      .maybeSingle();

    if (existingAttendance) {
      return NextResponse.json({
        status: "ALREADY_SCANNED",
        registrant,
        scanned_at: existingAttendance.scanned_at,
        scanned_by: existingAttendance.scanned_by,
      });
    }

    const { data: newAttendance, error: insertError } = await supabase
      .from("attendance")
      .insert([
        {
          registrant_id: registrant.id,
          scanned_by: scannedBy,
          notes: typeof notes === "string" && notes ? notes : null,
        },
      ])
      .select("id, scanned_at, scanned_by")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: conflictRow } = await supabase
          .from("attendance")
          .select("scanned_at, scanned_by")
          .eq("registrant_id", registrant.id)
          .maybeSingle();

        return NextResponse.json({
          status: "ALREADY_SCANNED",
          registrant,
          scanned_at: conflictRow?.scanned_at ?? null,
          scanned_by: conflictRow?.scanned_by ?? null,
        });
      }

      console.error("Attendance insert failed:", insertError);
      return NextResponse.json(
        { status: "ERROR", error: "Could not record attendance. Please retry." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "SUCCESS",
      registrant,
      scanned_at: newAttendance.scanned_at,
      scanned_by: newAttendance.scanned_by,
    });
  } catch (error) {
    console.error("Error in /api/scan:", error);
    return NextResponse.json({ status: "ERROR", error: "Server check-in error" }, { status: 500 });
  }
}