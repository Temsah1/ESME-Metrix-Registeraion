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
  const from = process.env.RESEND_FROM_EMAIL || "ESME Metrix <onboarding@resend.dev>";
  const eventDate = process.env.EVENT_DATE || "12 December 2026";
  const eventVenue = process.env.EVENT_VENUE || "Cairo University";
  const eventTime = process.env.EVENT_TIME || "Saturday 12 / 12 / 2026";

  const name = escapeHtml(input.fullName);
  const university = escapeHtml(input.university);
  const registrationId = escapeHtml(input.registrationId);

  const qrBase64 = input.qrDataUrl.includes(",")
    ? input.qrDataUrl.split(",")[1]
    : input.qrDataUrl;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #15304B; color: #F8FAFC; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #D97706;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #D97706; font-size: 26px; margin: 0; font-weight: bold;">ESME METRIX 2026</h1>
        <p style="color: #CBD5E1; font-size: 13px; margin-top: 4px;">ESME METRIX — ESME Cairo University Student Chapter</p>
      </div>

      <div style="background-color: #10B981; color: #FFFFFF; font-weight: bold; font-size: 13px; padding: 6px 14px; border-radius: 20px; display: inline-block; margin-bottom: 12px;">
        &#10003; REGISTRATION CONFIRMED
      </div>

      <h2 style="color: #FFFFFF; font-size: 20px; margin-top: 8px;">Congratulations, ${name}!</h2>
      <p style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
        Your registration for ESME Metrix 2026 has been successfully confirmed.
      </p>

      <div style="background-color: #0F243A; padding: 20px; border-radius: 10px; margin: 24px 0; text-align: center; border: 1px solid rgba(217, 119, 6, 0.3);">
        <div style="font-size: 12px; color: #CBD5E1; letter-spacing: 1px; margin-bottom: 10px; font-weight: bold;">YOUR DIGITAL ADMISSION BADGE</div>
        <img src="cid:metrix-qr" alt="ESME Metrix QR Code" width="220" height="220" style="width: 220px; height: 220px; border-radius: 8px; margin: 0 auto; display: block; border: 2px solid #D97706;" />
        <p style="font-family: monospace; font-size: 16px; font-weight: bold; color: #F59E0B; margin-top: 12px; letter-spacing: 1px;">ID: ${registrationId}</p>
      </div>

      <div style="color: #E5E7EB; font-size: 14px; margin-bottom: 24px; line-height: 1.8;">
        <strong>Attendee:</strong> ${name}<br />
        <strong>Institution:</strong> ${university}<br />
        <strong>Event:</strong> ESME Metrix 2026 — Materials Engineering Event<br />
        <strong>Date:</strong> ${escapeHtml(eventDate)}<br />
        <strong>Venue:</strong> ${escapeHtml(eventVenue)}<br />
        <strong>Time:</strong> ${escapeHtml(eventTime)}
      </div>

      <p style="color: #CBD5E1; font-size: 13px; border-top: 1px solid rgba(217, 119, 6, 0.2); padding-top: 16px; text-align: center;">
        Please keep this QR code ready on your mobile device during entrance verification.<br />
        <span style="color: #D97706; font-weight: bold; letter-spacing: 1px;">BE POSITIVE VALUABLE.</span><br />
        <span style="color: #94A3B8; font-size: 11px;">ESME METRIX — ESME Cairo University Student Chapter</span>
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
    "ESME METRIX — ESME Cairo University Student Chapter",
  ].join("\n");

  return {
    from,
    subject: "You're registered — ESME METRIX 2026",
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

export async function sendConfirmationEmail(to: string, emailContent: ConfirmationEmail): Promise<void> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // 1. Primary: Try nodemailer Gmail SMTP if configured
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const attachments = emailContent.attachments.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.content, "base64"),
        cid: a.contentId,
        contentType: a.contentType,
      }));

      await transporter.sendMail({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments,
      });

      console.log(`Confirmation email sent via Gmail SMTP to ${to}`);
      return;
    } catch (smtpErr) {
      console.error("Gmail SMTP dispatch failed, attempting Resend fallback:", smtpErr);
    }
  }

  // 2. Secondary fallback: Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      const { error: sendError } = await resend.emails.send({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: emailContent.attachments,
      });

      if (sendError) {
        console.error("Confirmation email rejected by Resend:", sendError);
      } else {
        console.log(`Confirmation email sent via Resend to ${to}`);
      }
      return;
    } catch (resendErr) {
      console.error("Resend dispatch failed:", resendErr);
      return;
    }
  }

  console.warn("Neither SMTP_USER/SMTP_PASS nor RESEND_API_KEY configured; confirmation email skipped.");
}
