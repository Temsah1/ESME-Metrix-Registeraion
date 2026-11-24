import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";

  let fullName = "Valued Engineer";
  let university = "Cairo University";
  let faculty = "Faculty of Engineering";
  let ticketId = id || "MX8-2026";

  if (id) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrants")
        .select("full_name, university, faculty, registration_id")
        .eq("registration_id", id)
        .maybeSingle();

      if (data) {
        fullName = data.full_name || fullName;
        university = data.university || university;
        faculty = data.faculty || faculty;
        ticketId = data.registration_id || ticketId;
      }
    } catch (e) {
      console.error("OG registrant fetch failed:", e);
    }
  }

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#15304B",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "44px",
          border: "8px solid #D97706",
          boxSizing: "border-box",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            flex: "1.2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: "36px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#F59E0B",
                fontSize: "17px",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              ESME CAIRO UNIVERSITY STUDENT CHAPTER
            </div>
            <div
              style={{
                color: "#D97706",
                fontSize: "13px",
                fontWeight: "bold",
                marginTop: "4px",
                letterSpacing: "1px",
              }}
            >
              • OFFICIAL ATTENDEE CREDENTIAL •
            </div>
            <div
              style={{
                fontSize: "52px",
                fontWeight: "900",
                color: "#FFFFFF",
                marginTop: "20px",
                lineHeight: "1.1",
              }}
            >
              ESME METRIX 2026
            </div>
            <div
              style={{
                fontSize: "19px",
                color: "#F59E0B",
                fontWeight: "bold",
                marginTop: "8px",
                letterSpacing: "1px",
              }}
            >
              MATERIALS ENGINEERING EVENT
            </div>
            <div
              style={{
                width: "160px",
                height: "5px",
                backgroundColor: "#D97706",
                marginTop: "16px",
                borderRadius: "3px",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "17px", color: "#E2E8F0" }}>
              📅 Saturday, 12 December 2026
            </div>
            <div style={{ fontSize: "17px", color: "#E2E8F0" }}>
              📍 Cairo University Campus
            </div>
            <div
              style={{
                color: "#D97706",
                fontSize: "15px",
                fontWeight: "bold",
                marginTop: "10px",
                letterSpacing: "1px",
              }}
            >
              #ESMEMetrix #MaterialsEngineering #CairoUniversity
            </div>
          </div>
        </div>

        {/* Right Section: Attendee Badge Card */}
        <div
          style={{
            flex: "0.8",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F243A",
            borderRadius: "20px",
            border: "2px solid rgba(217, 119, 6, 0.45)",
            padding: "32px 24px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Avatar with Initials */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "60px",
              backgroundColor: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "44px",
              fontWeight: "bold",
              color: "#FFFFFF",
              border: "4px solid #F59E0B",
              marginBottom: "18px",
            }}
          >
            {initials}
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: "6px",
              textAlign: "center",
            }}
          >
            {fullName}
          </div>

          <div
            style={{
              fontSize: "15px",
              color: "#CBD5E1",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {faculty} • {university}
          </div>

          <div
            style={{
              fontFamily: "monospace",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#F59E0B",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              padding: "6px 20px",
              borderRadius: "10px",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              marginBottom: "16px",
            }}
          >
            ID: {ticketId}
          </div>

          <div
            style={{
              color: "#10B981",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            ✓ VERIFIED ATTENDEE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
