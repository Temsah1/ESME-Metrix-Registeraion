import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAllowedPhotoUrl } from "@/lib/validations/photo-url";
import {
  TEMPLATE_BASE_WIDTH,
  TEMPLATE_SLOTS,
  computeNameFontSize,
  computeUniversityFontSize,
  truncateText,
} from "@/lib/og/card-data";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const OG_WIDTH = 1200;
const OG_HEIGHT = 675;
const SCALE = OG_WIDTH / TEMPLATE_BASE_WIDTH; // 1.171875

function s(val: number): number {
  return Math.round(val * SCALE);
}

function detectMimeFromBuffer(buf: Buffer): string {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return "image/png";
}

function readTemplateAsDataUri(): string {
  const candidates = [
    path.join(process.cwd(), "public", "images", "attending-card-template.png"),
    path.join(process.cwd(), "public", "images", "social-card-bg.jpg"),
  ];
  for (const absPath of candidates) {
    try {
      if (fs.existsSync(absPath)) {
        const buf = fs.readFileSync(absPath);
        const mime = detectMimeFromBuffer(buf);
        return `data:${mime};base64,${buf.toString("base64")}`;
      }
    } catch (err) {
      console.error(`Failed to read template ${absPath}:`, err);
    }
  }
  return "";
}

async function fetchRemoteImageAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuf);
    if (buf.length === 0 || buf.length > 6 * 1024 * 1024) return null;
    const mime = detectMimeFromBuffer(buf);
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = (searchParams.get("id") || searchParams.get("ticketId") || "").trim();

  let fullName = searchParams.get("name")?.trim() || "ESME Attendee";
  let university = searchParams.get("university")?.trim() || "Cairo University";
  let avatarUrl: string | null = null;

  const avatarParam = searchParams.get("avatar")?.trim();
  if (avatarParam && isAllowedPhotoUrl(avatarParam)) {
    avatarUrl = avatarParam;
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && id) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrants")
        .select("full_name, university, avatar_url")
        .eq("registration_id", id)
        .maybeSingle();

      if (data) {
        fullName = data.full_name || fullName;
        university = data.university || university;
        avatarUrl = data.avatar_url || avatarUrl;
      }
    }
  } catch (e) {
    console.error("OG registrant lookup skipped or failed:", e);
  }

  const templateDataUri = readTemplateAsDataUri();
  const avatarDataUri = avatarUrl ? await fetchRemoteImageAsDataUri(avatarUrl) : null;

  const upperName = truncateText(fullName, 28).toUpperCase();
  const displayUniversity = truncateText(university, 34);
  const nameFontSize = computeNameFontSize(upperName, SCALE);
  const uniFontSize = computeUniversityFontSize(displayUniversity, SCALE);

  const pSlot = TEMPLATE_SLOTS.portrait;
  const nSlot = TEMPLATE_SLOTS.nameMask;
  const uSlot = TEMPLATE_SLOTS.universityMask;
  const vSlot = TEMPLATE_SLOTS.bottomVenueMask;

  // Inset 1px inside the chamfered frame with a 28px corner radius so the
  // portrait covers the light gray backdrop cleanly without touching the gold bezel.
  const insetPx = 1;
  const px = s(pSlot.x + insetPx);
  const py = s(pSlot.y + insetPx);
  const pw = s(pSlot.width - insetPx * 2);
  const ph = s(pSlot.height - insetPx * 2);
  const cornerRadius = s(28);

  return new ImageResponse(
    (
      <div
        style={{
          width: `${OG_WIDTH}px`,
          height: `${OG_HEIGHT}px`,
          display: "flex",
          position: "relative",
          backgroundColor: "#040D1A",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Base Master Template (1024x576 scaled cleanly to 1200x675, exact 16:9) */}
        {templateDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={templateDataUri}
            alt="ESME METRIX Master Template"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${OG_WIDTH}px`,
              height: `${OG_HEIGHT}px`,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${OG_WIDTH}px`,
              height: `${OG_HEIGHT}px`,
              background: "linear-gradient(135deg, #07111E 0%, #0D1F35 100%)",
              display: "flex",
            }}
          />
        )}

        {/* 1. Optional Attendee Portrait clipped inside Right Chamfered Frame */}
        {avatarDataUri ? (
          <div
            style={{
              position: "absolute",
              left: `${px}px`,
              top: `${py}px`,
              width: `${pw}px`,
              height: `${ph}px`,
              borderRadius: `${cornerRadius}px`,
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarDataUri}
              alt={fullName}
              style={{
                width: `${pw}px`,
                height: `${ph}px`,
                objectFit: "cover",
                objectPosition: "center 35%",
              }}
            />
          </div>
        ) : null}

        {/* 2. Attendee Full Name (Mask "YOUR NAME HERE" in upper nameplate) */}
        <div
          style={{
            position: "absolute",
            left: `${s(nSlot.x)}px`,
            top: `${s(nSlot.y)}px`,
            width: `${s(nSlot.width)}px`,
            height: `${s(nSlot.height)}px`,
            backgroundColor: nSlot.fill,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "900",
              fontSize: `${nameFontSize}px`,
              letterSpacing: "0.4px",
              textAlign: "center",
              lineHeight: "1",
            }}
          >
            {upperName}
          </span>
        </div>

        {/* 3. Attendee University (Mask "Your University" below gold divider) */}
        <div
          style={{
            position: "absolute",
            left: `${s(uSlot.x)}px`,
            top: `${s(uSlot.y)}px`,
            width: `${s(uSlot.width)}px`,
            height: `${s(uSlot.height)}px`,
            backgroundColor: uSlot.fill,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#F8FAFC",
              fontStyle: "italic",
              fontWeight: "500",
              fontSize: `${uniFontSize}px`,
              textAlign: "center",
              lineHeight: "1",
            }}
          >
            {displayUniversity}
          </span>
        </div>

        {/* 4. Bottom-Left Venue Fix: Replace "Your University" with "Cairo University" */}
        <div
          style={{
            position: "absolute",
            left: `${s(vSlot.x)}px`,
            top: `${s(vSlot.y)}px`,
            width: `${s(vSlot.width)}px`,
            height: `${s(vSlot.height)}px`,
            background:
              "linear-gradient(90deg, #001125 0%, #001125 88%, rgba(0, 17, 37, 0) 100%)",
            display: "flex",
            alignItems: "center",
            paddingLeft: `${s(vSlot.textX - vSlot.x)}px`,
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: `${Math.round(17 * SCALE)}px`,
              letterSpacing: "0.2px",
              lineHeight: "1",
            }}
          >
            Cairo University
          </span>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
