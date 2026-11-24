import crypto from "crypto";

export const EVENT_ID = "ESME_METRIX_2026";

export interface QrPayload {
  id: string;
  registrant_id: string;
  event: string;
  hash: string;
}

export type VerifyResult =
  | { valid: true; payload: QrPayload; legacy: boolean }
  | { valid: false; reason: string };

function signingSecret(): string {
  const secret = process.env.QR_SIGNING_SECRET;
  if (!secret) {
    throw new Error("QR_SIGNING_SECRET is not configured");
  }
  return secret;
}

function signatureFor(registrationId: string, registrantUuid: string, event: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`${registrationId}:${registrantUuid}:${event}`)
    .digest("hex");
}

export function signQrPayload(registrationId: string, registrantUuid: string): QrPayload {
  const secret = signingSecret();
  return {
    id: registrationId,
    registrant_id: registrantUuid,
    event: EVENT_ID,
    hash: signatureFor(registrationId, registrantUuid, EVENT_ID, secret),
  };
}

function legacyHashFor(registrationId: string, registrantUuid: string, event: string): string {
  return crypto
    .createHash("sha256")
    .update(`${registrationId}:${registrantUuid}:${event}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyQrPayload(raw: unknown): VerifyResult {
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { valid: false, reason: "Malformed QR content" };
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { valid: false, reason: "Invalid QR payload format" };
  }

  const { id, registrant_id, event, hash } = parsed as Record<string, unknown>;

  if (typeof id !== "string" || typeof registrant_id !== "string" || typeof hash !== "string" || !id || !registrant_id || !hash) {
    return { valid: false, reason: "Incomplete QR payload format" };
  }

  if (event !== EVENT_ID) {
    return { valid: false, reason: "QR code belongs to a different event" };
  }

  const secret = process.env.QR_SIGNING_SECRET;
  if (secret) {
    const expected = signatureFor(id, registrant_id, EVENT_ID, secret);
    if (safeEqual(hash, expected)) {
      return { valid: true, payload: { id, registrant_id, event: EVENT_ID, hash }, legacy: false };
    }
  }

  // Transition path for QR codes issued before HMAC signing existed.
  // Disabled unless explicitly enabled; requires an authenticated admin at the API layer.
  if (process.env.QR_ALLOW_LEGACY === "true" && event === EVENT_ID) {
    const legacyExpected = legacyHashFor(id, registrant_id, EVENT_ID);
    if (safeEqual(hash, legacyExpected)) {
      return { valid: true, payload: { id, registrant_id, event: EVENT_ID, hash }, legacy: true };
    }
  }

  return { valid: false, reason: "QR code signature mismatch" };
}