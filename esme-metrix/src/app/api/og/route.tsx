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

  // ─────────────────────────────────────────────────────────────────────────────
  // LINKEDIN OG IMAGE — 1200x630
  // Layout: Left column (event info + stats) | Right column (ATTENDEE PHOTO, name, id)
  // The right side shows the person's photo (not QR), styled like Egypt-GITEX/ICT cards
  // ─────────────────────────────────────────────────────────────────────────────
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#0D1F33",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(217,119,6,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Left glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,6,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Outer gold border */}
        <div
          style={{
            position: "absolute",
            inset: "10px",
            border: "3px solid #D97706",
            borderRadius: "20px",
            pointerEvents: "none",
          }}
        />
        {/* Inner subtle border */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "16px",
            pointerEvents: "none",
          }}
        />

        {/* ── LEFT COLUMN ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 36px 44px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top section */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Chapter badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "1.5px",
                color: "#F59E0B",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              ✦ ESME CAIRO UNIVERSITY STUDENT CHAPTER
            </div>

            {/* Date & Venue Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#0F243A",
                border: "1px solid rgba(217, 119, 6, 0.4)",
                borderRadius: "8px",
                padding: "7px 16px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#E2E8F0",
                width: "fit-content",
                marginBottom: "18px",
              }}
            >
              📅 12 DECEMBER 2026 · 📍 CAIRO UNIVERSITY
            </div>

            {/* "I'M ATTENDING" headline */}
            <div
              style={{
                fontSize: "52px",
                fontWeight: "900",
                color: "#FFFFFF",
                lineHeight: "1",
                letterSpacing: "-1px",
                marginBottom: "4px",
              }}
            >
              I&apos;M ATTENDING
            </div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: "900",
                color: "#F59E0B",
                lineHeight: "1.1",
                letterSpacing: "1.5px",
                marginBottom: "4px",
              }}
            >
              ESME METRIX
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                fontWeight: "bold",
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              MATERIALS ENGINEERING EVENT 2026
            </div>
          </div>

          {/* Stats grid 2×3 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {[
              { val: "500+", lbl: "ATTENDEES", accent: "#D97706" },
              { val: "15+", lbl: "KEYNOTE SPEAKERS", accent: "#F59E0B" },
              { val: "8+", lbl: "WORKSHOPS", accent: "#10B981" },
              { val: "20+", lbl: "COMPANIES", accent: "#F59E0B" },
              { val: "3", lbl: "COMPETITIONS", accent: "#10B981" },
              { val: "4", lbl: "TRACKS", accent: "#D97706" },
            ].map((m) => (
              <div
                key={m.lbl}
                style={{
                  width: "192px",
                  backgroundColor: "#0F243A",
                  border: "1px solid rgba(217,119,6,0.2)",
                  borderLeft: `4px solid ${m.accent}`,
                  borderRadius: "8px",
                  padding: "7px 10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "900", color: "#FFFFFF" }}>{m.val}</span>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#94A3B8", letterSpacing: "0.5px" }}>
                  {m.lbl}
                </span>
              </div>
            ))}
          </div>

          {/* Footer URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#F59E0B",
              fontWeight: "bold",
            }}
          >
            🌐 esme-metrix-registeration.vercel.app
          </div>
        </div>

        {/* ── RIGHT COLUMN — ATTENDEE IDENTITY CARD ── */}
        <div
          style={{
            width: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F243A",
            borderLeft: "2px solid rgba(217,119,6,0.3)",
            padding: "32px 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top decorative accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #D97706, #F59E0B, #10B981)",
            }}
          />

          {/* PHOTO or INITIALS — Large portrait */}
          <div
            style={{
              width: "200px",
              height: "230px",
              borderRadius: "16px",
              border: "3px solid #D97706",
              backgroundColor: "#15304B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
              marginBottom: "16px",
              boxShadow: "0 0 40px rgba(217,119,6,0.3)",
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
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "88px",
                    height: "88px",
                    borderRadius: "50%",
                    backgroundColor: "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    border: "3px solid #F59E0B",
                  }}
                >
                  {initials}
                </div>
                <span style={{ fontSize: "10px", color: "#F59E0B", fontWeight: "bold", letterSpacing: "1px" }}>
                  ATTENDEE
                </span>
              </div>
            )}

            {/* Verified badge overlay */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "#10B981",
                color: "#FFFFFF",
                fontSize: "9px",
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
              fontSize: "22px",
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              maxWidth: "290px",
              marginBottom: "4px",
              lineHeight: "1.2",
            }}
          >
            {fullName.length > 22 ? fullName.slice(0, 20) + "..." : fullName}
          </div>

          {/* University */}
          <div
            style={{
              fontSize: "12px",
              color: "#94A3B8",
              textAlign: "center",
              maxWidth: "290px",
              marginBottom: "10px",
            }}
          >
            {faculty ? `${faculty}` : ""} • {university}
          </div>

          {/* Role pill */}
          <div
            style={{
              backgroundColor: "rgba(217,119,6,0.15)",
              border: "1px solid #D97706",
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "10px",
              fontWeight: "bold",
              color: "#F59E0B",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: "10px",
              textAlign: "center",
              maxWidth: "270px",
            }}
          >
            {(jobTitle || "Materials Engineering").slice(0, 28)}
          </div>

          {/* Registration ID */}
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#CBD5E1",
              fontWeight: "bold",
              backgroundColor: "#15304B",
              padding: "4px 12px",
              borderRadius: "6px",
              border: "1px solid rgba(217,119,6,0.2)",
            }}
          >
            ID: {ticketId}
          </div>

          {/* Gate active */}
          <div
            style={{
              marginTop: "10px",
              fontSize: "10px",
              color: "#10B981",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            ● GATE ADMISSION ACTIVE
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
