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
          padding: "36px 40px",
          border: "6px solid #D97706",
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Column: Event Details & 2x3 Metrics Grid */}
        <div
          style={{
            width: "680px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Header & Badges */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.5px",
                color: "#F59E0B",
                textTransform: "uppercase",
              }}
            >
              ESME CAIRO UNIVERSITY STUDENT CHAPTER
            </div>

            {/* Date & Venue Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.45)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#E2E8F0",
                width: "fit-content",
              }}
            >
              <span style={{ color: "#F59E0B", marginRight: "8px" }}>📅</span>
              12 DECEMBER 2026
              <span style={{ margin: "0 10px", color: "#D97706" }}>|</span>
              <span style={{ color: "#F59E0B", marginRight: "8px" }}>📍</span>
              CAIRO UNIVERSITY
            </div>

            {/* Main Headline */}
            <div
              style={{
                fontSize: "56px",
                fontWeight: "900",
                color: "#FFFFFF",
                marginTop: "14px",
                lineHeight: "1",
                letterSpacing: "-1px",
              }}
            >
              I&apos;M ATTENDING
            </div>
            <div
              style={{
                fontSize: "40px",
                fontWeight: "900",
                color: "#F59E0B",
                lineHeight: "1.1",
                letterSpacing: "1px",
              }}
            >
              ESME METRIX
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#CBD5E1",
                fontWeight: "bold",
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              MATERIALS ENGINEERING EVENT 2026
            </div>
          </div>

          {/* 2x3 Event Highlights Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              width: "100%",
              marginTop: "8px",
            }}
          >
            {/* 1. Attendees */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #D97706",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>500+</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                ATTENDEES
              </span>
            </div>

            {/* 2. Keynote Speakers */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #F59E0B",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>15+</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                KEYNOTE SPEAKERS
              </span>
            </div>

            {/* 3. Workshops */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #10B981",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>8+</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                WORKSHOPS & SESSIONS
              </span>
            </div>

            {/* 4. Companies & Exhibitors */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #F59E0B",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>20+</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                COMPANIES & EXHIBITORS
              </span>
            </div>

            {/* 5. Competitions */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #10B981",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>3</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                COMPETITIONS & AWARDS
              </span>
            </div>

            {/* 6. Tracks */}
            <div
              style={{
                width: "216px",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.25)",
                borderLeft: "4px solid #D97706",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF" }}>4</span>
              <span style={{ fontSize: "10px", fontWeight: "bold", color: "#CBD5E1", letterSpacing: "0.5px" }}>
                ENGINEERING TRACKS
              </span>
            </div>
          </div>

          {/* Footer URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontFamily: "monospace",
              color: "#F59E0B",
              fontWeight: "bold",
              marginTop: "8px",
            }}
          >
            <span>🌐</span>
            <span>esme-metrix-registeration.vercel.app</span>
          </div>
        </div>

        {/* Right Column: Rectangular Framed Attendee Portrait & Identity */}
        <div
          style={{
            width: "380px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F243A",
            borderRadius: "18px",
            border: "3px solid #D97706",
            padding: "24px 20px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Framed Photo Container */}
          <div
            style={{
              width: "240px",
              height: "270px",
              borderRadius: "12px",
              border: "2px solid #F59E0B",
              backgroundColor: "#15304B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
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
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "45px",
                    backgroundColor: "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    border: "3px solid #F59E0B",
                    marginBottom: "10px",
                  }}
                >
                  {initials}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#F59E0B",
                    letterSpacing: "1px",
                  }}
                >
                  OFFICIAL ATTENDEE
                </span>
              </div>
            )}

            {/* Top Verified Badge */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#10B981",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: "bold",
                padding: "3px 8px",
                borderRadius: "10px",
              }}
            >
              ✓ VERIFIED
            </div>
          </div>

          {/* Attendee Full Name */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#FFFFFF",
              marginTop: "16px",
              textAlign: "center",
              maxWidth: "340px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fullName}
          </div>

          {/* University / Affiliation */}
          <div
            style={{
              fontSize: "14px",
              color: "#CBD5E1",
              marginTop: "4px",
              textAlign: "center",
              maxWidth: "340px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {faculty ? `${faculty} • ${university}` : university}
          </div>

          {/* Role Pill */}
          <div
            style={{
              marginTop: "12px",
              backgroundColor: "rgba(217, 119, 6, 0.15)",
              border: "1px solid #D97706",
              borderRadius: "16px",
              padding: "4px 16px",
              fontSize: "11px",
              fontWeight: "bold",
              color: "#F59E0B",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            {jobTitle || "MATERIALS ENGINEERING ATTENDEE"}
          </div>

          {/* Registration ID */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              fontFamily: "monospace",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            ID: {ticketId}
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
