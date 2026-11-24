// ═══════════════════════════════════════════════════════════════════
// ESME METRIX — Confirmation email template + Resend sender (shared)
// ═══════════════════════════════════════════════════════════════════
// This file is used by BOTH runtimes, so the email is identical whichever
// path delivers it:
//   • Supabase Edge Function  supabase/functions/send-confirmation (Deno)
//   • Next.js fallback        src/lib/email/confirmation.ts (Node)
//
// Keep it dependency-free: no imports, no `process`, no `Deno`, no `Buffer`.
// Configuration is passed in by each runtime.
// ═══════════════════════════════════════════════════════════════════

export interface ConfirmationEmailInput {
  fullName: string;
  registrationId: string;
  university: string;
  faculty?: string | null;
  academicYear?: string | null;
  graduationYear?: string | null;
  nationalId?: string | null;
  /** QR image as a data URL ("data:image/png;base64,...") or raw base64. */
  qrDataUrl: string;
}

export interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface ConfirmationEmailConfig {
  /** e.g. "ESME Metrix <noreply@esme-cu.org>" */
  from: string;
  eventDate: string;
  eventVenue: string;
  eventTime: string;
  /** Public site URL, used for the header logo. Logo is omitted when empty. */
  appUrl?: string;
  social?: SocialLinks;
}

export interface ConfirmationEmailAttachment {
  filename: string;
  /** base64 content */
  content: string;
  contentId: string;
  contentType: string;
}

export interface ConfirmationEmail {
  from: string;
  subject: string;
  html: string;
  text: string;
  attachments: ConfirmationEmailAttachment[];
}

export const CONFIRMATION_SUBJECT = "✅ You're registered — ESME Metrix 2026";
export const QR_CONTENT_ID = "metrix-qr";

export const DEFAULT_EMAIL_CONFIG: ConfirmationEmailConfig = {
  from: "ESME Metrix <onboarding@resend.dev>",
  eventDate: "12 December 2026",
  eventVenue: "Cairo University, Faculty of Engineering",
  eventTime: "Saturday 12 / 12 / 2026 — 09:00 AM",
  social: {
    whatsapp: "https://chat.whatsapp.com/BahfelppPpX8aXanFJvDhl?s=cl&p=i&iam=2",
  },
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shows only the last 4 digits: emails get forwarded, so the full ID never leaves the database. */
export function maskNationalId(nationalId?: string | null): string {
  if (!nationalId) return "N/A";
  const clean = nationalId.trim();
  if (clean.length <= 4) return "••••";
  return `${"•".repeat(clean.length - 4)}${clean.slice(-4)}`;
}

function isSafeHttpUrl(value?: string): value is string {
  return typeof value === "string" && /^https:\/\/[^\s"'<>]+$/i.test(value);
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function buildConfirmationEmailContent(
  input: ConfirmationEmailInput,
  config: ConfirmationEmailConfig = DEFAULT_EMAIL_CONFIG
): ConfirmationEmail {
  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university || "Cairo University");
  const faculty = escapeHtml(input.faculty || "Engineering");
  const academicYear = escapeHtml(input.academicYear || "Undergraduate");
  const graduationYear = escapeHtml(input.graduationYear || "2026");
  const maskedNationalId = escapeHtml(maskNationalId(input.nationalId));
  const registrationId = escapeHtml(input.registrationId);
  const eventDate = escapeHtml(config.eventDate);
  const eventVenue = escapeHtml(config.eventVenue);
  const eventTime = escapeHtml(config.eventTime);

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  // 1. Branded header logo (only when a public https site URL is configured)
  const logoUrl = isSafeHttpUrl(config.appUrl)
    ? `${stripTrailingSlash(config.appUrl)}/esme_logo.png`
    : null;
  const logoHtml = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="ESME Cairo University Student Chapter" width="72" height="72" style="width: 72px; height: 72px; display: block; margin: 0 auto 12px auto; border: 0; border-radius: 14px;" />`
    : "";

  // 8. Social links (only the ones configured)
  const social = config.social ?? {};
  const socialEntries: { label: string; url: string; color: string }[] = [];
  if (isSafeHttpUrl(social.facebook)) socialEntries.push({ label: "Facebook", url: social.facebook, color: "#1877F2" });
  if (isSafeHttpUrl(social.instagram)) socialEntries.push({ label: "Instagram", url: social.instagram, color: "#E1306C" });
  if (isSafeHttpUrl(social.linkedin)) socialEntries.push({ label: "LinkedIn", url: social.linkedin, color: "#0A66C2" });
  if (isSafeHttpUrl(social.whatsapp)) socialEntries.push({ label: "WhatsApp", url: social.whatsapp, color: "#25D366" });

  const socialHtml = socialEntries.length
    ? `<p style="margin: 0 0 12px 0;">${socialEntries
        .map(
          (s) =>
            `<a href="${escapeHtml(s.url)}" style="color: ${s.color}; text-decoration: none; font-weight: bold; font-size: 12px; margin: 0 8px;">${s.label}</a>`
        )
        .join(`<span style="color: #334155;">|</span>`)}</p>`
    : "";

  const whatsappCta = isSafeHttpUrl(social.whatsapp)
    ? `
              <tr>
                <td align="center" style="padding: 0 30px 25px 30px;">
                  <div style="background-color: rgba(37, 211, 102, 0.1); border: 1px solid #25D366; border-radius: 12px; padding: 18px; text-align: center;">
                    <p style="color: #FFFFFF; font-size: 13px; font-weight: bold; margin: 0 0 10px 0;">
                      انضم إلى جروب الواتساب الرسمي لمتابعة الورش والمحاضرات:
                    </p>
                    <a href="${escapeHtml(social.whatsapp)}" style="background-color: #25D366; color: #FFFFFF; text-decoration: none; font-weight: 900; font-size: 13px; padding: 10px 22px; border-radius: 20px; display: inline-block;">
                      دخول جروب الواتساب الرسمي
                    </a>
                  </div>
                </td>
              </tr>`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>ESME Metrix 2026 — Registration Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B1928; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B1928; padding: 25px 10px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0F243A; border: 2px solid #D97706; border-radius: 18px; overflow: hidden;">

              <!-- 1. Branded header: logo + event name -->
              <tr>
                <td align="center" style="background-color: #15304B; padding: 30px 20px 20px 20px; border-bottom: 1px solid rgba(217, 119, 6, 0.3);">
                  ${logoHtml}
                  <div style="font-size: 11px; font-weight: bold; color: #F59E0B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">
                    ESME CAIRO UNIVERSITY STUDENT CHAPTER
                  </div>
                  <h1 style="color: #FFFFFF; font-size: 30px; margin: 0; font-weight: 900; letter-spacing: 1px;">
                    ESME <span style="color: #D97706;">METRIX</span> 2026
                  </h1>
                  <p style="color: #94A3B8; font-size: 13px; margin: 6px 0 0 0;">
                    Flagship Materials &amp; Engineering Gathering
                  </p>
                </td>
              </tr>

              <!-- 3. Confirmation with green checkmark -->
              <tr>
                <td align="center" style="padding: 26px 20px 8px 20px;">
                  <div style="width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background-color: #10B981; color: #FFFFFF; font-size: 30px; font-weight: bold; text-align: center; margin: 0 auto 12px auto;">&#10003;</div>
                  <div style="background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-weight: bold; font-size: 13px; padding: 7px 18px; border-radius: 30px; display: inline-block;">
                    REGISTRATION CONFIRMED
                  </div>
                </td>
              </tr>

              <!-- 2. Personalized greeting -->
              <tr>
                <td style="padding: 12px 30px 20px 30px; color: #E2E8F0; text-align: center;">
                  <h2 style="color: #FFFFFF; font-size: 22px; margin: 0 0 10px 0;">Congratulations, ${name}!</h2>
                  <p style="color: #CBD5E1; font-size: 14px; line-height: 1.6; margin: 0;" dir="rtl">
                    تم تأكيد تسجيلك بنجاح في <strong>ESME METRIX 2026</strong>، وتم إصدار كود الدخول الخاص بك (QR Code).
                  </p>
                </td>
              </tr>

              <!-- 4. QR code, embedded inline (CID attachment) -->
              <tr>
                <td align="center" style="padding: 0 30px 25px 30px;">
                  <div style="background-color: #15304B; border: 2px dashed rgba(217, 119, 6, 0.5); border-radius: 14px; padding: 25px; text-align: center;">
                    <div style="font-size: 11px; font-weight: bold; color: #F59E0B; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px;">
                      OFFICIAL ADMISSION QR BADGE
                    </div>
                    <div style="background-color: #FFFFFF; padding: 12px; border-radius: 12px; display: inline-block;">
                      <img src="cid:${QR_CONTENT_ID}" alt="ESME Metrix admission QR code" width="220" height="220" style="width: 220px; height: 220px; display: block; border: 0;" />
                    </div>
                    <div style="font-family: monospace; font-size: 18px; font-weight: bold; color: #F59E0B; margin-top: 14px; letter-spacing: 1px;">
                      ID: ${registrationId}
                    </div>
                    <div style="font-size: 11px; color: #10B981; font-weight: bold; margin-top: 4px;">
                      ● Cryptographically signed &amp; verified
                    </div>
                  </div>
                </td>
              </tr>

              <!-- 5 + 6. Attendee details + event details -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: #11253B; border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.06);">
                    <div style="font-size: 12px; font-weight: bold; color: #D97706; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      Attendee Details — بيانات التسجيل
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="color: #CBD5E1; font-size: 13px;">
                      <tr><td width="38%" style="color: #94A3B8;">Name · الاسم</td><td style="color: #FFFFFF; font-weight: bold;">${name}</td></tr>
                      <tr><td style="color: #94A3B8;">University · الجامعة</td><td style="color: #FFFFFF;">${university}</td></tr>
                      <tr><td style="color: #94A3B8;">Registration ID · رقم التسجيل</td><td style="color: #F59E0B; font-weight: bold; font-family: monospace;">${registrationId}</td></tr>
                      <tr><td style="color: #94A3B8;">Department · القسم</td><td style="color: #FFFFFF;">${faculty}</td></tr>
                      <tr><td style="color: #94A3B8;">Year · السنة</td><td style="color: #FFFFFF;">${academicYear} (Class of ${graduationYear})</td></tr>
                      <tr><td style="color: #94A3B8;">National ID · الرقم القومي</td><td style="color: #FFFFFF; font-family: monospace;">${maskedNationalId}</td></tr>
                    </table>
                    <div style="height: 1px; background-color: rgba(217, 119, 6, 0.25); margin: 14px 0;"></div>
                    <div style="font-size: 12px; font-weight: bold; color: #D97706; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                      Event Details — تفاصيل الحدث
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="color: #CBD5E1; font-size: 13px;">
                      <tr><td width="38%" style="color: #94A3B8;">Date · التاريخ</td><td style="color: #F59E0B; font-weight: bold;">${eventDate}</td></tr>
                      <tr><td style="color: #94A3B8;">Venue · المكان</td><td style="color: #FFFFFF;">${eventVenue}</td></tr>
                      <tr><td style="color: #94A3B8;">Time · الميعاد</td><td style="color: #FFFFFF;">${eventTime}</td></tr>
                    </table>
                  </div>
                </td>
              </tr>

              <!-- 7. QR usage instructions for event day -->
              <tr>
                <td style="padding: 0 30px 25px 30px;">
                  <div style="background-color: rgba(217, 119, 6, 0.1); border-left: 4px solid #D97706; padding: 14px 18px; border-radius: 0 8px 8px 0; color: #FCD34D; font-size: 12.5px; line-height: 1.7;">
                    <div style="font-weight: bold; color: #F59E0B; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">How to use your QR on event day</div>
                    <ol style="margin: 0; padding-left: 18px; color: #E2E8F0;">
                      <li>Save this email or take a screenshot of the QR code (printing it also works).</li>
                      <li>Bring your original National ID or Student Karnet for identity check.</li>
                      <li>Show the QR at the entrance — staff will scan it to record your attendance.</li>
                      <li>The QR is personal and works once. Do not share it.</li>
                      <li>Your scan is required to receive the official attendance certificate.</li>
                    </ol>
                  </div>
                </td>
              </tr>
${whatsappCta}
              <!-- 8 + 9. Social links, footer, tagline -->
              <tr>
                <td align="center" style="background-color: #0A1929; padding: 22px 20px; border-top: 1px solid rgba(217, 119, 6, 0.2); color: #64748B; font-size: 11px;">
                  ${socialHtml}
                  <p style="margin: 0 0 6px 0; color: #D97706; font-weight: bold; letter-spacing: 2px;">
                    BE POSITIVE VALUABLE
                  </p>
                  <p style="margin: 0;">
                    &copy; 2026 ESME Cairo University Student Chapter. You received this email because you registered for ESME Metrix 2026.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const socialText = socialEntries.map((s) => `${s.label}: ${s.url}`);

  const text = [
    `Congratulations, ${input.fullName}!`,
    "Your registration for ESME Metrix 2026 is confirmed. — تم تأكيد تسجيلك في ESME METRIX 2026.",
    "",
    "ATTENDEE DETAILS",
    `Name: ${input.fullName}`,
    `University: ${input.university}`,
    `Registration ID: ${input.registrationId}`,
    `Department: ${input.faculty || "Engineering"}`,
    `Year: ${input.academicYear || "N/A"} (Class of ${input.graduationYear || "N/A"})`,
    `National ID: ${maskNationalId(input.nationalId)}`,
    "",
    "EVENT DETAILS",
    `Date: ${config.eventDate}`,
    `Venue: ${config.eventVenue}`,
    `Time: ${config.eventTime}`,
    "",
    "HOW TO USE YOUR QR ON EVENT DAY",
    `1. Your QR code is attached to this email (ESME-METRIX-QR-${input.registrationId}.png). Save it or take a screenshot.`,
    "2. Bring your original National ID or Student Karnet.",
    "3. Show the QR at the entrance — staff will scan it.",
    "4. The QR is personal and works once. Do not share it.",
    "5. Your scan is required to receive the official attendance certificate.",
    "",
    ...(socialText.length ? ["FOLLOW ESME", ...socialText, ""] : []),
    "BE POSITIVE VALUABLE.",
    "ESME Cairo University Student Chapter",
  ].join("\n");

  return {
    from: config.from,
    subject: CONFIRMATION_SUBJECT,
    html,
    text,
    attachments: [
      {
        filename: `ESME-METRIX-QR-${input.registrationId}.png`,
        content: qrBase64,
        contentId: QR_CONTENT_ID,
        contentType: "image/png",
      },
    ],
  };
}

export interface ResendSendResult {
  ok: boolean;
  id?: string;
  status: number;
  error?: string;
}

/**
 * Sends through the Resend REST API (https://resend.com/docs/api-reference/emails/send-email).
 * Works in Deno and Node 18+ (global fetch). The idempotency key makes a retry
 * (or the Next.js fallback after an Edge Function timeout) a no-op instead of a
 * duplicate email.
 */
export async function sendWithResend(
  apiKey: string,
  to: string,
  email: ConfirmationEmail,
  idempotencyKey?: string
): Promise<ResendSendResult> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: email.from,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      attachments: email.attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        content_type: a.contentType,
        content_id: a.contentId,
      })),
    }),
  });

  const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
  if (!response.ok) {
    return { ok: false, status: response.status, error: body.message || response.statusText };
  }
  return { ok: true, status: response.status, id: body.id };
}

export function confirmationIdempotencyKey(registrationId: string): string {
  return `esme-metrix-confirmation/${registrationId}`;
}
