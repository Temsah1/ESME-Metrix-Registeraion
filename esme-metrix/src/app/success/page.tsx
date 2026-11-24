"use client";

import React, { useEffect, useState, useRef, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
import {
  CheckCircle2,
  Download,
  Share2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Camera,
  Loader2,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RegisteredData {
  success: boolean;
  registration_id: string;
  full_name: string;
  email: string;
  university: string;
  faculty?: string;
  academic_year?: string;
  job_title?: string;
  company?: string;
  qr_code: string;
  avatar_url?: string | null;
}

const LINKEDIN_SHARE_CAPTION = `I'm attending *ESME METRIX*!

Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.

Discover, learn, and connect with fellow engineering students.

Register now: https://esme-metrix-registeration.vercel.app/

#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity`;

function subscribeToStorage() {
  return () => {};
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export default function SuccessPage() {
  const stored = useSyncExternalStore(
    subscribeToStorage,
    () => sessionStorage.getItem("esme_metrix_registration"),
    () => null
  );

  const initialData = useMemo<RegisteredData | null>(() => {
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as RegisteredData;
      return parsed && parsed.registration_id && parsed.qr_code ? parsed : null;
    } catch {
      return null;
    }
  }, [stored]);

  const [data, setData] = useState<RegisteredData | null>(initialData);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [shared, setShared] = useState(false);
  const [ticketReady, setTicketReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ticketCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkedInCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiFired = useRef(false);

  // Sync state if session storage changes
  useEffect(() => {
    if (initialData) {
      setData(initialData);
      if (initialData.avatar_url) {
        setAvatarPreviewUrl(initialData.avatar_url);
      }
    }
  }, [initialData]);

  // Fallback: If session storage is empty, check URL parameter ?id=MX8-XXXXXX
  useEffect(() => {
    if (!data && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get("id");
      if (queryId && /^MX8-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/.test(queryId)) {
        fetch(`/api/register?id=${encodeURIComponent(queryId)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((result: RegisteredData | null) => {
            if (result && result.registration_id) {
              setData(result);
              sessionStorage.setItem("esme_metrix_registration", JSON.stringify(result));
              if (result.avatar_url) {
                setAvatarPreviewUrl(result.avatar_url);
              }
            }
          })
          .catch((err) => console.error("Failed to load registration by ID:", err));
      }
    }
  }, [data]);

  // Confetti celebration on load
  useEffect(() => {
    if (data && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#FFFFFF"],
      });
    }
  }, [data]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. RENDER OFFICIAL EVENT TICKET CANVAS (2048 x 1152 for ultra-crisp print quality)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data || !ticketCanvasRef.current) return;

    const canvas = ticketCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const width = 2048;
    const height = 1152;
    canvas.width = width;
    canvas.height = height;

    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      if (cancelled) return;

      // Draw background template
      ctx.drawImage(bgImg, 0, 0, width, height);

      // Draw dynamic attendee details
      const qrBoxX = 1664;
      const qrBoxY = 416;
      const qrBoxW = 286;
      const qrBoxH = 280;

      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 16);
      ctx.fill();
      ctx.restore();

      if (data.qr_code) {
        const qrImg = new window.Image();
        qrImg.onload = () => {
          if (cancelled) return;
          const qrPad = 12;
          ctx.drawImage(
            qrImg,
            qrBoxX + qrPad,
            qrBoxY + qrPad,
            qrBoxW - qrPad * 2,
            qrBoxH - qrPad * 2
          );

          // Stub text
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 28px monospace";
          ctx.fillText(`ID: ${data.registration_id}`, 1805, 890);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 32px sans-serif";
          const stubName =
            data.full_name.length > 20
              ? data.full_name.substring(0, 18) + "..."
              : data.full_name;
          ctx.fillText(stubName, 1805, 935);

          ctx.fillStyle = "#CBD5E1";
          ctx.font = "20px sans-serif";
          const stubUni =
            (data.university || "Cairo University").length > 24
              ? (data.university || "Cairo University").substring(0, 22) + "..."
              : data.university || "Cairo University";
          ctx.fillText(stubUni, 1805, 975);
          ctx.restore();

          // Left ticket body
          ctx.save();
          ctx.textAlign = "left";
          ctx.fillStyle = "#D97706";
          ctx.font = "bold 22px monospace";
          ctx.letterSpacing = "2px";
          ctx.fillText("ATTENDEE CREDENTIAL", 120, 680);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 46px sans-serif";
          ctx.fillText(data.full_name, 120, 735);

          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 26px monospace";
          ctx.fillText(
            `TICKET ID: ${data.registration_id}  •  ${data.university || "Cairo University"}`,
            120,
            780
          );
          ctx.restore();

          setTicketReady(true);
        };
        qrImg.src = data.qr_code;
      }
    };
    bgImg.src = "/images/ticket-bg.jpg";

    return () => {
      cancelled = true;
    };
  }, [data]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RENDER 1200x628 SOCIAL SHARE CARD CANVAS (Rendered at 2x 2400x1256 retina)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data || !linkedInCanvasRef.current) return;

    const canvas = linkedInCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    // Retina 2x internal resolution (2400 x 1256)
    canvas.width = 2400;
    canvas.height = 1256;
    ctx.scale(2, 2);

    // Background Gradient: Brand Dark Blue (#15304B) to Navy (#0F243A)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 628);
    bgGrad.addColorStop(0, "#15304B");
    bgGrad.addColorStop(0.5, "#0F243A");
    bgGrad.addColorStop(1, "#15304B");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 628);

    // Subtle Radial Glows for depth
    const glowLeft = ctx.createRadialGradient(250, 120, 20, 250, 120, 480);
    glowLeft.addColorStop(0, "rgba(217, 119, 6, 0.12)");
    glowLeft.addColorStop(1, "rgba(217, 119, 6, 0)");
    ctx.fillStyle = glowLeft;
    ctx.fillRect(0, 0, 1200, 628);

    const glowRight = ctx.createRadialGradient(960, 240, 20, 960, 240, 420);
    glowRight.addColorStop(0, "rgba(245, 158, 11, 0.08)");
    glowRight.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = glowRight;
    ctx.fillRect(0, 0, 1200, 628);

    // Decorative Hex / Circuit Grid Lines (subtle opacity)
    ctx.save();
    ctx.strokeStyle = "rgba(217, 119, 6, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 628);
      ctx.stroke();
    }
    for (let y = 0; y <= 628; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }
    ctx.restore();

    // Outer Card Frame
    ctx.save();
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, 16, 16, 1168, 596, 20);
    ctx.stroke();

    // Inner Accent Border
    ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 24, 24, 1152, 580, 16);
    ctx.stroke();

    // Corner Tech Bracket Accents in #F59E0B
    const drawCornerBrackets = () => {
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(34, 48);
      ctx.lineTo(34, 34);
      ctx.lineTo(48, 34);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(1152, 48);
      ctx.lineTo(1152, 34);
      ctx.lineTo(1138, 34);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(34, 580);
      ctx.lineTo(34, 594);
      ctx.lineTo(48, 594);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(1152, 580);
      ctx.lineTo(1152, 594);
      ctx.lineTo(1138, 594);
      ctx.stroke();
    };
    drawCornerBrackets();
    ctx.restore();

    // ─────────────────────────────────────────────────────────────────────────
    // LEFT COLUMN: EVENT INFO & 2x3 METRICS GRID
    // ─────────────────────────────────────────────────────────────────────────

    // Dot-Matrix Decorative Pattern on far left
    ctx.save();
    ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.beginPath();
        ctx.arc(46 + col * 8, 205 + row * 11, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Top Header: ESME Cairo University Student Chapter
    ctx.save();
    ctx.textAlign = "left";
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 13px monospace";
    ctx.fillText("ESME CAIRO UNIVERSITY STUDENT CHAPTER", 68, 62);

    ctx.fillStyle = "#10B981";
    ctx.font = "bold 11px monospace";
    ctx.fillText("• OFFICIAL ATTENDEE CREDENTIAL •", 68, 82);
    ctx.restore();

    // Event Date & Venue Bar
    ctx.save();
    drawRoundedRect(ctx, 68, 102, 530, 36, 8);
    ctx.fillStyle = "#0F243A";
    ctx.fill();
    ctx.strokeStyle = "rgba(217, 119, 6, 0.45)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("📅  12 DECEMBER 2026   |   📍  CAIRO UNIVERSITY", 86, 125);
    ctx.restore();

    // Main Headline: "I'M ATTENDING"
    ctx.save();
    ctx.font = "900 60px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.letterSpacing = "-0.5px";
    ctx.fillText("I'M ATTENDING", 68, 204);

    // Highlighted "ESME METRIX" in brand golden gradient
    const goldTextGrad = ctx.createLinearGradient(68, 215, 450, 255);
    goldTextGrad.addColorStop(0, "#F59E0B");
    goldTextGrad.addColorStop(1, "#D97706");
    ctx.fillStyle = goldTextGrad;
    ctx.font = "900 44px system-ui, -apple-system, sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("ESME METRIX", 68, 254);

    // Event Sub-heading
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "bold 13px sans-serif";
    ctx.letterSpacing = "1.5px";
    ctx.fillText("MATERIALS ENGINEERING EVENT 2026", 68, 280);
    ctx.restore();

    // 2x3 Event Highlights Grid
    // Col 1: 68, Col 2: 298, Col 3: 528 (width = 214px, gap = 16px)
    // Row 1: y = 308, Row 2: y = 394 (height = 72px)
    const metrics = [
      // Row 1
      { x: 68, y: 308, bar: "#D97706", val: "500+", lbl: "ATTENDEES" },
      { x: 298, y: 308, bar: "#F59E0B", val: "15+", lbl: "KEYNOTE SPEAKERS" },
      { x: 528, y: 308, bar: "#10B981", val: "8+", lbl: "WORKSHOPS & SESSIONS" },
      // Row 2
      { x: 68, y: 394, bar: "#F59E0B", val: "20+", lbl: "COMPANIES & EXHIBITORS" },
      { x: 298, y: 394, bar: "#10B981", val: "3", lbl: "COMPETITIONS & AWARDS" },
      { x: 528, y: 394, bar: "#D97706", val: "4", lbl: "ENGINEERING TRACKS" },
    ];

    metrics.forEach((m) => {
      ctx.save();
      // Box background
      drawRoundedRect(ctx, m.x, m.y, 214, 72, 8);
      ctx.fillStyle = "#0F243A";
      ctx.fill();
      ctx.strokeStyle = "rgba(217, 119, 6, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Colored vertical accent bar on left edge
      ctx.fillStyle = m.bar;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(m.x, m.y, 5, 72, [8, 0, 0, 8]);
      } else {
        ctx.rect(m.x, m.y, 5, 72);
      }
      ctx.fill();

      // Number text
      ctx.font = "900 24px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(m.val, m.x + 16, m.y + 35);

      // Label text
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#CBD5E1";
      ctx.fillText(m.lbl, m.x + 16, m.y + 55);
      ctx.restore();
    });

    // Footer Bar (aligned bottom-left)
    ctx.save();
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#F59E0B";
    ctx.fillText("🌐  esme-metrix-registeration.vercel.app", 68, 524);

    ctx.font = "12px monospace";
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("#ESMEMetrix  •  #MaterialsEngineering  •  #CairoUniversity", 68, 554);
    ctx.restore();

    // ─────────────────────────────────────────────────────────────────────────
    // RIGHT COLUMN: ATTENDEE PORTRAIT FRAME & IDENTITY
    // ─────────────────────────────────────────────────────────────────────────
    const portraitX = 820;
    const portraitY = 60;
    const portraitW = 280;
    const portraitH = 340;
    const centerX = portraitX + portraitW / 2; // 960

    // Outer Portrait Frame Box
    ctx.save();
    drawRoundedRect(ctx, portraitX, portraitY, portraitW, portraitH, 16);
    ctx.fillStyle = "#0F243A";
    ctx.fill();
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Corner Notches in #F59E0B
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(portraitX + 10, portraitY + 22);
    ctx.lineTo(portraitX + 10, portraitY + 10);
    ctx.lineTo(portraitX + 22, portraitY + 10);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(portraitX + portraitW - 10, portraitY + 22);
    ctx.lineTo(portraitX + portraitW - 10, portraitY + 10);
    ctx.lineTo(portraitX + portraitW - 22, portraitY + 10);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(portraitX + 10, portraitY + portraitH - 22);
    ctx.lineTo(portraitX + 10, portraitY + portraitH - 10);
    ctx.lineTo(portraitX + 22, portraitY + portraitH - 10);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(portraitX + portraitW - 10, portraitY + portraitH - 22);
    ctx.lineTo(portraitX + portraitW - 10, portraitY + portraitH - 10);
    ctx.lineTo(portraitX + portraitW - 22, portraitY + portraitH - 10);
    ctx.stroke();
    ctx.restore();

    // Initials calculation
    const initials =
      data.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "EM";

    // Helper to draw default avatar fallback
    const drawDefaultAvatar = () => {
      ctx.save();
      const innerX = portraitX + 6;
      const innerY = portraitY + 6;
      const innerW = portraitW - 12;
      const innerH = portraitH - 12;

      drawRoundedRect(ctx, innerX, innerY, innerW, innerH, 12);
      ctx.clip();

      const defaultGrad = ctx.createLinearGradient(innerX, innerY, innerX, innerY + innerH);
      defaultGrad.addColorStop(0, "#15304B");
      defaultGrad.addColorStop(1, "#0F243A");
      ctx.fillStyle = defaultGrad;
      ctx.fillRect(innerX, innerY, innerW, innerH);

      // Avatar circle
      ctx.beginPath();
      ctx.arc(centerX, portraitY + 145, 56, 0, Math.PI * 2);
      ctx.fillStyle = "#D97706";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#F59E0B";
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 42px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(initials, centerX, portraitY + 160);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 12px monospace";
      ctx.letterSpacing = "1px";
      ctx.fillText("OFFICIAL ATTENDEE", centerX, portraitY + 235);
      ctx.restore();

      // Top Verified Badge
      drawVerifiedBadge();
    };

    const drawVerifiedBadge = () => {
      ctx.save();
      const badgeW = 140;
      const badgeH = 24;
      const badgeX = portraitX + portraitW - badgeW - 12;
      const badgeY = portraitY + 12;
      drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 12);
      ctx.fillStyle = "#10B981";
      ctx.fill();
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("✓ VERIFIED ATTENDEE", badgeX + badgeW / 2, badgeY + 16);
      ctx.restore();
    };

    // Draw photo or fallback
    const currentAvatar = avatarPreviewUrl || data.avatar_url;

    if (currentAvatar) {
      const photoImg = new window.Image();
      photoImg.crossOrigin = "anonymous";
      photoImg.onload = () => {
        if (cancelled) return;
        ctx.save();
        const innerX = portraitX + 6;
        const innerY = portraitY + 6;
        const innerW = portraitW - 12;
        const innerH = portraitH - 12;

        drawRoundedRect(ctx, innerX, innerY, innerW, innerH, 12);
        ctx.clip();

        // Object-fit: cover math
        const imgAspect = photoImg.width / photoImg.height;
        const targetAspect = innerW / innerH;
        let rW, rH, oX, oY;

        if (imgAspect > targetAspect) {
          rH = innerH;
          rW = innerH * imgAspect;
          oX = innerX - (rW - innerW) / 2;
          oY = innerY;
        } else {
          rW = innerW;
          rH = innerW / imgAspect;
          oX = innerX;
          oY = innerY - (rH - innerH) / 2;
        }

        ctx.drawImage(photoImg, oX, oY, rW, rH);

        // Dark gradient vignette at the bottom of the photo
        const vigGrad = ctx.createLinearGradient(innerX, innerY + innerH - 90, innerX, innerY + innerH);
        vigGrad.addColorStop(0, "rgba(15, 36, 58, 0)");
        vigGrad.addColorStop(1, "rgba(15, 36, 58, 0.75)");
        ctx.fillStyle = vigGrad;
        ctx.fillRect(innerX, innerY + innerH - 90, innerW, 90);

        ctx.restore();

        // Verified Badge on top of photo
        drawVerifiedBadge();
        setCardReady(true);
      };
      photoImg.onerror = () => {
        if (!cancelled) {
          drawDefaultAvatar();
          setCardReady(true);
        }
      };
      photoImg.src = currentAvatar;
    } else {
      drawDefaultAvatar();
      setCardReady(true);
    }

    // Centered Attendee Details below Portrait Frame
    ctx.save();
    ctx.textAlign = "center";

    // 1. Full Name
    ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    const nameOnCard =
      data.full_name.length > 22
        ? data.full_name.substring(0, 20) + "..."
        : data.full_name;
    ctx.fillText(nameOnCard, centerX, 434);

    // 2. University / Affiliation
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#CBD5E1";
    const uniOnCard =
      (data.university || "Cairo University").length > 28
        ? (data.university || "Cairo University").substring(0, 26) + "..."
        : data.university || "Cairo University";
    ctx.fillText(uniOnCard, centerX, 462);

    // 3. Role / Title Pill
    const pillW = 260;
    const pillH = 30;
    const pillX = centerX - pillW / 2;
    const pillY = 480;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 15);
    ctx.fillStyle = "rgba(217, 119, 6, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#F59E0B";
    const roleText = (data.job_title || "MATERIALS ENGINEERING DELEGATE").toUpperCase();
    const truncatedRole = roleText.length > 26 ? roleText.substring(0, 24) + "..." : roleText;
    ctx.fillText(truncatedRole, centerX, pillY + 19);

    // 4. Registration ID
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`ID: ${data.registration_id}   •   ESME METRIX 2026`, centerX, 538);

    // 5. Gate Admission Status
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#10B981";
    ctx.fillText("● GATE ADMISSION ACTIVE", centerX, 562);

    ctx.restore();

    return () => {
      cancelled = true;
    };
  }, [data, avatarPreviewUrl]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS: PHOTO UPLOAD, DOWNLOADS & LINKEDIN SHARING
  // ─────────────────────────────────────────────────────────────────────────────

  // Handle direct photo upload / change on /success
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Please upload a JPEG or PNG image.");
      return;
    }

    // 1. Instant local preview on card
    const localUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(localUrl);
    setUploadingAvatar(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `badge-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (storageError) {
        console.error("Storage upload failed:", storageError);
        setUploadingAvatar(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      // Persist to database
      const patchRes = await fetch("/api/register", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: data.registration_id,
          avatar_url: publicUrl,
        }),
      });

      if (patchRes.ok) {
        const updated = { ...data, avatar_url: publicUrl };
        setData(updated);
        sessionStorage.setItem("esme_metrix_registration", JSON.stringify(updated));
        setToastMessage("Badge photo updated successfully!");
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ACTION 1: Download Ticket (PDF)
  const handleDownloadTicketPDF = () => {
    if (!ticketCanvasRef.current || !ticketReady) return;
    const canvas = ticketCanvasRef.current;
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ticketWidth = 270;
    const ticketHeight = ticketWidth * (576 / 1024);
    const xOffset = (pageWidth - ticketWidth) / 2;
    const yOffset = (pageHeight - ticketHeight) / 2;

    pdf.addImage(imgData, "JPEG", xOffset, yOffset, ticketWidth, ticketHeight);
    pdf.save(`ESME-METRIX-Ticket-${data?.registration_id || "2026"}.pdf`);
  };

  // ACTION 2: Download Standalone QR Code (PNG)
  const handleDownloadQRCode = () => {
    if (!data?.qr_code) return;
    const a = document.createElement("a");
    a.href = data.qr_code;
    a.download = `ESME-METRIX-QR-${data.registration_id}.png`;
    a.click();
  };

  // ACTION 3: Download "I'm Attending" Social Card (High-Res 2400x1256 Retina PNG)
  const handleDownloadCard = () => {
    if (!linkedInCanvasRef.current || !cardReady) return;
    const url = linkedInCanvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESME-METRIX-Attending-${data?.registration_id || "Badge"}.png`;
    a.click();
  };

  // ACTION 4: Copy Caption & Open LinkedIn Share Dialog
  const handleLinkedInShare = async () => {
    if (!data) return;

    // 1. Copy exact pre-filled caption to clipboard
    try {
      await navigator.clipboard.writeText(LINKEDIN_SHARE_CAPTION);
      setCopiedCaption(true);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }

    // 2. Set exact requested toast notification message
    setToastMessage(
      "Post text copied! Paste it into LinkedIn and attach your downloaded 'I'm Attending' card."
    );
    setTimeout(() => {
      setCopiedCaption(false);
      setToastMessage(null);
    }, 7000);

    // 3. Trigger card download automatically so the attendee has the image ready to attach
    handleDownloadCard();

    // 4. Open LinkedIn share dialog in a new tab
    const shareUrl = "https://esme-metrix-registeration.vercel.app/";
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );

    // 5. Mark share status in database
    fetch("/api/linkedin-shared", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: data.registration_id }),
    })
      .then((res) => {
        if (res.ok) setShared(true);
      })
      .catch((e) => console.error(e));
  };

  if (!data) {
    return (
      <div className="max-w-xl mx-auto w-full px-4 py-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0F243A] border border-[#D97706]/35 flex items-center justify-center text-[#D97706] mb-5 shadow-lg">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">No Registration Found</h1>
        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          This page displays your admission ticket right after you register. If you already
          registered, check your email inbox for your ticket and QR badge, or register below.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_15px_rgba(217,119,6,0.3)] transition-all"
          >
            REGISTER NOW
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const attendeeInitials =
    data.full_name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM";

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl bg-[#0F243A] border-2 border-[#10B981] shadow-2xl text-left flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {toastMessage.includes("copied") ? "CAPTION COPIED TO CLIPBOARD!" : "SUCCESS"}
            </p>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Badge */}
      <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="inline-block px-3.5 py-1 rounded-full border border-[#D97706]/35 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-3 font-semibold">
        ADMISSION CONFIRMED & CREDENTIAL ISSUED
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
        Welcome to ESME METRIX 2026!
      </h1>
      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-10 leading-relaxed">
        Congratulations <span className="text-[#D97706] font-semibold">{data.full_name}</span>.
        Your official event ticket has been generated and your admission QR badge is linked to your
        identity.
      </p>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: OFFICIAL EVENT TICKET (CUSTOM CANVAS + PDF & QR DOWNLOADS) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#D97706]" /> Official Admission Ticket
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-resolution event ticket with embedded dynamic QR credential for gate entry.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#F59E0B] px-3 py-1 rounded-full bg-[#0F243A] border border-[#D97706]/30 self-start sm:self-auto">
            ID: {data.registration_id}
          </span>
        </div>

        {/* Ticket Canvas Preview */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/40 shadow-2xl bg-[#0F243A] mb-5">
          <canvas
            ref={ticketCanvasRef}
            className="w-full h-auto block"
          />
        </div>

        {/* Two Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={handleDownloadTicketPDF}
            disabled={!ticketReady}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(217,119,6,0.35)] hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {ticketReady ? "DOWNLOAD TICKET (PDF)" : "PREPARING TICKET PDF..."}
          </button>

          <button
            onClick={handleDownloadQRCode}
            className="px-6 py-3.5 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-slate-200 hover:text-white hover:border-[#D97706] hover:bg-[#1D3046] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#D97706]" />
            DOWNLOAD QR CODE (PNG)
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: PERSONALIZED "I'M ATTENDING" SOCIAL SHARE CARD & LINKEDIN */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#F59E0B]" /> Personalized &quot;I&apos;m Attending&quot; Social Card
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              1200x628 landscape attendance badge styled with official event stats &amp; your photo.
            </p>
          </div>
          <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1 self-start sm:self-auto bg-[#0F243A] px-3 py-1 rounded-full border border-[#10B981]/30">
            <Sparkles className="w-3.5 h-3.5" /> High-Res Retina (2400x1256)
          </span>
        </div>

        {/* Photo Upload / Change Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-[#0F243A] border border-[#D97706]/35 mb-4 w-full">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-xl border-2 border-[#D97706] bg-[#15304B] overflow-hidden flex items-center justify-center shrink-0 relative">
              {avatarPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreviewUrl}
                  alt="Badge Portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#F59E0B] font-bold text-sm">{attendeeInitials}</span>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-[#F59E0B] animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                Badge Portrait Photo
              </p>
              <p className="text-[11px] text-slate-300">
                {avatarPreviewUrl
                  ? "Personalized headshot attached to your card"
                  : "Add your photo to personalize the attendee portrait frame"}
              </p>
            </div>
          </div>

          <label className="px-4 py-2 rounded-xl bg-[#15304B] border border-[#D97706]/40 hover:border-[#D97706] text-xs font-bold text-[#F59E0B] hover:text-white flex items-center gap-2 cursor-pointer transition-colors shrink-0">
            <Camera className="w-4 h-4" />
            {avatarPreviewUrl ? "Change Photo" : "Upload Badge Photo"}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploadingAvatar}
            />
          </label>
        </div>

        {/* LinkedIn Card Canvas Preview */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/40 shadow-2xl bg-[#0F243A] mb-5">
          <canvas
            ref={linkedInCanvasRef}
            className="w-full h-auto block"
          />
        </div>

        {/* Primary Action Buttons: Share & Download */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-5">
          <button
            onClick={handleLinkedInShare}
            className="px-7 py-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(0,119,181,0.35)] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {shared ? "OPENED LINKEDIN (SHARED)" : "SHARE ON LINKEDIN (COPIES POST)"}
          </button>

          <button
            onClick={handleDownloadCard}
            disabled={!cardReady}
            className="px-6 py-3.5 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-slate-200 hover:text-white hover:border-[#D97706] hover:bg-[#1D3046] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D97706]" />
            {cardReady ? "DOWNLOAD CARD (PNG)" : "PREPARING CARD..."}
          </button>
        </div>

        {/* Pre-filled Post Text Preview Card with Fallback Copy Button */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-[#D97706]" /> Pre-filled LinkedIn Post Text
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(LINKEDIN_SHARE_CAPTION);
                setCopiedCaption(true);
                setToastMessage("Post text copied to clipboard!");
                setTimeout(() => {
                  setCopiedCaption(false);
                  setToastMessage(null);
                }, 4000);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#15304B] border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-[#D97706] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Post Text
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#15304B]/60 p-3.5 rounded-xl border border-slate-800">
            {LINKEDIN_SHARE_CAPTION}
          </pre>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: EVENT DETAILS & ACCESS CHECKLIST                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mb-12">
        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <Calendar className="w-4 h-4 text-[#D97706]" /> Event Date
          </div>
          <div className="text-xl font-extrabold text-white">Saturday</div>
          <div className="text-2xl font-black text-[#F59E0B] font-mono">
            12 / 12 / 2026
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Annual Materials Engineering Conference season.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <MapPin className="w-4 h-4 text-[#D97706]" /> Venue Location
          </div>
          <div className="text-xl font-extrabold text-white">Cairo University</div>
          <div className="text-sm font-semibold text-slate-300">
            Faculty of Engineering Campus
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Giza, Greater Cairo • Main Engineering Auditorium
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <Clock className="w-4 h-4 text-[#D97706]" /> Gate Verification
          </div>
          <div className="text-xl font-extrabold text-white">Fast-Track Check-In</div>
          <div className="text-sm font-semibold text-[#10B981] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Ready for Live Scan
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Present your QR code or PDF on your phone upon arrival.
          </p>
        </div>
      </div>

      {/* Access Instructions */}
      <div className="w-full p-6 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/25 text-left mb-12">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D97706]" /> Attendee Admission Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#15304B]/70 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="text-white block mb-0.5">Confirmation Email:</strong>
              A backup copy with your QR badge is dispatched to{" "}
              <span className="text-[#F59E0B] font-semibold">{data.email}</span>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#15304B]/70 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="text-white block mb-0.5">Physical ID Required:</strong>
              Please bring your original National ID or Student University Karnet for gate
              identification.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#15304B]/70 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="text-white block mb-0.5">Digital Badge on Mobile:</strong>
              Save the PDF ticket or QR image on your smartphone for seamless scanning at gate
              admission.
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800 w-full">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
        >
          Back to Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
