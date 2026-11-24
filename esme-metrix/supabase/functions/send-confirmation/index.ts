// ═══════════════════════════════════════════════════════════════════
// Supabase Edge Function: send-confirmation
// Sends the ESME Metrix 2026 confirmation email (with inline QR) via Resend.
// ═══════════════════════════════════════════════════════════════════
// Called by /api/register right after the registrant row is inserted:
//
//   POST {SUPABASE_URL}/functions/v1/send-confirmation
//   Header: x-esme-email-secret: <EMAIL_FUNCTION_SECRET>
//   Body:   { "registration_id": "MX8-XXXXXX" }
//
// Security model:
//   • Only callers that know EMAIL_FUNCTION_SECRET can trigger it.
//   • It never accepts an address or message body from the caller. It loads
//     the registrant from the database and emails ONLY that registrant's
//     stored address, so even a leaked secret cannot send arbitrary mail.
//   • A Resend idempotency key per registration prevents duplicate emails.
//
// Deploy (JWT check is replaced by the shared secret):
//   supabase functions deploy send-confirmation --no-verify-jwt
//
// Secrets (Supabase Dashboard → Edge Functions → Secrets, or `supabase secrets set`):
//   RESEND_API_KEY, RESEND_FROM_EMAIL, EMAIL_FUNCTION_SECRET
//   optional: APP_URL, EVENT_DATE, EVENT_VENUE, EVENT_TIME,
//             ESME_WHATSAPP_URL, ESME_FACEBOOK_URL, ESME_INSTAGRAM_URL, ESME_LINKEDIN_URL
// SUPABASE_URL and SUPABASE_SECRET_KEYS (or legacy SUPABASE_SERVICE_ROLE_KEY)
// are injected automatically.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from "jsr:@supabase/supabase-js@2";
import {
  buildConfirmationEmailContent,
  confirmationIdempotencyKey,
  DEFAULT_EMAIL_CONFIG,
  sendWithResend,
  type ConfirmationEmailConfig,
} from "../_shared/confirmation-template.ts";

// Same format as src/lib/registration-id.ts
const REGISTRATION_ID_REGEX = /^MX8-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function env(name: string): string | undefined {
  const value = Deno.env.get(name);
  return value && value.trim() ? value.trim() : undefined;
}

/** Constant-time comparison so the secret can't be guessed via response timing. */
function secretsMatch(provided: string, expected: string): boolean {
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

/**
 * Server key for database access. Newer projects expose SUPABASE_SECRET_KEYS
 * (JSON dictionary, e.g. {"default":"sb_secret_..."}); older ones only the
 * deprecated SUPABASE_SERVICE_ROLE_KEY. Supports both.
 */
function serverKey(): string | undefined {
  const secretKeys = env("SUPABASE_SECRET_KEYS");
  if (secretKeys) {
    try {
      const parsed = JSON.parse(secretKeys) as Record<string, string>;
      const key = parsed.default ?? Object.values(parsed)[0];
      if (key) return key;
    } catch {
      console.error("SUPABASE_SECRET_KEYS is not valid JSON; falling back to SUPABASE_SERVICE_ROLE_KEY.");
    }
  }
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

function loadConfig(): ConfirmationEmailConfig {
  return {
    from: env("RESEND_FROM_EMAIL") ?? DEFAULT_EMAIL_CONFIG.from,
    eventDate: env("EVENT_DATE") ?? DEFAULT_EMAIL_CONFIG.eventDate,
    eventVenue: env("EVENT_VENUE") ?? DEFAULT_EMAIL_CONFIG.eventVenue,
    eventTime: env("EVENT_TIME") ?? DEFAULT_EMAIL_CONFIG.eventTime,
    appUrl: env("APP_URL"),
    social: {
      whatsapp: env("ESME_WHATSAPP_URL") ?? DEFAULT_EMAIL_CONFIG.social?.whatsapp,
      facebook: env("ESME_FACEBOOK_URL"),
      instagram: env("ESME_INSTAGRAM_URL"),
      linkedin: env("ESME_LINKEDIN_URL"),
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const expectedSecret = env("EMAIL_FUNCTION_SECRET");
  const resendApiKey = env("RESEND_API_KEY");
  const supabaseUrl = env("SUPABASE_URL");
  const serviceRoleKey = serverKey();

  if (!expectedSecret || !resendApiKey || !supabaseUrl || !serviceRoleKey) {
    console.error("send-confirmation is missing required secrets.");
    return json(500, { error: "Email function is not configured" });
  }

  const providedSecret = req.headers.get("x-esme-email-secret") ?? "";
  if (!secretsMatch(providedSecret, expectedSecret)) {
    return json(401, { error: "Unauthorized" });
  }

  let registrationId: unknown;
  try {
    ({ registration_id: registrationId } = await req.json());
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  if (typeof registrationId !== "string" || !REGISTRATION_ID_REGEX.test(registrationId)) {
    return json(400, { error: "Valid registration_id is required" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: registrant, error: dbError } = await supabase
    .from("registrants")
    .select(
      "full_name, email, university, faculty, academic_year, graduation_year, national_id, registration_id, qr_code"
    )
    .eq("registration_id", registrationId)
    .maybeSingle();

  if (dbError) {
    console.error("send-confirmation: registrant lookup failed", dbError);
    return json(500, { error: "Registrant lookup failed" });
  }
  if (!registrant) {
    return json(404, { error: "Registration not found" });
  }

  const email = buildConfirmationEmailContent(
    {
      fullName: registrant.full_name,
      registrationId: registrant.registration_id,
      university: registrant.university,
      faculty: registrant.faculty,
      academicYear: registrant.academic_year,
      graduationYear: registrant.graduation_year,
      nationalId: registrant.national_id,
      qrDataUrl: registrant.qr_code,
    },
    loadConfig()
  );

  const result = await sendWithResend(
    resendApiKey,
    registrant.email,
    email,
    confirmationIdempotencyKey(registrant.registration_id)
  );

  if (!result.ok) {
    console.error(`send-confirmation: Resend rejected ${registrationId}`, result.status, result.error);
    return json(502, { error: "Email provider rejected the message", provider_status: result.status });
  }

  console.log(`send-confirmation: sent ${registrationId} (resend id ${result.id})`);
  return json(200, { success: true, resend_id: result.id });
});
