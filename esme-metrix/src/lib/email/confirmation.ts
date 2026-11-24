// Next.js side of the confirmation email.
//
// Delivery order (per the ESME Metrix build prompt):
//   1. Supabase Edge Function `send-confirmation` → Resend   (primary)
//   2. Resend called directly from this server                (fallback)
//   3. Gmail SMTP via nodemailer                              (last resort)
//
// The template itself lives in supabase/functions/_shared/confirmation-template.ts
// so the Edge Function and this fallback send exactly the same email.

import {
  buildConfirmationEmailContent,
  confirmationIdempotencyKey,
  DEFAULT_EMAIL_CONFIG,
  sendWithResend,
  type ConfirmationEmail,
  type ConfirmationEmailConfig,
  type ConfirmationEmailInput,
} from "../../../supabase/functions/_shared/confirmation-template";

export type { ConfirmationEmail, ConfirmationEmailInput } from "../../../supabase/functions/_shared/confirmation-template";
export { CONFIRMATION_SUBJECT, maskNationalId } from "../../../supabase/functions/_shared/confirmation-template";

const EDGE_FUNCTION_TIMEOUT_MS = 10_000;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

export function getEmailConfigFromEnv(): ConfirmationEmailConfig {
  return {
    from: env("RESEND_FROM_EMAIL") ?? DEFAULT_EMAIL_CONFIG.from,
    eventDate: env("EVENT_DATE") ?? DEFAULT_EMAIL_CONFIG.eventDate,
    eventVenue: env("EVENT_VENUE") ?? DEFAULT_EMAIL_CONFIG.eventVenue,
    eventTime: env("EVENT_TIME") ?? DEFAULT_EMAIL_CONFIG.eventTime,
    appUrl: env("NEXT_PUBLIC_APP_URL"),
    social: {
      whatsapp: env("ESME_WHATSAPP_URL") ?? DEFAULT_EMAIL_CONFIG.social?.whatsapp,
      facebook: env("ESME_FACEBOOK_URL"),
      instagram: env("ESME_INSTAGRAM_URL"),
      linkedin: env("ESME_LINKEDIN_URL"),
    },
  };
}

export function buildConfirmationEmail(input: ConfirmationEmailInput): ConfirmationEmail {
  return buildConfirmationEmailContent(input, getEmailConfigFromEnv());
}

export type EmailChannel = "edge-function" | "resend" | "smtp" | "none";

/** Asks the `send-confirmation` Edge Function to email this registrant. Returns true on success. */
async function sendViaEdgeFunction(registrationId: string): Promise<boolean> {
  const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
  const secret = env("EMAIL_FUNCTION_SECRET");
  if (!supabaseUrl || !secret || env("EMAIL_DELIVERY") === "direct") {
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/functions/v1/send-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-esme-email-secret": secret,
      },
      body: JSON.stringify({ registration_id: registrationId }),
      signal: AbortSignal.timeout(EDGE_FUNCTION_TIMEOUT_MS),
    });

    if (response.ok) {
      console.log(`Confirmation email for ${registrationId} sent via Edge Function`);
      return true;
    }

    const detail = await response.text().catch(() => "");
    console.error(`send-confirmation Edge Function returned ${response.status}: ${detail}`);
  } catch (err) {
    console.error("send-confirmation Edge Function call failed:", err);
  }
  return false;
}

/** Sends directly from this server: Resend first, then Gmail SMTP. */
export async function sendConfirmationEmail(
  to: string,
  emailContent: ConfirmationEmail,
  registrationId?: string
): Promise<EmailChannel> {
  const resendApiKey = env("RESEND_API_KEY");
  if (resendApiKey) {
    try {
      const result = await sendWithResend(
        resendApiKey,
        to,
        emailContent,
        registrationId ? confirmationIdempotencyKey(registrationId) : undefined
      );
      if (result.ok) {
        console.log(`Confirmation email sent via Resend (id ${result.id})`);
        return "resend";
      }
      console.error(`Resend rejected confirmation email (${result.status}): ${result.error}`);
    } catch (err) {
      console.error("Resend dispatch failed:", err);
    }
  }

  const smtpUser = env("SMTP_USER");
  const smtpPass = env("SMTP_PASS");
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: emailContent.from,
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: emailContent.attachments.map((a) => ({
          filename: a.filename,
          content: Buffer.from(a.content, "base64"),
          cid: a.contentId,
          contentType: a.contentType,
        })),
      });

      console.log("Confirmation email sent via Gmail SMTP");
      return "smtp";
    } catch (smtpErr) {
      console.error("Gmail SMTP dispatch failed:", smtpErr);
    }
  }

  console.warn("No email provider succeeded (RESEND_API_KEY / SMTP not configured or failing); confirmation email skipped.");
  return "none";
}

/**
 * Entry point used by /api/register (inside Next.js `after()`, so it never
 * delays the registration response). Tries the Edge Function first, then falls
 * back to sending from this server.
 */
export async function dispatchConfirmationEmail(
  to: string,
  registrationId: string,
  emailContent: ConfirmationEmail
): Promise<EmailChannel> {
  if (await sendViaEdgeFunction(registrationId)) {
    return "edge-function";
  }
  return sendConfirmationEmail(to, emailContent, registrationId);
}
