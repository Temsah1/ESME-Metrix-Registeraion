import { describe, it, expect } from "vitest";
import { generateRegistrationId, REGISTRATION_ID_REGEX } from "@/lib/registration-id";

describe("QR-04 registration ID format", () => {
  it("matches MX8-XXXXXX with unambiguous charset", () => {
    for (let i = 0; i < 200; i++) {
      const id = generateRegistrationId();
      expect(id).toMatch(REGISTRATION_ID_REGEX);
      expect(id.length).toBe(10);
      expect(id.slice(0, 4)).toBe("MX8-");
    }
  });

  it("excludes ambiguous characters 0 O 1 I l", () => {
    for (let i = 0; i < 500; i++) {
      const suffix = generateRegistrationId().slice(4);
      expect(suffix).not.toMatch(/[0O1Il]/);
    }
  });

  it("generates distinct IDs (no trivial collisions)", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateRegistrationId()));
    expect(ids.size).toBeGreaterThan(990);
  });
});