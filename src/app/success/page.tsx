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
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

interface RegisteredData {
  success: boolean;
  registration_id: string;
  full_name: string;
  email: string;
  university: string;
  faculty?: string;
  qr_code: string;
  avatar_url?: string;
}

const LINKEDIN_SHARE_CAPTION = `I'm attending ESME METRIX!

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

  const data = useMemo<RegisteredData | null>(() => {
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored) as RegisteredData;
      return parsed && parsed.registration_id && parsed.qr_code ? parsed : null;
    } catch {
      return null;
    }
  }, [stored]);

  const [shared, setShared] = useState(false);
  const [ticketReady, setTicketReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ticketCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkedInCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiFired = useRef(false);

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

  // 1. RENDER OFFICIAL EVENT TICKET CANVAS (2048 x 1152 for ultra-crisp print quality)
  useEffect(() => {
    if (!data || !ticketCanvasRef.current) return;

    const canvas = ticketCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    // 2x resolution of 1024x576 ticket template
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

      // Now draw dynamic attendee details
      // 1. Draw a clean white rounded box directly over placeholder QR inside orange brackets
      // Native coords in 1024x576: x ~ 835, y ~ 211, w ~ 138, h ~ 134
      // Scaled x2: x = 1664, y = 416, w = 286, h = 280
      const qrBoxX = 1664;
      const qrBoxY = 416;
      const qrBoxW = 286;
      const qrBoxH = 280;

      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 16);
      ctx.fill();
      ctx.restore();

      // 2. Draw real dynamic QR code inside the white box
      if (data.qr_code) {
        const qrImg = new window.Image();
        qrImg.onload = () => {
          if (cancelled) return;
          // 12px padding inside the white box
          const padding = 12;
          ctx.drawImage(
            qrImg,
            qrBoxX + padding,
            qrBoxY + padding,
            qrBoxW - padding * 2,
            qrBoxH - padding * 2
          );

          // 3. Draw attendee details on the right stub below "SCAN TO JOIN"
          ctx.save();
          // Dark navy identity box on stub
          ctx.fillStyle = "rgba(15, 36, 58, 0.95)";
          ctx.strokeStyle = "rgba(217, 119, 6, 0.6)";
          ctx.lineWidth = 3;
          drawRoundedRect(ctx, 1620, 850, 370, 145, 16);
          ctx.fill();
          ctx.stroke();

          // Stub Ticket ID
          ctx.textAlign = "center";
          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 30px monospace";
          ctx.fillText(`ID: ${data.registration_id}`, 1805, 895);

          // Stub Full Name
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 26px sans-serif";
          const maxNameLen = 22;
          const stubName =
            data.full_name.length > maxNameLen
              ? data.full_name.substring(0, maxNameLen - 2) + "..."
              : data.full_name;
          ctx.fillText(stubName, 1805, 940);

          // Stub University
          ctx.fillStyle = "#CBD5E1";
          ctx.font = "20px sans-serif";
          const stubUni =
            (data.university || "Cairo University").length > 24
              ? (data.university || "Cairo University").substring(0, 22) + "..."
              : data.university || "Cairo University";
          ctx.fillText(stubUni, 1805, 975);
          ctx.restore();

          // 4. Draw attendee credential badge on main left ticket body
          ctx.save();
          ctx.textAlign = "left";
          // Small section label
          ctx.fillStyle = "#D97706";
          ctx.font = "bold 22px monospace";
          ctx.letterSpacing = "2px";
          ctx.fillText("ATTENDEE CREDENTIAL", 120, 680);

          // Main attendee name
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 46px sans-serif";
          ctx.fillText(data.full_name, 120, 735);

          // Sub-bar with ID & University
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

  // 2. RENDER 1200x630 LINKEDIN ATTENDANCE CARD CANVAS
  useEffect(() => {
    if (!data || !linkedInCanvasRef.current) return;

    const canvas = linkedInCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    // Set standard 1200 x 630 dimensions
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient: Dark Blue to Navy
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#15304B");
    gradient.addColorStop(0.5, "#0F243A");
    gradient.addColorStop(1, "#15304B");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative Circuit Grid
    ctx.strokeStyle = "rgba(217, 119, 6, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y < 630; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Glowing Outer Golden Border
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 6;
    drawRoundedRect(ctx, 20, 20, 1160, 590, 18);
    ctx.stroke();

    // Inner Accent Border
    ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 30, 30, 1140, 570, 12);
    ctx.stroke();

    // Organization Header
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px monospace";
    ctx.fillText("ESME CAIRO UNIVERSITY STUDENT CHAPTER", 60, 85);

    ctx.fillStyle = "#D97706";
    ctx.font = "bold 15px monospace";
    ctx.fillText("• ATTENDING PROUDLY •", 60, 115);

    // Event Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 58px sans-serif";
    ctx.fillText("ESME METRIX 2026", 60, 195);

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("MATERIALS ENGINEERING EVENT", 60, 230);

    // Decorative accent bar
    ctx.fillStyle = "#D97706";
    ctx.fillRect(60, 245, 180, 5);

    // Event Details
    ctx.fillStyle = "#E5E7EB";
    ctx.font = "20px sans-serif";
    ctx.fillText("📅 Saturday, 12 December 2026", 60, 420);
    ctx.fillText("📍 Cairo University Campus", 60, 460);

    // Hashtags
    ctx.fillStyle = "#D97706";
    ctx.font = "bold 20px monospace";
    ctx.fillText("#ESMEMetrix #MaterialsEngineering", 60, 545);

    // Right Side: Attendee Profile Card (780 to 1120)
    ctx.fillStyle = "#0F243A";
    ctx.strokeStyle = "rgba(217, 119, 6, 0.45)";
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, 770, 75, 360, 480, 20);
    ctx.fill();
    ctx.stroke();

    // Avatar Circle (or Initials)
    const initials =
      data.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "EM";

    const drawAvatar = (avatarImg?: HTMLImageElement) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(950, 175, 55, 0, Math.PI * 2);
      ctx.closePath();
      if (avatarImg) {
        ctx.save();
        ctx.clip();
        ctx.drawImage(avatarImg, 895, 120, 110, 110);
        ctx.restore();
      } else {
        ctx.fillStyle = "#D97706";
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(initials, 950, 190);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#F59E0B";
      ctx.stroke();
      ctx.restore();
    };

    // Draw initials immediately as default/fallback
    drawAvatar();

    // If attendee uploaded a personal badge photo, render it inside the circle
    if (data.avatar_url) {
      const avatarImg = new window.Image();
      avatarImg.crossOrigin = "anonymous";
      avatarImg.onload = () => {
        if (!cancelled) {
          drawAvatar(avatarImg);
        }
      };
      avatarImg.src = data.avatar_url;
    }

    // Attendee Name
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px sans-serif";
    const nameOnCard =
      data.full_name.length > 20
        ? data.full_name.substring(0, 18) + "..."
        : data.full_name;
    ctx.fillText(nameOnCard, 950, 275);

    // University
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "16px sans-serif";
    const uniOnCard =
      (data.university || "Cairo University").length > 26
        ? (data.university || "Cairo University").substring(0, 24) + "..."
        : data.university || "Cairo University";
    ctx.fillText(uniOnCard, 950, 310);

    // Ticket ID Box
    ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 810, 345, 280, 50, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 22px monospace";
    ctx.fillText(`ID: ${data.registration_id}`, 950, 378);

    // QR Badge inside card
    if (data.qr_code) {
      const qrMini = new window.Image();
      qrMini.onload = () => {
        if (cancelled) return;
        ctx.fillStyle = "#FFFFFF";
        drawRoundedRect(ctx, 905, 415, 90, 90, 8);
        ctx.fill();
        ctx.drawImage(qrMini, 910, 420, 80, 80);

        ctx.fillStyle = "#10B981";
        ctx.font = "bold 13px monospace";
        ctx.fillText("✓ VERIFIED CREDENTIAL", 950, 530);
        ctx.textAlign = "left";
        setCardReady(true);
      };
      qrMini.onerror = () => {
        if (!cancelled) setCardReady(true);
      };
      qrMini.src = data.qr_code;
    } else {
      setCardReady(true);
    }

    return () => {
      cancelled = true;
    };
  }, [data]);

  // ACTION 1: Download Ticket (PDF)
  const handleDownloadTicketPDF = () => {
    if (!ticketCanvasRef.current || !ticketReady) return;
    const canvas = ticketCanvasRef.current;
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // Create landscape A4 PDF (297mm x 210mm)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm

    // Fit ticket maintaining 16:9 aspect ratio
    const ticketWidth = 270;
    const ticketHeight = ticketWidth * (576 / 1024); // ~151.875mm
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

  // ACTION 3: Download LinkedIn Attendance Card (PNG)
  const handleDownloadCard = () => {
    if (!linkedInCanvasRef.current || !cardReady) return;
    const url = linkedInCanvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESME-METRIX-Badge-${data?.registration_id || "Badge"}.png`;
    a.click();
  };

  // ACTION 4: Copy Caption & Share on LinkedIn
  const handleLinkedInShare = async () => {
    if (!data) return;

    // 1. Copy exact pre-filled caption to clipboard
    try {
      await navigator.clipboard.writeText(LINKEDIN_SHARE_CAPTION);
      setCopiedCaption(true);
      setToastMessage(
        "Caption copied! Paste it into your LinkedIn post."
      );
      setTimeout(() => {
        setCopiedCaption(false);
        setToastMessage(null);
      }, 6000);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }

    // 2. Open LinkedIn share dialog with dynamic ticket URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const shareUrl = `${baseUrl}/share/${encodeURIComponent(data.registration_id)}`;

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );

    // 3. Mark share status in database
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
          registered, check your email inbox for your ticket and QR badge.
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

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl bg-[#0F243A] border-2 border-[#10B981] shadow-2xl text-left flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white">CAPTION COPIED TO CLIPBOARD!</p>
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

        {/* Two Prominent Download Buttons */}
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
      {/* SECTION 2: EVENT DETAILS & ACCESS CHECKLIST                        */}
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
              A backup copy with your QR badge is being dispatched to{" "}
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

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: LINKEDIN SHARE CARD (1200x630) & PRE-FILLED POST          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0077B5]" /> Share Your Attendance on LinkedIn
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Celebrate your participation with a personalized 1200x630 attendance badge and
              pre-filled post.
            </p>
          </div>
          <span className="text-xs text-[#0077B5] font-semibold flex items-center gap-1 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" /> Ready for LinkedIn
          </span>
        </div>

        {/* LinkedIn Card Canvas Preview */}
        <div className="w-full rounded-2xl overflow-hidden border border-[#D97706]/35 shadow-2xl bg-[#15304B] mb-5">
          <canvas
            ref={linkedInCanvasRef}
            className="w-full h-auto block"
          />
        </div>

        {/* Action Buttons: Share & Download Card */}
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
            {cardReady ? "DOWNLOAD ATTENDANCE CARD (PNG)" : "PREPARING BADGE..."}
          </button>
        </div>

        {/* Pre-filled Post Text Preview Card with Copy Button */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-[#D97706]" /> Pre-filled LinkedIn Caption
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(LINKEDIN_SHARE_CAPTION);
                setCopiedCaption(true);
                setTimeout(() => setCopiedCaption(false), 3000);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#15304B] border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-[#D97706] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10B981]" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </>
              )}
            </button>
          </div>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#15304B]/60 p-3.5 rounded-xl border border-slate-800">
            {LINKEDIN_SHARE_CAPTION}
          </pre>
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
