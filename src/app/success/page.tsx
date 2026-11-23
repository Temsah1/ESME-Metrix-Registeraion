"use client";

import React, { useEffect, useState, useRef, useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  Share2,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface RegisteredData {
  success: boolean;
  registration_id: string;
  full_name: string;
  email: string;
  university: string;
  qr_code: string;
}

function subscribeToStorage() {
  return () => {};
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
  const [cardReady, setCardReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiFired = useRef(false);

  useEffect(() => {
    if (data && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#FFFFFF"],
      });
    }
  }, [data]);

  // 3. Render high-res LinkedIn Attendance Card on HTML Canvas
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    // Set canvas dimensions (1200 x 630 - standard LinkedIn ratio)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient (Brand Dark Blue & Navy)
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#15304B");
    gradient.addColorStop(0.5, "#0F243A");
    gradient.addColorStop(1, "#15304B");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative grid pattern
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

    // Glowing border
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 1160, 590);

    // Sub-border
    ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 1140, 570);

    // Header Tagline
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px monospace";
    ctx.fillText("ESME CAIRO UNIVERSITY STUDENT CHAPTER", 60, 80);

    ctx.fillStyle = "#D97706";
    ctx.font = "bold 16px monospace";
    ctx.fillText("• ATTENDING PROUDLY •", 60, 115);

    // Event Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText("ESME METRIX 2026", 60, 200);

    // Decorative accent bar
    ctx.fillStyle = "#D97706";
    ctx.fillRect(60, 225, 200, 6);

    // Attendee Name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(data.full_name || "Engineer", 60, 310);

    // Registration ID & University
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 24px monospace";
    ctx.fillText(`ID: ${data.registration_id} | ${data.university || "Cairo University"}`, 60, 360);

    // Event Information
    ctx.fillStyle = "#E5E7EB";
    ctx.font = "20px sans-serif";
    ctx.fillText("📅 November 2026 Season", 60, 440);
    ctx.fillText("📍 Cairo University Campus", 60, 475);

    // Hashtag & Motto
    ctx.fillStyle = "#D97706";
    ctx.font = "bold 22px monospace";
    ctx.fillText("#ESMEMetrix #BE_POSITIVE_VALUABLE", 60, 545);

    // Right Side: QR Code Drawing
    if (data.qr_code) {
      const qrImg = new window.Image();
      qrImg.onload = () => {
        if (cancelled) return;
        // Draw card placeholder box
        ctx.fillStyle = "#0F243A";
        ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
        ctx.lineWidth = 2;
        ctx.fillRect(860, 150, 260, 260);
        ctx.strokeRect(860, 150, 260, 260);

        // Draw image
        ctx.drawImage(qrImg, 880, 170, 220, 220);

        ctx.fillStyle = "#10B981";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("VERIFIED METRIX CREDENTIAL", 990, 440);
        ctx.textAlign = "left";
        setCardReady(true);
      };
      qrImg.onerror = () => {
        if (!cancelled) setCardReady(true);
      };
      qrImg.src = data.qr_code;
    }

    return () => {
      cancelled = true;
    };
  }, [data]);

  const handleDownloadCard = () => {
    if (!canvasRef.current || !cardReady) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESME-METRIX-${data?.registration_id || "Badge"}.png`;
    a.click();
  };

  const handleLinkedInShare = () => {
    if (!data) return;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );

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
        <div className="w-14 h-14 rounded-2xl bg-[#0F243A] border border-[#D97706]/35 flex items-center justify-center text-[#D97706] mb-5">
          <QrCode className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">No Registration Found</h1>
        <p className="text-slate-300 text-sm mb-8">
          This page shows your badge right after you register. If you already registered, check
          your email for the confirmation and QR code.
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
    <div className="max-w-4xl mx-auto w-full px-4 py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Animated Checkmark Badge */}
      <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 border-2 border-[#10B981] flex items-center justify-center text-[#10B981] mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="inline-block px-3.5 py-1 rounded-full border border-[#D97706]/35 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-3 font-semibold">
        CONFIRMED & ISSUED
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
        Welcome to ESME Metrix 2026!
      </h1>
      <p className="text-slate-300 text-sm sm:text-base max-w-xl mb-10">
        Congratulations <span className="text-[#D97706] font-semibold">{data.full_name}</span>.
        Your digital admission badge has been minted and linked to your identity.
      </p>

      {/* Main Grid: QR Card & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left mb-10">
        {/* Digital QR Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F243A] to-[#15304B] border border-[#D97706]/35 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-[11px] font-mono text-[#F59E0B] tracking-wider uppercase mb-1 font-bold">
            DIGITAL ADMISSION BADGE
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            {data.full_name}
          </h3>

          {/* QR Image Display */}
          <div className="w-56 h-56 rounded-xl bg-white p-3 flex items-center justify-center mb-4 shadow-lg border-2 border-[#D97706]/40">
            {data.qr_code ? (
              <Image
                src={data.qr_code}
                alt="Registration QR Code"
                width={200}
                height={200}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <QrCode className="w-28 h-28 text-slate-800" />
            )}
          </div>

          <div className="font-mono text-sm font-bold text-[#F59E0B] tracking-wider mb-2">
            ID: {data.registration_id}
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Present this QR code from your mobile device upon arrival at the Cairo University venue for instant check-in.
          </p>
        </div>

        {/* Instructions & Next Steps */}
        <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/20">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D97706]" /> Event Access Checklist
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong>Confirmation Email:</strong> A copy of your badge is being sent to{" "}
                  <span className="text-[#F59E0B] font-semibold">{data.email}</span>. If it doesn&apos;t arrive
                  within a few minutes, use the download button below.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong>Physical ID Required:</strong> Please carry your original National ID card or student university card for verification.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong>Venue Location:</strong> Cairo University Faculty of Engineering, Main Auditorium.
                </div>
              </div>
            </div>
          </div>

          {/* Social Amplification Callout */}
          <div className="mt-6 p-4 rounded-xl bg-[#15304B] border border-[#D97706]/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
              <Share2 className="w-4 h-4 text-[#D97706]" /> Celebrate on LinkedIn
            </div>
            <p className="text-[11px] text-slate-400">
              Download your personalized certificate card below and announce your attendance to your professional network.
            </p>
          </div>
        </div>
      </div>

      {/* LinkedIn Attendance Card Canvas (Hidden offscreen or responsive preview) */}
      <div className="w-full mb-8">
        <div className="text-left text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#D97706]" /> Generated Attendance Card (1200 x 630)
        </div>
        <div className="w-full rounded-2xl overflow-hidden border border-[#D97706]/30 shadow-2xl bg-[#15304B]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Action Buttons for Card & Sharing */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <button
          onClick={handleDownloadCard}
          disabled={!cardReady}
          className="px-6 py-3 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-slate-200 font-semibold text-xs sm:text-sm hover:border-[#D97706] hover:text-white hover:bg-[#1D3046] flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#D97706]" />
          {cardReady ? "DOWNLOAD ATTENDANCE CARD" : "PREPARING CARD..."}
        </button>

        <button
          onClick={handleLinkedInShare}
          className="px-7 py-3 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,119,181,0.3)]"
        >
          <Share2 className="w-4 h-4" />
          {shared ? "OPENED LINKEDIN (MARKED)" : "SHARE ON LINKEDIN"}
        </button>

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
