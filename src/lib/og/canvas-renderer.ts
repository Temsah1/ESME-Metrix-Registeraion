import {
  TEMPLATE_BASE_WIDTH,
  TEMPLATE_SLOTS,
  computeNameFontSize,
  computeUniversityFontSize,
  getInitials,
  truncateText,
} from "@/lib/og/card-data";
import type { PublicAttendeePass } from "@/lib/registrants/public-pass";

export async function loadCorsSafeImage(src: string): Promise<{
  image: HTMLImageElement | null;
  revoke?: () => void;
}> {
  if (!src) return { image: null };

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
      // Fall back to direct crossOrigin load
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

export async function renderTicketStubCanvas(params: {
  canvas: HTMLCanvasElement;
  data: PublicAttendeePass;
  avatarUrl: string | null;
  ticketBgUrl: string;
  isCancelled: () => boolean;
}): Promise<{ ready: boolean; revokers: (() => void)[] }> {
  const { canvas, data, avatarUrl, ticketBgUrl, isCancelled } = params;
  const ctx = canvas.getContext("2d");
  const revokers: (() => void)[] = [];
  if (!ctx) return { ready: false, revokers };

  const width = 2048;
  const height = 1152;
  canvas.width = width;
  canvas.height = height;

  const bgRes = await loadCorsSafeImage(ticketBgUrl || "/images/ticket-bg.jpg");
  if (bgRes.revoke) revokers.push(bgRes.revoke);
  if (isCancelled()) return { ready: false, revokers };

  if (bgRes.image) {
    ctx.drawImage(bgRes.image, 0, 0, width, height);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#070F1E");
    bgGrad.addColorStop(1, "#0F243A");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Left Registrant Info Box
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

  ctx.fillStyle = "#F59E0B";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "left";
  ctx.fillText("✦ OFFICIAL ATTENDEE CREDENTIAL // PASS", boxX + 24, boxY + 30);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 20px monospace";
  ctx.fillText("ATTENDEE:", boxX + 24, boxY + 68);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 28px system-ui, -apple-system, sans-serif";
  ctx.fillText(truncateText(data.full_name, 28).toUpperCase(), boxX + 160, boxY + 68);

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
    majorLabel ? ` / ${majorLabel}` : ""
  }`;
  ctx.fillText(truncateText(uniFaculty, 30), boxX + 528, boxY + 108);
  ctx.restore();

  // Center Portrait / Initials Medallion
  let photoImg: HTMLImageElement | null = null;
  if (avatarUrl) {
    const avatarRes = await loadCorsSafeImage(avatarUrl);
    if (avatarRes.revoke) revokers.push(avatarRes.revoke);
    if (isCancelled()) return { ready: false, revokers };
    photoImg = avatarRes.image;
  }

  ctx.save();
  const cx = 1310;
  const cy = 370;
  const r = 130;

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

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  if (photoImg) {
    const imgAspect = photoImg.width / photoImg.height;
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
    ctx.drawImage(photoImg, dx, dy, dw, dh);
  } else {
    const avatarGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    avatarGrad.addColorStop(0, "#15304B");
    avatarGrad.addColorStop(1, "#0A192B");
    ctx.fillStyle = avatarGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 56px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getInitials(data.full_name), cx, cy - 8);

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

  const nameBadgeText = `${data.full_name.toUpperCase()} OFFICIAL ATTENDEE`;
  ctx.font = "900 22px monospace";
  const pillW = Math.max(ctx.measureText(nameBadgeText).width + 36, 320);

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
  ctx.fillText(nameBadgeText, cx, 542);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#10B981";
  ctx.font = "bold 16px monospace";
  ctx.fillText("● GATE ADMISSION ACTIVE", cx, 568);
  ctx.restore();

  // Right QR Stub
  ctx.save();
  const qrBoxX = 1664;
  const qrBoxY = 416;
  const qrBoxW = 264;
  const qrBoxH = 264;

  ctx.fillStyle = "#FFFFFF";
  drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 16);
  ctx.fill();

  if (data.qr_code) {
    const { image: qrImg, revoke: qrRevoke } = await loadCorsSafeImage(data.qr_code);
    if (qrRevoke) revokers.push(qrRevoke);
    if (isCancelled()) return { ready: false, revokers };
    if (qrImg) {
      ctx.drawImage(qrImg, qrBoxX + 12, qrBoxY + 12, qrBoxW - 24, qrBoxH - 24);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 22px monospace";
    ctx.fillText("SCAN TO JOIN", 1796, 755);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 26px monospace";
    ctx.fillText(`ID: ${data.registration_id}`, 1796, 810);
  }
  ctx.restore();

  return { ready: true, revokers };
}

export async function renderAttendingCardCanvas(params: {
  canvas: HTMLCanvasElement;
  data: PublicAttendeePass;
  avatarUrl: string | null;
  isCancelled: () => boolean;
}): Promise<{ ready: boolean; revokers: (() => void)[] }> {
  const { canvas, data, avatarUrl, isCancelled } = params;
  const ctx = canvas.getContext("2d");
  const revokers: (() => void)[] = [];
  if (!ctx) return { ready: false, revokers };

  const CARD_WIDTH = 1600;
  const CARD_HEIGHT = 900;
  const SCALE = CARD_WIDTH / TEMPLATE_BASE_WIDTH;
  const sc = (v: number) => Math.round(v * SCALE);

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const [templateRes, avatarRes] = await Promise.all([
    loadCorsSafeImage("/images/attending-card-template.png"),
    avatarUrl
      ? loadCorsSafeImage(avatarUrl)
      : Promise.resolve<{ image: HTMLImageElement | null; revoke?: () => void }>({
          image: null,
        }),
  ]);
  if (templateRes.revoke) revokers.push(templateRes.revoke);
  if (avatarRes.revoke) revokers.push(avatarRes.revoke);
  if (isCancelled()) return { ready: false, revokers };

  if (templateRes.image) {
    ctx.drawImage(templateRes.image, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
    bgGrad.addColorStop(0, "#07111E");
    bgGrad.addColorStop(1, "#0D1F35");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  }

  // 1. Optional Portrait Clipped Inside Right Chamfered Frame
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
      dy = py - (dh - ph) * 0.35;
    }
    ctx.drawImage(photoImg, dx, dy, dw, dh);
    ctx.restore();
  }

  // 2. Mask & Replace "YOUR NAME HERE"
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

  // 3. Mask & Replace "Your University" under nameplate
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

  // 4. Bottom-Left Venue Fix: Replace "Your University" with "Cairo University"
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

  return { ready: true, revokers };
}
