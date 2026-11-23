export interface ConfirmationEmailInput {
  fullName: string;
  registrationId: string;
  university: string;
  qrDataUrl: string;
}

export interface ConfirmationEmail {
  from: string;
  subject: string;
  html: string;
  text: string;
  attachments: {
    filename: string;
    content: string;
    contentId: string;
    contentType: string;
  }[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildConfirmationEmail(input: ConfirmationEmailInput): ConfirmationEmail {
  const from = process.env.RESEND_FROM_EMAIL || "ESME Metrix <noreply@esme-cu.com>";
  const eventDate = process.env.EVENT_DATE || "To be announced";
  const eventVenue = process.env.EVENT_VENUE || "To be announced";
  const eventTime = process.env.EVENT_TIME || "To be announced";

  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university);
  const registrationId = escapeHtml(input.registrationId);

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0F14; color: #F8FAFC; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #00C9A7;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #00C9A7; font-size: 26px; margin: 0;">ESME METRIX 2026</h1>
        <p style="color: #94A3B8; font-size: 13px; margin-top: 4px;">Cairo University Student Chapter</p>
      </div>

      <h2 style="color: #FFFFFF; font-size: 20px;">Congratulations, ${name}!</h2>
      <p style="color: #CBD5E1; font-size: 15px; line-height: 1.6;">
        Your registration for ESME Metrix 2026 has been successfully confirmed.
      </p>

      <div style="background-color: #111820; padding: 20px; border-radius: 10px; margin: 24px 0; text-align: center; border: 1px solid rgba(0, 201, 167, 0.2);">
        <div style="font-size: 13px; color: #94A3B8; margin-bottom: 8px;">YOUR DIGITAL ADMISSION BADGE</div>
        <img src="cid:metrix-qr" alt="ESME Metrix QR Code" width="220" height="220" style="width: 220px; height: 220px; border-radius: 8px; margin: 0 auto; display: block;" />
        <p style="font-family: monospace; font-size: 16px; font-weight: bold; color: #00C9A7; margin-top: 12px;">ID: ${registrationId}</p>
      </div>

      <div style="color: #CBD5E1; font-size: 14px; margin-bottom: 24px; line-height: 1.8;">
        <strong>Attendee:</strong> ${name}<br />
        <strong>Institution:</strong> ${university}<br />
        <strong>Event:</strong> ESME Metrix 2026<br />
        <strong>Date:</strong> ${escapeHtml(eventDate)}<br />
        <strong>Venue:</strong> ${escapeHtml(eventVenue)}<br />
        <strong>Time:</strong> ${escapeHtml(eventTime)}
      </div>

      <p style="color: #94A3B8; font-size: 13px; border-top: 1px solid rgba(0, 201, 167, 0.2); padding-top: 16px; text-align: center;">
        Please keep this QR code ready on your mobile device during entrance verification.<br />
        <span style="color: #00C9A7; font-weight: bold;">BE POSITIVE VALUABLE.</span>
      </p>
    </div>
  `;

  const text = [
    `Congratulations, ${input.fullName}!`,
    "Your registration for ESME Metrix 2026 has been successfully confirmed.",
    "",
    `Registration ID: ${input.registrationId}`,
    `Attendee: ${input.fullName}`,
    `Institution: ${input.university}`,
    `Date: ${eventDate}`,
    `Venue: ${eventVenue}`,
    `Time: ${eventTime}`,
    "",
    "Your QR admission badge is attached to this email (metrix-qr.png).",
    "Keep it ready on your mobile device during entrance verification.",
    "",
    "BE POSITIVE VALUABLE.",
    "ESME Cairo University Student Chapter",
  ].join("\n");

  return {
    from,
    subject: "You're registered — ESME Metrix 2026",
    html,
    text,
    attachments: [
      {
        filename: "metrix-qr.png",
        content: qrBase64,
        contentId: "metrix-qr",
        contentType: "image/png",
      },
    ],
  };
}