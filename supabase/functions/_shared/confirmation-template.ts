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

/** Signature at the bottom of every confirmation email. */
export const EMAIL_SIGNATURE = {
  name: "Kareem Tamer",
  title: "Director of Digital Transformation & IT",
  organization: "ESME CU",
  team: "ESME METRIX Organizing Team",
};

export const DEFAULT_EMAIL_CONFIG: ConfirmationEmailConfig = {
  from: "ESME Metrix <onboarding@resend.dev>",
  eventDate: "12 December 2026",
  eventVenue: "Cairo University",
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

/** "Student" for current students, otherwise the stored status (Graduate / Alumni). */
export function academicStatusLabel(academicYear?: string | null): string {
  if (academicYear === "Graduate") return "Graduate";
  if (academicYear === "Alumni") return "Alumni";
  return "Student";
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
  const department = escapeHtml(input.faculty || "Engineering");
  const academicStatus = escapeHtml(academicStatusLabel(input.academicYear));
  const registrationId = escapeHtml(input.registrationId);
  const eventDate = escapeHtml(config.eventDate);
  const eventVenue = escapeHtml(config.eventVenue);
  const sig = {
    name: escapeHtml(EMAIL_SIGNATURE.name),
    title: escapeHtml(EMAIL_SIGNATURE.title),
    organization: escapeHtml(EMAIL_SIGNATURE.organization),
    team: escapeHtml(EMAIL_SIGNATURE.team),
  };

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  // Branded header logo (only when a public https site URL is configured)
  const logoUrl = isSafeHttpUrl(config.appUrl)
    ? `${stripTrailingSlash(config.appUrl)}/esme_logo.png`
    : null;
  const logoHtml = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="ESME CU" width="64" height="64" style="width: 64px; height: 64px; display: block; margin: 0 auto 10px auto; border: 0; border-radius: 12px;" />`
    : "";

  // Social links in the footer (only the ones configured)
  const social = config.social ?? {};
  const socialEntries: { label: string; url: string; color: string }[] = [];
  if (isSafeHttpUrl(social.facebook)) socialEntries.push({ label: "Facebook", url: social.facebook, color: "#1877F2" });
  if (isSafeHttpUrl(social.instagram)) socialEntries.push({ label: "Instagram", url: social.instagram, color: "#E1306C" });
  if (isSafeHttpUrl(social.linkedin)) socialEntries.push({ label: "LinkedIn", url: social.linkedin, color: "#0A66C2" });
  if (isSafeHttpUrl(social.whatsapp)) socialEntries.push({ label: "WhatsApp", url: social.whatsapp, color: "#25D366" });

  const socialHtml = socialEntries.length
    ? `<p style="margin: 0 0 10px 0;">${socialEntries
        .map(
          (s) =>
            `<a href="${escapeHtml(s.url)}" style="color: ${s.color}; text-decoration: none; font-weight: bold; font-size: 12px; margin: 0 8px;">${s.label}</a>`
        )
        .join(`<span style="color: #334155;">|</span>`)}</p>`
    : "";

  const passRow = (label: string, value: string, highlight = false) =>
    `<tr><td width="38%" style="color: #94A3B8; padding: 6px 0;">${label}</td><td style="color: ${highlight ? "#F59E0B" : "#FFFFFF"}; font-weight: bold; padding: 6px 0;">${value}</td></tr>`;

  const paragraph = (content: string) =>
    `<p style="color: #CBD5E1; font-size: 14.5px; line-height: 1.7; margin: 0 0 14px 0;">${content}</p>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>ESME METRIX 2026 — Registration Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0B1928; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0B1928; padding: 25px 10px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0F243A; border: 2px solid #D97706; border-radius: 18px; overflow: hidden;">

              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #15304B; padding: 26px 20px 18px 20px; border-bottom: 1px solid rgba(217, 119, 6, 0.3);">
                  ${logoHtml}
                  <h1 style="color: #FFFFFF; font-size: 28px; margin: 0; font-weight: 900; letter-spacing: 1px;">
                    ESME <span style="color: #D97706;">METRIX</span> 2026
                  </h1>
                  <p style="color: #94A3B8; font-size: 12px; margin: 6px 0 0 0; letter-spacing: 1.5px; text-transform: uppercase;">
                    ESME CU · Materials Engineering Event
                  </p>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 28px 30px 6px 30px;">
                  <p style="color: #FFFFFF; font-size: 16px; font-weight: bold; margin: 0 0 16px 0;">Dear ${name},</p>
                  ${paragraph(`Thank you for registering to attend <strong style="color: #FFFFFF;">ESME METRIX</strong>, a Materials Engineering event organized by ESME CU, taking place on <strong style="color: #FFFFFF;">${eventDate} at ${eventVenue}</strong>.`)}
                  <p style="color: #10B981; font-size: 15px; font-weight: bold; line-height: 1.6; margin: 0 0 14px 0;">&#10003; Your registration has been successfully confirmed!</p>
                  ${paragraph("We're excited to welcome you to an engaging experience exploring the fascinating world of Materials Engineering, advanced materials, and engineering innovations.")}
                  ${paragraph("Join fellow engineering students and enthusiasts to discover new ideas, expand your knowledge, and explore the technologies shaping the future of materials science.")}
                </td>
              </tr>

              <!-- Visitor pass -->
              <tr>
                <td style="padding: 6px 30px 24px 30px;">
                  <div style="background-color: #11253B; border: 1px solid rgba(217, 119, 6, 0.35); border-radius: 14px; padding: 20px;">
                    <div style="font-size: 13px; font-weight: 900; color: #F59E0B; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
                      Your Visitor Pass
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                      ${passRow("Name:", name)}
                      ${passRow("Academic Status:", academicStatus)}
                      ${passRow("University:", university)}
                      ${passRow("Department:", department)}
                      ${passRow("Event:", "ESME METRIX 2026")}
                      ${passRow("Date:", eventDate)}
                      ${passRow("Registration ID:", `<span style="font-family: monospace;">${registrationId}</span>`, true)}
                    </table>
                    <div style="text-align: center; margin-top: 18px;">
                      <div style="background-color: #FFFFFF; padding: 12px; border-radius: 12px; display: inline-block;">
                        <img src="cid:${QR_CONTENT_ID}" alt="ESME METRIX QR code" width="200" height="200" style="width: 200px; height: 200px; display: block; border: 0;" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Closing + signature -->
              <tr>
                <td style="padding: 0 30px 28px 30px;">
                  ${paragraph("Your personalized QR code is attached to this email. Please keep it accessible and present it at the event entrance for verification and check-in.")}
                  ${paragraph("We look forward to seeing you at ESME METRIX!")}
                  <p style="color: #CBD5E1; font-size: 14.5px; line-height: 1.6; margin: 18px 0 0 0;">
                    Best Regards,<br>
                    <strong style="color: #FFFFFF;">${sig.name}</strong><br>
                    ${sig.title}<br>
                    ${sig.organization}<br>
                    <span style="color: #F59E0B;">${sig.team}</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #0A1929; padding: 18px 20px; border-top: 1px solid rgba(217, 119, 6, 0.2); color: #64748B; font-size: 11px;">
                  ${socialHtml}
                  <p style="margin: 0 0 6px 0; color: #D97706; font-weight: bold; letter-spacing: 2px;">BE POSITIVE VALUABLE</p>
                  <p style="margin: 0;">&copy; 2026 ESME Cairo University Student Chapter</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = [
    `Dear ${input.fullName},`,
    "",
    `Thank you for registering to attend ESME METRIX, a Materials Engineering event organized by ESME CU, taking place on ${config.eventDate} at ${config.eventVenue}.`,
    "",
    "Your registration has been successfully confirmed!",
    "",
    "We're excited to welcome you to an engaging experience exploring the fascinating world of Materials Engineering, advanced materials, and engineering innovations.",
    "",
    "Join fellow engineering students and enthusiasts to discover new ideas, expand your knowledge, and explore the technologies shaping the future of materials science.",
    "",
    "YOUR VISITOR PASS",
    `Name: ${input.fullName}`,
    `Academic Status: ${academicStatusLabel(input.academicYear)}`,
    `University: ${input.university}`,
    `Department: ${input.faculty || "Engineering"}`,
    "Event: ESME METRIX 2026",
    `Date: ${config.eventDate}`,
    `Registration ID: ${input.registrationId}`,
    "",
    `Your personalized QR code is attached to this email (ESME-METRIX-QR-${input.registrationId}.png). Please keep it accessible and present it at the event entrance for verification and check-in.`,
    "",
    "We look forward to seeing you at ESME METRIX!",
    "",
    "Best Regards,",
    EMAIL_SIGNATURE.name,
    EMAIL_SIGNATURE.title,
    EMAIL_SIGNATURE.organization,
    EMAIL_SIGNATURE.team,
    "",
    "BE POSITIVE VALUABLE.",
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
