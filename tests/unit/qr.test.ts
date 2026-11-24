import { describe, it, expect, beforeAll, afterAll } from "vitest";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import { signQrPayload, verifyQrPayload, EVENT_ID } from "@/lib/qr";

const TEST_SECRET = "test-secret-do-not-use-in-prod-0123456789";

beforeAll(() => {
  process.env.QR_SIGNING_SECRET = TEST_SECRET;
  delete process.env.QR_ALLOW_LEGACY;
});

afterAll(() => {
  delete process.env.QR_SIGNING_SECRET;
  delete process.env.QR_ALLOW_LEGACY;
});

async function decodeQr(payload: string): Promise<string | null> {
  const buffer = await QRCode.toBuffer(payload, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  const png = PNG.sync.read(buffer);
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return result ? result.data : null;
}

describe("QR-02/03 generation + independent decode round-trip", () => {
  it("QR image decodes back to the exact signed payload", async () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const serialized = JSON.stringify(payload);
    const decoded = await decodeQr(serialized);
    expect(decoded).toBe(serialized);
    const parsed = JSON.parse(decoded!);
    expect(parsed.id).toBe("MX8-ABC234");
    expect(parsed.registrant_id).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(parsed.event).toBe(EVENT_ID);
    expect(typeof parsed.hash).toBe("string");
  });

  it("payload contains all four required fields", () => {
    const payload = signQrPayload("MX8-XYZ789", "11111111-2222-3333-4444-555555555555");
    expect(Object.keys(payload).sort()).toEqual(["event", "hash", "id", "registrant_id"]);
  });
});

describe("QRS-01 valid signature accepted", () => {
  it("accepts a freshly signed payload", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const result = verifyQrPayload(JSON.stringify(payload));
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.legacy).toBe(false);
  });

  it("accepts an object payload as well as a string", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    expect(verifyQrPayload(payload).valid).toBe(true);
  });
});

describe("QRS-02/09 tampering and forgery rejected", () => {
  it("rejects a payload whose id was modified", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const tampered = { ...payload, id: "MX8-EVIL99" };
    const result = verifyQrPayload(JSON.stringify(tampered));
    expect(result.valid).toBe(false);
  });

  it("rejects a payload whose registrant_id was modified", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const tampered = { ...payload, registrant_id: "99999999-9999-9999-9999-999999999999" };
    expect(verifyQrPayload(JSON.stringify(tampered)).valid).toBe(false);
  });

  it("rejects a forged hash computed without the secret", () => {
    const forged = {
      id: "MX8-FORGED",
      registrant_id: "550e8400-e29b-41d4-a716-446655440000",
      event: EVENT_ID,
      hash: "deadbeef".repeat(8),
    };
    expect(verifyQrPayload(JSON.stringify(forged)).valid).toBe(false);
  });
});

describe("QRS-03/04/05/06 malformed and incomplete payloads", () => {
  it("rejects missing hash", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const { hash: _h, ...rest } = payload;
    expect(verifyQrPayload(JSON.stringify(rest)).valid).toBe(false);
  });

  it("rejects a wrong event identifier", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    const other = { ...payload, event: "SOME_OTHER_EVENT" };
    const result = verifyQrPayload(JSON.stringify(other));
    expect(result.valid).toBe(false);
  });

  it("rejects malformed JSON", () => {
    expect(verifyQrPayload("{not json").valid).toBe(false);
  });

  it("rejects non-object payloads", () => {
    expect(verifyQrPayload("42").valid).toBe(false);
    expect(verifyQrPayload("[1,2,3]").valid).toBe(false);
    expect(verifyQrPayload(null).valid).toBe(false);
  });

  it("rejects empty required fields", () => {
    const payload = signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000");
    expect(verifyQrPayload(JSON.stringify({ ...payload, id: "" })).valid).toBe(false);
  });
});

describe("QRS-08 legacy unkeyed SHA-256 rejected by default", () => {
  it("rejects a legacy-format hash when QR_ALLOW_LEGACY is unset", async () => {
    const crypto = await import("crypto");
    const id = "MX8-LEGACY";
    const uid = "550e8400-e29b-41d4-a716-446655440000";
    const legacyHash = crypto.createHash("sha256").update(`${id}:${uid}:${EVENT_ID}`).digest("hex");
    const result = verifyQrPayload(JSON.stringify({ id, registrant_id: uid, event: EVENT_ID, hash: legacyHash }));
    expect(result.valid).toBe(false);
  });

  it("accepts legacy hash only when explicitly enabled, flagged as legacy", async () => {
    process.env.QR_ALLOW_LEGACY = "true";
    const crypto = await import("crypto");
    const id = "MX8-LEGACY";
    const uid = "550e8400-e29b-41d4-a716-446655440000";
    const legacyHash = crypto.createHash("sha256").update(`${id}:${uid}:${EVENT_ID}`).digest("hex");
    const result = verifyQrPayload(JSON.stringify({ id, registrant_id: uid, event: EVENT_ID, hash: legacyHash }));
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.legacy).toBe(true);
    delete process.env.QR_ALLOW_LEGACY;
  });
});

describe("QRS-07 signing secret stays server-side", () => {
  it("signQrPayload throws when no secret is configured", () => {
    const saved = process.env.QR_SIGNING_SECRET;
    delete process.env.QR_SIGNING_SECRET;
    expect(() => signQrPayload("MX8-ABC234", "550e8400-e29b-41d4-a716-446655440000")).toThrow();
    process.env.QR_SIGNING_SECRET = saved;
  });
});