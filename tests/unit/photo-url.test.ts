import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAllowedPhotoUrl } from "@/lib/validations/photo-url";

const BASE = "https://test-project.supabase.co";

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = BASE;
});

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
});

describe("REG-07 server-side photo URL allowlist", () => {
  it("accepts a Supabase storage public photos URL", () => {
    expect(isAllowedPhotoUrl(`${BASE}/storage/v1/object/public/photos/uploads/123.jpg`)).toBe(true);
  });

  it("rejects base64 data URLs (silent fallback defect)", () => {
    expect(isAllowedPhotoUrl("data:image/png;base64,QUJD")).toBe(false);
  });

  it("rejects arbitrary external URLs", () => {
    expect(isAllowedPhotoUrl("https://evil.example.com/photo.jpg")).toBe(false);
  });

  it("rejects a different bucket", () => {
    expect(isAllowedPhotoUrl(`${BASE}/storage/v1/object/public/other/uploads/123.jpg`)).toBe(false);
  });

  it("rejects empty / non-string input", () => {
    expect(isAllowedPhotoUrl("")).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(isAllowedPhotoUrl(null)).toBe(false);
  });

  it("fails closed when Supabase URL is not configured", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(isAllowedPhotoUrl(`${BASE}/storage/v1/object/public/photos/a.jpg`)).toBe(false);
  });
});