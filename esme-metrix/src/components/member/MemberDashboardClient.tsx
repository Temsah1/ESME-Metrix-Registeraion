"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  MapPin,
  QrCode,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Ticket,
  User,
} from "lucide-react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import DualHallAgenda from "@/components/DualHallAgenda";
import type { ConfirmationCmsConfig, DualHallAgendaConfig } from "@/lib/cms/types";
import { createClient } from "@/lib/supabase/client";
import type { PublicAttendeePass } from "@/lib/registrants/public-pass";
import { getInitials } from "@/lib/og/card-data";
import {
  renderAttendingCardCanvas,
  renderTicketStubCanvas,
} from "@/lib/og/canvas-renderer";

const STORAGE_KEY = "esme_metrix_registration";

interface MemberDashboardClientProps {
  initialData?: PublicAttendeePass | null;
  initialLookupError?: string | null;
  agenda: DualHallAgendaConfig;
  confirmationCms: ConfirmationCmsConfig;
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  eventMapsUrl: string;
  ticketBgUrl: string;
  isPostRegistration?: boolean;
}

function subscribeToStorage() {
  return () => {};
}

function readStoredPass(): PublicAttendeePass | null {
  if (typeof window === "undefined") return null;
  const raw =
    sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PublicAttendeePass;
    return parsed && parsed.registration_id && parsed.qr_code ? parsed : null;
  } catch {
    return null;
  }
}

function persistPassLocally(pass: PublicAttendeePass) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(pass);
  sessionStorage.setItem(STORAGE_KEY, serialized);
  localStorage.setItem(STORAGE_KEY, serialized);
}

function clearStoredPass() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

export default function MemberDashboardClient({
  initialData = null,
  initialLookupError = null,
  agenda,
  confirmationCms,
  eventDate,
  eventVenue,
  eventTime,
  eventMapsUrl,
  ticketBgUrl,
  isPostRegistration = false,
}: MemberDashboardClientProps) {
  const clientStoredRaw = useSyncExternalStore(
    subscribeToStorage,
    () => {
      if (typeof window === "undefined") return null;
      return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    },
    () => null
  );

  const clientStoredPass = useMemo<PublicAttendeePass | null>(() => {
    if (!clientStoredRaw) return null;
    try {
      const parsed = JSON.parse(clientStoredRaw) as PublicAttendeePass;
      return parsed && parsed.registration_id && parsed.qr_code ? parsed : null;
    } catch {
      return null;
    }
  }, [clientStoredRaw]);

  const [manualPass, setManualPass] = useState<PublicAttendeePass | null>(null);
  const [switchedOut, setSwitchedOut] = useState(false);

  const activePass = switchedOut
    ? manualPass
    : manualPass || initialData || clientStoredPass;

  const [lookupInput, setLookupInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(initialLookupError);

  const [avatarOverrideUrl, setAvatarOverrideUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [shared, setShared] = useState(false);
  const [ticketReady, setTicketReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const ticketContainerRef = useRef<HTMLDivElement>(null);
  const ticketCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkedInCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkedInSectionRef = useRef<HTMLDivElement>(null);
  const confettiFired = useRef(false);

  const effectiveAvatarUrl = avatarOverrideUrl || activePass?.avatar_url || null;
  const whatsappUrl = confirmationCms.postRegistrationWhatsappUrl;
  const linkedInPostText = confirmationCms.linkedinCaption;

  // Keep storage & URL synchronized when a pass is active
  useEffect(() => {
    if (!activePass) return;
    persistPassLocally(activePass);
    if (typeof window !== "undefined") {
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.get("id") !== activePass.registration_id) {
        const nextUrl = `${window.location.pathname}?id=${encodeURIComponent(
          activePass.registration_id
        )}`;
        window.history.replaceState(null, "", nextUrl);
      }
    }
  }, [activePass]);

  // Trigger celebratory confetti once when arriving right after registration
  useEffect(() => {
    if (isPostRegistration && activePass && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#FFFFFF"],
      });
    }
  }, [isPostRegistration, activePass]);

  // Render high-res widescreen ticket stub canvas
  useEffect(() => {
    if (!activePass || !ticketCanvasRef.current) return;
    let cancelled = false;
    let revokers: (() => void)[] = [];

    renderTicketStubCanvas({
      canvas: ticketCanvasRef.current,
      data: activePass,
      avatarUrl: effectiveAvatarUrl,
      ticketBgUrl,
      isCancelled: () => cancelled,
    }).then((res) => {
      revokers = res.revokers;
      if (!cancelled && res.ready) {
        setTicketReady(true);
      }
    });

    return () => {
      cancelled = true;
      revokers.forEach((fn) => fn());
    };
  }, [activePass, effectiveAvatarUrl, ticketBgUrl]);

  // Render 1600x900 "I'm Attending" LinkedIn master template card
  useEffect(() => {
    if (!activePass || !linkedInCanvasRef.current) return;
    let cancelled = false;
    let revokers: (() => void)[] = [];

    renderAttendingCardCanvas({
      canvas: linkedInCanvasRef.current,
      data: activePass,
      avatarUrl: effectiveAvatarUrl,
      isCancelled: () => cancelled,
    }).then((res) => {
      revokers = res.revokers;
      if (!cancelled && res.ready) {
        setCardReady(true);
      }
    });

    return () => {
      cancelled = true;
      revokers.forEach((fn) => fn());
    };
  }, [activePass, effectiveAvatarUrl]);

  const showToast = (msg: string, duration = 6000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  };

  const handlePassLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = lookupInput.trim();
    if (!trimmed) {
      setLookupError("Please enter your Phone Number (01XXXXXXXXX) or Ticket ID (MX8-XXXXXX).");
      return;
    }

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(`/api/register?lookup=${encodeURIComponent(trimmed)}`);
      const payload = await res.json();
      if (!res.ok || !payload?.registration_id) {
        setLookupError(
          payload?.error ||
            "No registration found matching that Phone Number or Ticket ID."
        );
        return;
      }

      persistPassLocally(payload as PublicAttendeePass);
      setManualPass(payload as PublicAttendeePass);
      setAvatarOverrideUrl(payload.avatar_url || null);
      setSwitchedOut(false);
    } catch {
      setLookupError("Network error while looking up your pass. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSwitchPass = () => {
    clearStoredPass();
    setManualPass(null);
    setAvatarOverrideUrl(null);
    setSwitchedOut(true);
    setLookupError(null);
    setLookupInput("");
    setTicketReady(false);
    setCardReady(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePass) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Please upload a JPEG or PNG image.");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAvatarOverrideUrl(localUrl);
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
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      const patchRes = await fetch("/api/register", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: activePass.registration_id,
          avatar_url: publicUrl,
        }),
      });

      if (patchRes.ok) {
        const updated: PublicAttendeePass = { ...activePass, avatar_url: publicUrl };
        persistPassLocally(updated);
        setManualPass(updated);
        setAvatarOverrideUrl(publicUrl);
        showToast("Badge photo updated across your ticket & LinkedIn card!", 5000);
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (!activePass?.qr_code) return;
    const a = document.createElement("a");
    a.href = activePass.qr_code;
    a.download = `ESME-METRIX-QR-${activePass.registration_id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadTicketPDF = async () => {
    if (!activePass) return;

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let imgData = "";

      if (ticketContainerRef.current) {
        const capturedCanvas = await html2canvas(ticketContainerRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#070F1E",
        });
        imgData = capturedCanvas.toDataURL("image/jpeg", 0.98);
      } else if (ticketCanvasRef.current) {
        imgData = ticketCanvasRef.current.toDataURL("image/jpeg", 0.98);
      }

      if (!imgData) return;

      const ticketWidth = 270;
      const ticketHeight = ticketWidth * (576 / 1024);
      pdf.addImage(
        imgData,
        "JPEG",
        (pageWidth - ticketWidth) / 2,
        (pageHeight - ticketHeight) / 2,
        ticketWidth,
        ticketHeight
      );
      pdf.save(`ESME-METRIX-Ticket-${activePass.registration_id}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      if (ticketCanvasRef.current) {
        const imgData = ticketCanvasRef.current.toDataURL("image/jpeg", 0.98);
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ticketWidth = 270;
        const ticketHeight = ticketWidth * (576 / 1024);
        pdf.addImage(
          imgData,
          "JPEG",
          (pageWidth - ticketWidth) / 2,
          (pageHeight - ticketHeight) / 2,
          ticketWidth,
          ticketHeight
        );
        pdf.save(`ESME-METRIX-Ticket-${activePass.registration_id}.pdf`);
      }
    }
  };

  const handleDownloadCard = () => {
    if (!linkedInCanvasRef.current || !cardReady || !activePass) return;
    const url = linkedInCanvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESME-METRIX-Attending-${activePass.registration_id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLinkedInShare = async () => {
    if (!activePass) return;

    try {
      await navigator.clipboard.writeText(linkedInPostText);
      setCopiedCaption(true);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }

    showToast(
      "LinkedIn caption copied! Paste it into your post—your personalized card loads via the link or attach your downloaded PNG.",
      7000
    );
    setTimeout(() => setCopiedCaption(false), 7000);

    handleDownloadCard();

    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://esme-metrix-registeration.vercel.app")
    ).replace(/\/$/, "");
    const shareUrl = `${baseUrl}/share/${encodeURIComponent(activePass.registration_id)}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );

    fetch("/api/linkedin-shared", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_id: activePass.registration_id }),
    })
      .then((res) => {
        if (res.ok) setShared(true);
      })
      .catch((e) => console.error(e));
  };

  // Fallback helper for reading existing stored pass if user had cleared or came fresh
  const hasStoredPassHint = Boolean(!activePass && readStoredPass());

  if (!activePass) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 py-10 sm:py-14 space-y-14">
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0F243A]/95 border border-[#D97706]/35 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#D97706]/15 border border-[#D97706]/40 flex items-center justify-center text-[#F59E0B] shadow-lg">
            <QrCode className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 font-mono text-[11px] font-bold uppercase mb-3">
              My Dashboard • Find My Pass
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Access Your Member &amp; Attendee Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Enter your registered <strong>Phone Number</strong> (e.g.{" "}
              <code className="text-[#F59E0B]">01012345678</code>) or{" "}
              <strong>Ticket ID</strong> (e.g.{" "}
              <code className="text-[#F59E0B]">MX8-XXXXXX</code>) to open your
              scannable QR pass, download PDF/PNG tickets, and follow the live hall schedule.
            </p>
          </div>

          {lookupError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/35 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{lookupError}</span>
            </div>
          )}

          <form onSubmit={handlePassLookup} className="space-y-3 text-left">
            <label
              htmlFor="pass-lookup-input"
              className="text-xs font-semibold text-slate-300 block"
            >
              Mobile Phone Number or Ticket ID
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="pass-lookup-input"
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="01012345678 or MX8-XXXXXX"
                className="flex-1 h-12 px-4 rounded-xl bg-[#15304B] border border-[#D97706]/35 focus:border-[#F59E0B] text-white placeholder-slate-400 font-mono text-sm focus:outline-none"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(217,119,6,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {lookupLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Finding...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Open My Pass
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Haven&apos;t registered for ESME METRIX yet?</span>
            <div className="flex items-center gap-3">
              {hasStoredPassHint && (
                <button
                  type="button"
                  onClick={() => setSwitchedOut(false)}
                  className="text-emerald-300 hover:text-white font-semibold cursor-pointer"
                >
                  Restore Saved Pass
                </button>
              )}
              <Link
                href="/register"
                className="text-[#F59E0B] hover:text-amber-300 font-bold inline-flex items-center gap-1"
              >
                Register Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Always show Live Event Day Agenda underneath for instant reference */}
        <div className="pt-4 border-t border-slate-800/80">
          <DualHallAgenda agenda={agenda} compact id="live-agenda" />
        </div>
      </div>
    );
  }

  const attendeeInitials = getInitials(activePass.full_name);
  const majorSummary =
    activePass.department || activePass.faculty || activePass.job_title || "Engineering Delegate";

  return (
    <div className="max-w-5xl mx-auto w-full px-3 sm:px-4 py-8 sm:py-12 flex flex-col items-center">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl bg-[#0F243A] border-2 border-[#10B981] shadow-2xl text-left flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {toastMessage.includes("copied") ? "POST TEXT COPIED!" : "UPDATED"}
            </p>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Pass Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          MEMBER &amp; ATTENDEE DASHBOARD
        </span>
        <button
          type="button"
          onClick={handleSwitchPass}
          className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#0F243A] text-slate-300 hover:text-white hover:border-[#D97706] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Switch / Lookup Pass
        </button>
      </div>

      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-3.5 py-1 rounded-full border border-[#D97706]/35 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-3 font-semibold uppercase">
          {confirmationCms.badgeLabel}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          {confirmationCms.heading}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Welcome <span className="text-[#F59E0B] font-bold">{activePass.full_name}</span>.{" "}
          {confirmationCms.subheading}
        </p>
      </div>

      {/* ── PERSONAL QR CODE & EVENT PASS CARD ── */}
      <section className="w-full p-5 sm:p-7 rounded-3xl bg-[#0F243A]/95 border-2 border-[#D97706]/45 shadow-[0_0_40px_rgba(217,119,6,0.16)] mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Attendee Identity Details & ESME Chapter Badge */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#D97706]/20 border border-[#F59E0B]/45 text-[#FEF08A] font-mono text-xs font-extrabold">
                TICKET ID: {activePass.registration_id}
              </span>
              {activePass.is_esme_member ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  ESME CHAPTER MEMBER
                  {activePass.role ? ` • ${activePass.role}` : ""}
                  {activePass.committee ? ` (${activePass.committee})` : ""}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold">
                  OFFICIAL DELEGATE
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.35)] bg-[#15304B] overflow-hidden flex items-center justify-center shrink-0 relative">
                {effectiveAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={effectiveAvatarUrl}
                    alt={activePass.full_name}
                    crossOrigin={effectiveAvatarUrl.startsWith("http") ? "anonymous" : undefined}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#F59E0B] font-black text-xl">{attendeeInitials}</span>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#F59E0B] animate-spin" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-white truncate">
                  {activePass.full_name}
                </h2>
                <p className="text-xs sm:text-sm text-[#F59E0B] font-semibold mt-0.5 truncate">
                  {activePass.university || "Cairo University"}
                </p>
                <p className="text-xs text-slate-300 mt-0.5 truncate">{majorSummary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#15304B]/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Event Date &amp; Check-In
                </span>
                <span className="font-bold text-white mt-0.5 block">{eventDate}</span>
                <span className="text-slate-300 text-[11px]">{eventTime}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#15304B]/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Venue &amp; Parallel Halls
                </span>
                <span className="font-bold text-white mt-0.5 block">{eventVenue}</span>
                <span className="text-emerald-300 text-[11px]">
                  Hall 1 (250 Cap) &amp; Hall 2 (150 Cap)
                </span>
              </div>
            </div>

            {/* Optional Badge Portrait Photo Uploader */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0A192A] border border-slate-800">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>
                  {effectiveAvatarUrl
                    ? "Your portrait photo is applied to your ticket & LinkedIn card."
                    : "Optional: Add a portrait photo for your ticket stub & LinkedIn badge."}
                </span>
              </div>
              <label className="px-3.5 py-2 rounded-lg bg-[#15304B] border border-[#D97706]/40 hover:border-[#F59E0B] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                <Camera className="w-3.5 h-3.5 text-[#F59E0B]" />
                {effectiveAvatarUrl ? "Change Photo" : "Add Badge Photo"}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          </div>

          {/* High-Contrast Gate QR Code Box */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#091727] border border-emerald-500/35">
            <div className="text-[11px] font-mono font-extrabold text-emerald-300 uppercase tracking-wider mb-3">
              ● GATE SCANNER QR PASS
            </div>
            <div className="bg-white p-3.5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePass.qr_code}
                alt={`Admission QR code for ${activePass.registration_id}`}
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain block"
              />
            </div>
            <div className="mt-3 text-center">
              <div className="font-mono text-sm font-black text-[#FEF08A] tracking-wider">
                {activePass.registration_id}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Present this code + original National ID at entrance gate
              </div>
            </div>
          </div>
        </div>

        {/* ── 5 QUICK ACTION BUTTONS RIGHT BELOW QR CODE ── */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={handleDownloadQRCode}
            className="px-4 py-3 rounded-xl bg-[#15304B] border border-slate-700 hover:border-[#F59E0B] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#F59E0B] shrink-0" />
            Download QR (PNG)
          </button>

          <button
            type="button"
            onClick={handleDownloadTicketPDF}
            disabled={!ticketReady}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            {ticketReady ? "Download Ticket (PDF)" : "Preparing PDF..."}
          </button>

          <button
            type="button"
            onClick={handleLinkedInShare}
            className="px-4 py-3 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-[0_0_18px_rgba(0,119,181,0.3)] cursor-pointer"
          >
            <FaLinkedin className="w-4 h-4 shrink-0" />
            {shared ? "Shared on LinkedIn" : "Share on LinkedIn"}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-[0_0_16px_rgba(16,185,129,0.25)]"
          >
            <FaWhatsapp className="w-4 h-4 shrink-0" />
            Join WhatsApp Group
          </a>

          <a
            href={eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-[#15304B] border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            Open Venue Maps
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      </section>

      {/* ── LIVE EVENT DAY AGENDA (EXACT WIREFRAME SYNCED WITH ADMIN CMS) ── */}
      <section className="w-full p-4 sm:p-7 rounded-3xl bg-[#0A1A2B]/90 border border-slate-800 shadow-2xl mb-10">
        <DualHallAgenda agenda={agenda} compact id="live-agenda" />
      </section>

      {/* ── OFFICIAL WHATSAPP COMMUNITY BANNER ── */}
      <div className="w-full mb-10">
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/35 p-5 sm:p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full inline-flex items-center gap-2 font-bold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {confirmationCms.whatsappBadge}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {confirmationCms.whatsappTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {confirmationCms.whatsappDescription}
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 transition shrink-0 text-sm"
          >
            <FaWhatsapp className="w-5 h-5 shrink-0" />
            {confirmationCms.whatsappButtonLabel}
          </a>
        </div>
      </div>

      {/* ── WIDESCREEN OFFICIAL ADMISSION TICKET STUB ── */}
      <div className="w-full mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#D97706]" /> Widescreen Official Ticket Stub
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              High-resolution ticket canvas exported into your printable PDF pass.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadTicketPDF}
            disabled={!ticketReady}
            className="px-4 py-2 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-xs font-bold text-[#F59E0B] hover:text-white hover:border-[#D97706] flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Export Ticket PDF
          </button>
        </div>

        <div
          ref={ticketContainerRef}
          className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/45 shadow-2xl bg-[#070F1E]"
        >
          <canvas ref={ticketCanvasRef} className="w-full h-auto block" />
        </div>
      </div>

      {/* ── LINKEDIN SOCIAL SHARE CARD PREVIEW & COPY ── */}
      <div ref={linkedInSectionRef} className="w-full mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#F59E0B]" /> LinkedIn &ldquo;I&apos;m Attending&rdquo; Card
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized 1600×900 PNG download &amp; /api/og LinkedIn link preview.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={!cardReady}
            className="px-4 py-2 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-xs font-bold text-[#F59E0B] hover:text-white hover:border-[#D97706] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Download Badge (PNG)
          </button>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/35 shadow-xl bg-[#07111E] mb-5">
          <canvas ref={linkedInCanvasRef} className="w-full h-auto block" />
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 text-left">
          <div className="flex items-center justify-between mb-2 gap-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-[#D97706]" /> Pre-filled LinkedIn Post Text
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(linkedInPostText);
                  setCopiedCaption(true);
                  showToast("LinkedIn post text copied to clipboard!", 4000);
                  setTimeout(() => setCopiedCaption(false), 4000);
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
              <button
                type="button"
                onClick={handleLinkedInShare}
                className="px-3 py-1.5 rounded-lg bg-[#0077B5] hover:bg-[#006097] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FaLinkedin className="w-3.5 h-3.5" /> Share Now
              </button>
            </div>
          </div>
          <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#15304B]/60 p-3.5 rounded-xl border border-slate-800">
            {linkedInPostText}
          </pre>
        </div>
      </div>

      {/* ── EVENT METADATA & ADMISSION CHECKLIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mb-8">
        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <Calendar className="w-4 h-4 text-[#D97706]" /> Event Date
          </div>
          <div className="text-lg font-extrabold text-white">{eventDate}</div>
          <div className="text-xs font-semibold text-slate-300 mt-1">{eventTime}</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <MapPin className="w-4 h-4 text-[#D97706]" /> Venue &amp; Maps
          </div>
          <div className="text-lg font-extrabold text-white">{eventVenue}</div>
          <a
            href={eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1 mt-1.5"
          >
            Open Directions in Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/25">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F59E0B] uppercase mb-2">
            <Clock className="w-4 h-4 text-[#D97706]" /> Gate Check-In
          </div>
          <div className="text-lg font-extrabold text-white">Fast-Track QR Scan</div>
          <div className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> Bring original National ID
          </div>
        </div>
      </div>

      <div className="w-full p-6 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/25 text-left mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#D97706]" /> {confirmationCms.checklistTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          {confirmationCms.checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-[#15304B]/70 border border-slate-800"
            >
              <div className="w-6 h-6 rounded-full bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <strong className="text-white block mb-0.5">{item.title}</strong>
                <span>
                  {idx === 0 ? `${item.description} (${activePass.email})` : item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
