"use client";

import React, { useEffect, useState, useRef, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
  Camera,
  Loader2,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LINKEDIN_POST_TEXT } from "@/config/registration";
import {
  TEMPLATE_BASE_WIDTH,
  TEMPLATE_SLOTS,
  computeNameFontSize,
  computeUniversityFontSize,
  getInitials,
  truncateText,
} from "@/lib/og/card-data";

interface RegisteredData {
  success: boolean;
  registration_id: string;
  full_name: string;
  email: string;
  university: string;
  faculty?: string;
  department?: string;
  academic_year?: string;
  job_title?: string;
  company?: string | null;
  is_esme_member?: boolean;
  committee?: string | null;
  role?: string | null;
  qr_code: string;
  avatar_url?: string | null;
}

const WHATSAPP_GROUP_URL_DEFAULT = "https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW";

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

async function loadCorsSafeImage(src: string): Promise<{
  image: HTMLImageElement | null;
  revoke?: () => void;
}> {
  if (!src) return { image: null };

  // Local blob/data URLs or same-origin assets can load directly
  const isRemoteHttp = /^https?:\/\//i.test(src);
  if (isRemoteHttp) {
    try {
      const response = await fetch(src, { mode: "cors", cache: "no-store" });
      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const img = await new Promise<HTMLImageElement | null>((resolve) => {
          const el = new window.Image();
          el.onload = () => resolve(el);
          el.onerror = () => resolve(null);
          el.src = objectUrl;
        });
        if (img) {
          return { image: img, revoke: () => URL.revokeObjectURL(objectUrl) };
        }
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      // Fall through to standard CORS Image attempt
    }
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    if (isRemoteHttp || src.startsWith("/")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve({ image: img });
    img.onerror = () => resolve({ image: null });
    img.src = src;
  });
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
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
    initialData?.avatar_url ?? null
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [shared, setShared] = useState(false);
  const [ticketReady, setTicketReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState(WHATSAPP_GROUP_URL_DEFAULT);

  const ticketContainerRef = useRef<HTMLDivElement>(null);
  const ticketCanvasRef = useRef<HTMLCanvasElement>(null);
  const linkedInCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiFired = useRef(false);

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
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#10B981", "#3B82F6", "#EC4899", "#FFFFFF"],
      });

      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 70,
          origin: { x: 0.05, y: 0.65 },
          colors: ["#D97706", "#F59E0B", "#10B981", "#FFFFFF"],
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 70,
          origin: { x: 0.95, y: 0.65 },
          colors: ["#D97706", "#F59E0B", "#10B981", "#FFFFFF"],
        });
      }, 350);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          origin: { y: 0.3 },
          gravity: 0.8,
          ticks: 300,
          colors: ["#F59E0B", "#D97706", "#10B981"],
        });
      }, 700);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [data]);

  // Load CMS settings (WhatsApp URL)
  useEffect(() => {
    async function loadCmsSettings() {
      try {
        const supabase = createClient();
        const { data: rows } = await supabase
          .from("site_content")
          .select("key, value")
          .in("key", ["whatsapp_group_url"]);

        if (rows && rows.length > 0) {
          const map = new Map(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
          if (map.get("whatsapp_group_url")) {
            setWhatsappUrl(map.get("whatsapp_group_url")!);
          }
        }
      } catch {
        // Table may not exist yet; keep defaults
      }
    }
    loadCmsSettings();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. RENDER WIDESCREEN EVENT TICKET CANVAS (2048 x 1152 high-fidelity retina)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data || !ticketCanvasRef.current) return;

    const canvas = ticketCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const revokers: (() => void)[] = [];

    const width = 2048;
    const height = 1152;
    canvas.width = width;
    canvas.height = height;

    async function renderTicket() {
      if (!data || !ctx) return;
      const { image: bgImg } = await loadCorsSafeImage("/images/ticket-bg.jpg");
      if (cancelled) return;

      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#070F1E");
        bgGrad.addColorStop(1, "#0F243A");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      const drawAttendeeBadge = (photoImage: HTMLImageElement | null) => {
        const cx = 1310;
        const cy = 370;
        const r = 130;

        ctx.save();

        const glow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r + 50);
        glow.addColorStop(0, "rgba(245, 158, 11, 0.45)");
        glow.addColorStop(1, "rgba(217, 119, 6, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 5;
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x1 = cx + (r + 9) * Math.cos(angle);
          const y1 = cy + (r + 9) * Math.sin(angle);
          const x2 = cx + (r + 19) * Math.cos(angle);
          const y2 = cy + (r + 19) * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "#FEF08A";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(217, 119, 6, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();

        if (photoImage) {
          const imgAspect = photoImage.width / photoImage.height;
          let dw = r * 2;
          let dh = r * 2;
          let dx = cx - r;
          let dy = cy - r;

          if (imgAspect > 1) {
            dw = r * 2 * imgAspect;
            dx = cx - dw / 2;
          } else {
            dh = (r * 2) / imgAspect;
            dy = cy - dh / 2;
          }
          ctx.drawImage(photoImage, dx, dy, dw, dh);
        } else {
          const avatarGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
          avatarGrad.addColorStop(0, "#15304B");
          avatarGrad.addColorStop(1, "#0A192B");
          ctx.fillStyle = avatarGrad;
          ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

          const initials = getInitials(data.full_name);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 56px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(initials, cx, cy - 8);

          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 14px monospace";
          ctx.fillText("ATTENDEE", cx, cy + 42);
        }
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(254, 240, 138, 0.5)";
        ctx.lineWidth = 3;
        ctx.stroke();

        const nameText = `${data.full_name.toUpperCase()} OFFICIAL ATTENDEE`;
        ctx.font = "900 22px monospace";
        const textMetrics = ctx.measureText(nameText);
        const pillW = Math.max(textMetrics.width + 36, 320);

        ctx.fillStyle = "rgba(7, 18, 33, 0.85)";
        drawRoundedRect(ctx, cx - pillW / 2, 518, pillW, 64, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#FEF08A";
        ctx.font = "900 20px monospace";
        ctx.shadowColor = "rgba(254, 240, 138, 0.6)";
        ctx.shadowBlur = 8;
        ctx.fillText(nameText, cx, 542);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#10B981";
        ctx.font = "bold 16px monospace";
        ctx.fillText("● GATE ADMISSION ACTIVE", cx, 568);

        ctx.restore();
      };

      const drawLeftRegistrantData = () => {
        ctx.save();

        const boxX = 100;
        const boxY = 665;
        const boxW = 920;
        const boxH = 145;

        ctx.fillStyle = "rgba(7, 18, 33, 0.85)";
        drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 14);
        ctx.fill();

        ctx.strokeStyle = "rgba(217, 119, 6, 0.45)";
        ctx.lineWidth = 2;
        ctx.stroke();

        const bracketLen = 14;
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(boxX + 6, boxY + 6 + bracketLen);
        ctx.lineTo(boxX + 6, boxY + 6);
        ctx.lineTo(boxX + 6 + bracketLen, boxY + 6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(boxX + boxW - 6 - bracketLen, boxY + 6);
        ctx.lineTo(boxX + boxW - 6, boxY + 6);
        ctx.lineTo(boxX + boxW - 6, boxY + 6 + bracketLen);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(boxX + 6, boxY + boxH - 6 - bracketLen);
        ctx.lineTo(boxX + 6, boxY + boxH - 6);
        ctx.lineTo(boxX + 6 + bracketLen, boxY + boxH - 6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(boxX + boxW - 6 - bracketLen, boxY + boxH - 6);
        ctx.lineTo(boxX + boxW - 6, boxY + boxH - 6);
        ctx.lineTo(boxX + boxW - 6, boxY + boxH - 6 - bracketLen);
        ctx.stroke();

        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText("✦ OFFICIAL ATTENDEE CREDENTIAL // PASS", boxX + 24, boxY + 30);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 20px monospace";
        ctx.fillText("ATTENDEE:", boxX + 24, boxY + 68);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 28px system-ui, -apple-system, sans-serif";
        const displayName = truncateText(data.full_name, 28).toUpperCase();
        ctx.fillText(displayName, boxX + 160, boxY + 68);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 18px monospace";
        ctx.fillText("ID:", boxX + 24, boxY + 108);

        ctx.fillStyle = "#FEF08A";
        ctx.font = "900 24px monospace";
        ctx.fillText(data.registration_id, boxX + 72, boxY + 108);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 16px monospace";
        ctx.fillText("UNIVERSITY & MAJOR:", boxX + 320, boxY + 108);

        ctx.fillStyle = "#E2E8F0";
        ctx.font = "bold 19px system-ui, -apple-system, sans-serif";
        const majorLabel = data.department || data.faculty || "";
        const uniFaculty = `${data.university || "Cairo University"}${
          majorLabel ? " / " + majorLabel : ""
        }`;
        ctx.fillText(truncateText(uniFaculty, 30), boxX + 528, boxY + 108);

        ctx.restore();
      };

      const drawRightStub = async () => {
        ctx.save();

        const qrBoxX = 1664;
        const qrBoxY = 416;
        const qrBoxW = 264;
        const qrBoxH = 264;

        ctx.fillStyle = "#FFFFFF";
        drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 16);
        ctx.fill();

        if (data.qr_code) {
          const { image: qrImg } = await loadCorsSafeImage(data.qr_code);
          if (cancelled) return;
          if (qrImg) {
            ctx.drawImage(qrImg, qrBoxX + 12, qrBoxY + 12, qrBoxW - 24, qrBoxH - 24);
          }

          const bX1 = qrBoxX - 8;
          const bY1 = qrBoxY - 8;
          const bX2 = qrBoxX + qrBoxW + 8;
          const bY2 = qrBoxY + qrBoxH + 8;
          const bLen = 28;

          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(bX1, bY1 + bLen);
          ctx.lineTo(bX1, bY1);
          ctx.lineTo(bX1 + bLen, bY1);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(bX2 - bLen, bY1);
          ctx.lineTo(bX2, bY1);
          ctx.lineTo(bX2, bY1 + bLen);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(bX1, bY2 - bLen);
          ctx.lineTo(bX1, bY2);
          ctx.lineTo(bX1 + bLen, bY2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(bX2 - bLen, bY2);
          ctx.lineTo(bX2, bY2);
          ctx.lineTo(bX2, bY2 - bLen);
          ctx.stroke();

          ctx.textAlign = "center";
          ctx.fillStyle = "#F59E0B";
          ctx.font = "bold 22px monospace";
          ctx.fillText("SCAN TO JOIN", 1796, 755);

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "900 26px monospace";
          ctx.fillText(`ID: ${data.registration_id}`, 1796, 810);
        }

        ctx.restore();
        setTicketReady(true);
      };

      drawLeftRegistrantData();

      const currentAvatar = avatarPreviewUrl || data.avatar_url;
      if (currentAvatar) {
        const { image: photoImg, revoke } = await loadCorsSafeImage(currentAvatar);
        if (revoke) revokers.push(revoke);
        if (cancelled) return;
        drawAttendeeBadge(photoImg);
      } else {
        drawAttendeeBadge(null);
      }

      await drawRightStub();
    }

    renderTicket();

    return () => {
      cancelled = true;
      revokers.forEach((fn) => fn());
    };
  }, [data, avatarPreviewUrl]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. RENDER 1600x900 HIGH-RES LINKEDIN SOCIAL SHARE CARD (Master Template)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!data || !linkedInCanvasRef.current) return;

    const canvas = linkedInCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const revokers: (() => void)[] = [];

    const CARD_WIDTH = 1600;
    const CARD_HEIGHT = 900;
    const SCALE = CARD_WIDTH / TEMPLATE_BASE_WIDTH; // 1.5625
    const sc = (v: number) => Math.round(v * SCALE);

    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;

    async function renderSocialCard() {
      if (!data || !ctx) return;
      setCardReady(false);

      const currentAvatar = avatarPreviewUrl || data.avatar_url;
      const [templateRes, avatarRes] = await Promise.all([
        loadCorsSafeImage("/images/attending-card-template.png"),
        currentAvatar
          ? loadCorsSafeImage(currentAvatar)
          : Promise.resolve<{ image: HTMLImageElement | null; revoke?: () => void }>({
              image: null,
            }),
      ]);
      if (avatarRes.revoke) revokers.push(avatarRes.revoke);
      if (cancelled) return;

      // 1. Base Master Template (1600x900 crisp widescreen 16:9)
      if (templateRes.image) {
        ctx.drawImage(templateRes.image, 0, 0, CARD_WIDTH, CARD_HEIGHT);
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
        bgGrad.addColorStop(0, "#07111E");
        bgGrad.addColorStop(1, "#0D1F35");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
      }

      // 2. Optional Attendee Portrait clipped to Octagonal Chamfer Frame
      const pSlot = TEMPLATE_SLOTS.portrait;
      if (avatarRes.image) {
        const px = sc(pSlot.x);
        const py = sc(pSlot.y);
        const pw = sc(pSlot.width);
        const ph = sc(pSlot.height);

        ctx.save();
        ctx.beginPath();
        pSlot.polygonPoints.forEach(([ox, oy], idx) => {
          const vx = px + sc(ox);
          const vy = py + sc(oy);
          if (idx === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        });
        ctx.closePath();
        ctx.clip();

        const photoImg = avatarRes.image;
        const imgAspect = photoImg.width / photoImg.height;
        const boxAspect = pw / ph;
        let dw = pw;
        let dh = ph;
        let dx = px;
        let dy = py;

        if (imgAspect > boxAspect) {
          dw = ph * imgAspect;
          dx = px - (dw - pw) / 2;
        } else {
          dh = pw / imgAspect;
          // Slight upward bias keeps faces nicely framed inside tall portraits
          dy = py - (dh - ph) * 0.35;
        }
        ctx.drawImage(photoImg, dx, dy, dw, dh);
        ctx.restore();
      }

      // 3. Attendee Full Name (Mask "YOUR NAME HERE" slot)
      const nSlot = TEMPLATE_SLOTS.nameMask;
      const nx = sc(nSlot.x);
      const ny = sc(nSlot.y);
      const nw = sc(nSlot.width);
      const nh = sc(nSlot.height);

      ctx.fillStyle = nSlot.fill;
      ctx.fillRect(nx, ny, nw, nh);

      const upperName = truncateText(data.full_name, 28).toUpperCase();
      let nameSize = computeNameFontSize(upperName, SCALE);
      ctx.font = `900 ${nameSize}px system-ui, -apple-system, sans-serif`;
      while (nameSize > 14 && ctx.measureText(upperName).width > nw - sc(12)) {
        nameSize -= 1;
        ctx.font = `900 ${nameSize}px system-ui, -apple-system, sans-serif`;
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(upperName, sc(nSlot.centerX), ny + nh / 2 + 1);

      // 4. Attendee University (Mask "Your University" slot under gold divider)
      const uSlot = TEMPLATE_SLOTS.universityMask;
      const ux = sc(uSlot.x);
      const uy = sc(uSlot.y);
      const uw = sc(uSlot.width);
      const uh = sc(uSlot.height);

      ctx.fillStyle = uSlot.fill;
      ctx.fillRect(ux, uy, uw, uh);

      const displayUniversity = truncateText(data.university || "Cairo University", 34);
      let uniSize = computeUniversityFontSize(displayUniversity, SCALE);
      ctx.font = `italic 500 ${uniSize}px system-ui, -apple-system, sans-serif`;
      while (uniSize > 12 && ctx.measureText(displayUniversity).width > uw - sc(14)) {
        uniSize -= 1;
        ctx.font = `italic 500 ${uniSize}px system-ui, -apple-system, sans-serif`;
      }
      ctx.fillStyle = "#F8FAFC";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayUniversity, sc(uSlot.centerX), uy + uh / 2 + 1);

      // 5. Event Venue Fix (Bottom-left location pin: replace "Your University" with "Cairo University")
      const vSlot = TEMPLATE_SLOTS.bottomVenueMask;
      const vx = sc(vSlot.x);
      const vy = sc(vSlot.y);
      const vw = sc(vSlot.width);
      const vh = sc(vSlot.height);

      const venueGrad = ctx.createLinearGradient(vx, vy, vx + vw, vy);
      venueGrad.addColorStop(0, vSlot.fill);
      venueGrad.addColorStop(0.88, vSlot.fill);
      venueGrad.addColorStop(1, "rgba(0, 17, 37, 0)");
      ctx.fillStyle = venueGrad;
      ctx.fillRect(vx, vy, vw, vh);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = `700 ${Math.round(17 * SCALE)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("Cairo University", sc(vSlot.textX), vy + vh / 2 + 1);

      setCardReady(true);
    }

    renderSocialCard();

    return () => {
      cancelled = true;
      revokers.forEach((fn) => fn());
    };
  }, [data, avatarPreviewUrl]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS: PHOTO UPLOAD, PDF/PNG EXPORT & LINKEDIN SHARE
  // ─────────────────────────────────────────────────────────────────────────────

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
  const handleDownloadTicketPDF = async () => {
    if (!data) return;

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

      const aspectRatio = 576 / 1024;
      const ticketWidth = 270;
      const ticketHeight = ticketWidth * aspectRatio;
      const xOffset = (pageWidth - ticketWidth) / 2;
      const yOffset = (pageHeight - ticketHeight) / 2;

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, ticketWidth, ticketHeight);
      pdf.save(`ESME-METRIX-Ticket-${data.registration_id || "2026"}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      if (ticketCanvasRef.current) {
        const canvas = ticketCanvasRef.current;
        const imgData = canvas.toDataURL("image/jpeg", 0.98);
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
        pdf.save(`ESME-METRIX-Ticket-${data.registration_id || "2026"}.pdf`);
      }
    }
  };

  // ACTION 2: Download Standalone Dynamic QR Code (PNG)
  const handleDownloadQRCode = () => {
    if (!data?.qr_code) return;
    const a = document.createElement("a");
    a.href = data.qr_code;
    a.download = `ESME-METRIX-QR-${data.registration_id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ACTION 3: Download "I'm Attending" Social Card (PNG)
  const handleDownloadCard = () => {
    if (!linkedInCanvasRef.current || !cardReady) return;
    const url = linkedInCanvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESME-METRIX-Attending-${data?.registration_id || "Badge"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ACTION 4: Copy Exact Caption & Open LinkedIn Share Dialog pointing to /share/[ticketId]
  const handleLinkedInShare = async () => {
    if (!data) return;

    try {
      await navigator.clipboard.writeText(LINKEDIN_POST_TEXT);
      setCopiedCaption(true);
    } catch (err) {
      console.warn("Clipboard write failed:", err);
    }

    setToastMessage(
      "Post text copied! Paste it into LinkedIn—your personalized card will load with the link or you can attach the downloaded PNG."
    );
    setTimeout(() => {
      setCopiedCaption(false);
      setToastMessage(null);
    }, 7000);

    handleDownloadCard();

    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://esme-metrix-registeration.vercel.app")
    ).replace(/\/$/, "");
    const shareUrl = `${baseUrl}/share/${encodeURIComponent(data.registration_id)}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
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

  const attendeeInitials = getInitials(data.full_name);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl bg-[#0F243A] border-2 border-[#10B981] shadow-2xl text-left flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {toastMessage.includes("copied") ? "POST TEXT COPIED!" : "SUCCESS"}
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
        ADMISSION CONFIRMED &amp; CREDENTIAL ISSUED
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
        Welcome to ESME METRIX 2026!
      </h1>
      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
        Congratulations <span className="text-[#D97706] font-semibold">{data.full_name}</span>.
        Your official event ticket stub has been generated with your gate admission credentials.
      </p>

      {/* ── WHATSAPP GROUP OFFICIAL BANNER CARD (RTL ARABIC) ── */}
      <div className="w-full max-w-4xl mb-10">
        <div
          dir="rtl"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-950/35 p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex-1">
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full inline-flex items-center gap-2 font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                خطوة هامة: انضم للجروب الرسمي
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                جروب الواتساب الرسمي للحدث
              </h3>

              <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                انضم الآن لمتابعة مواعيد ورش العمل، جدول المحاضرات، والتواصل مع منظمي الفعالية
                وزملائك المهندسين.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 transition shrink-0 text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-current shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              انضم للجروب الآن
            </a>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* BADGE PORTRAIT PHOTO UPLOAD SECTION                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl p-5 rounded-2xl bg-[#0F243A] border-2 border-[#D97706]/40 shadow-[0_0_25px_rgba(217,119,6,0.2)] mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-[#15304B] overflow-hidden flex items-center justify-center shrink-0 relative">
              {avatarPreviewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreviewUrl}
                  alt="Badge Portrait"
                  crossOrigin={avatarPreviewUrl.startsWith("http") ? "anonymous" : undefined}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#F59E0B] font-black text-lg">{attendeeInitials}</span>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#F59E0B] animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#F59E0B]" />
                Badge Portrait Photo <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {avatarPreviewUrl
                  ? "Your photo is loaded onto your widescreen ticket stub and social attendance badge."
                  : "Optional: Upload a portrait photo to personalize your ticket stub and LinkedIn badge."}
              </p>
            </div>
          </div>

          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] shrink-0">
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
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. WIDESCREEN EVENT TICKET STUB                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Ticket className="w-6 h-6 text-[#D97706]" /> Official Admission Ticket Stub
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              High-resolution widescreen ticket featuring dynamic registrant data, avatar frame, and gate QR code.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#F59E0B] px-3.5 py-1.5 rounded-full bg-[#0F243A] border border-[#D97706]/40 self-start sm:self-auto shadow-sm">
            ID: {data.registration_id}
          </span>
        </div>

        <div
          ref={ticketContainerRef}
          className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/50 shadow-[0_0_40px_rgba(217,119,6,0.25)] bg-[#070F1E] mb-6"
        >
          <canvas ref={ticketCanvasRef} className="w-full h-auto block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <button
            onClick={handleDownloadTicketPDF}
            disabled={!ticketReady}
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(217,119,6,0.35)] hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {ticketReady ? "DOWNLOAD TICKET (PDF)" : "PREPARING PDF..."}
          </button>

          <button
            onClick={handleDownloadQRCode}
            className="px-6 py-4 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-slate-200 hover:text-white hover:border-[#D97706] hover:bg-[#1D3046] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#D97706]" />
            DOWNLOAD QR (PNG)
          </button>

          <button
            onClick={handleLinkedInShare}
            className="px-6 py-4 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(0,119,181,0.35)] cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            {shared ? "SHARED ON LINKEDIN" : "SHARE ON LINKEDIN"}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. LINKEDIN SOCIAL CARD PREVIEW & PRE-FILLED POST TEXT              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="w-full mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#F59E0B]" /> LinkedIn Social Share Card Preview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-resolution dynamic attendance badge (1600x900 PNG download, 1200x675 /api/og LinkedIn preview).
            </p>
          </div>
          <button
            onClick={handleDownloadCard}
            disabled={!cardReady}
            className="px-4 py-2 rounded-xl bg-[#0F243A] border border-[#D97706]/40 text-xs font-bold text-[#F59E0B] hover:text-white hover:border-[#D97706] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Download Badge (PNG)
          </button>
        </div>

        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/35 shadow-xl bg-[#07111E] mb-5">
          <canvas ref={linkedInCanvasRef} className="w-full h-auto block" />
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5 text-[#D97706]" /> Pre-filled LinkedIn Post Text
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(LINKEDIN_POST_TEXT);
                setCopiedCaption(true);
                setToastMessage(
                  "Post text copied! Paste it into LinkedIn—your personalized card will load with the link or you can attach the downloaded PNG."
                );
                setTimeout(() => {
                  setCopiedCaption(false);
                  setToastMessage(null);
                }, 5000);
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
            {LINKEDIN_POST_TEXT}
          </pre>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. EVENT DETAILS & ACCESS CHECKLIST                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left mb-10">
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
      <div className="w-full p-6 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/25 text-left mb-10">
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
              Please bring your original National ID for gate identification.
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
