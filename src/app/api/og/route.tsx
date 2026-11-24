import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";

  let fullName = "Valued Engineer";
  let university = "Cairo University";
  let faculty = "Faculty of Engineering";
  let jobTitle = "Materials Engineering Delegate";
  let ticketId = id || "MX8-2026";
  let avatarUrl: string | null = null;

  if (id) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrants")
        .select("full_name, university, faculty, job_title, registration_id, avatar_url")
        .eq("registration_id", id)
        .maybeSingle();

      if (data) {
        fullName = data.full_name || fullName;
        university = data.university || university;
        faculty = data.faculty || faculty;
        jobTitle = data.job_title || jobTitle;
        ticketId = data.registration_id || ticketId;
        avatarUrl = data.avatar_url || null;
      }
    } catch (e) {
      console.error("OG registrant fetch failed:", e);
    }
  }

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM";

  // Load template image as base64 for fastest rendering with zero external roundtrips
  let bgBase64 = "";
  try {
    const bgPath = path.join(process.cwd(), "public", "images", "social-card-bg.jpg");
    if (fs.existsSync(bgPath)) {
      const fileBuffer = fs.readFileSync(bgPath);
      bgBase64 = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
    }
  } catch (err) {
    console.error("Failed to read social-card-bg.jpg:", err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#070F1E",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* If template background exists, render it */}
        {bgBase64 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgBase64}
            alt="Event Background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        ) : (
          /* Pure CSS Sci-Fi Dark-Gold & Navy fallback */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #070F1E 0%, #0F243A 50%, #070F1E 100%)",
              display: "flex",
            }}
          />
        )}

        {/* ── DYNAMIC OVERLAYS MATCHING PREMIUM SCI-FI THEME ── */}

        {/* 1. Attendee Photo in Cyber Gold Beveled Frame */}
        <div
          style={{
            position: "absolute",
            left: "868px",
            top: "105px",
            width: "286px",
            height: "335px",
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F243A",
            border: "2px solid rgba(245, 158, 11, 0.4)",
          }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={fullName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #15304B 0%, #0A192B 100%)",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#D97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "38px",
                  fontWeight: "900",
                  color: "#FFFFFF",
                  border: "3px solid #F59E0B",
                  boxShadow: "0 0 25px rgba(245, 158, 11, 0.5)",
                  marginBottom: "8px",
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: "#F59E0B",
                  fontWeight: "900",
                  letterSpacing: "1.5px",
                  fontFamily: "monospace",
                }}
              >
                OFFICIAL ATTENDEE
              </span>
            </div>
          )}

          {/* Top Right Verified Pill */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: "900",
              padding: "3px 10px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
            }}
          >
            ✓ VERIFIED
          </div>
        </div>

        {/* 2. Attendee Name & Affiliation Plaque below frame */}
        <div
          style={{
            position: "absolute",
            left: "865px",
            top: "442px",
            width: "290px",
            height: "95px",
            backgroundColor: "#030C17",
            borderRadius: "8px",
            border: "1px solid rgba(217, 119, 6, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px",
          }}
        >
          {/* Full Name */}
          <div
            style={{
              fontSize: fullName.length > 18 ? "18px" : "22px",
              fontWeight: "900",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: "1.1",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {fullName.length > 24 ? fullName.slice(0, 22) + "..." : fullName}
          </div>

          {/* Gold Divider Line */}
          <div
            style={{
              width: "170px",
              height: "2px",
              backgroundColor: "#F59E0B",
              marginTop: "4px",
              marginBottom: "4px",
            }}
          />

          {/* University & Faculty */}
          <div
            style={{
              fontSize: "13px",
              fontStyle: "italic",
              color: "#FEF08A",
              textAlign: "center",
              lineHeight: "1.1",
            }}
          >
            {university.length > 28 ? university.slice(0, 26) + "..." : university}
          </div>

          {/* ID & Gate Active Status */}
          <div
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              fontWeight: "bold",
              color: "#10B981",
              marginTop: "3px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ color: "#F59E0B" }}>ID: {ticketId}</span>
            <span> • </span>
            <span>● GATE ACTIVE</span>
          </div>
        </div>

        {/* 3. Bottom Venue Pill covering 'Your University' */}
        <div
          style={{
            position: "absolute",
            left: "435px",
            top: "560px",
            height: "30px",
            backgroundColor: "#050D18",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "4px",
            paddingRight: "14px",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            {university.length > 28 ? university.slice(0, 26) + "..." : university}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
