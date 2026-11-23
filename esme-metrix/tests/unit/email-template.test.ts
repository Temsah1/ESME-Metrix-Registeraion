import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildConfirmationEmail } from "@/lib/email/confirmation";

const input = {
  fullName: "Omar Hassan",
  registrationId: "MX8-ABC234",
  university: "Cairo University",
  qrDataUrl: "data:image/png;base64,QUJDREVGRw==",
};

describe("QR-07/08 email template uses CID attachment, not data URI", () => {
  it("references cid:metrix-qr and never embeds a data URI img", () => {
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain('src="cid:metrix-qr"');
    expect(email.html).not.toContain("data:image");
  });

  it("attaches the QR base64 with matching contentId", () => {
    const email = buildConfirmationEmail(input);
    expect(email.attachments).toHaveLength(1);
    expect(email.attachments[0].contentId).toBe("metrix-qr");
    expect(email.attachments[0].content).toBe("QUJDREVGRw==");
    expect(email.attachments[0].contentType).toBe("image/png");
  });

  it("includes attendee name, university and registration ID", () => {
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("Omar Hassan");
    expect(email.html).toContain("Cairo University");
    expect(email.html).toContain("MX8-ABC234");
    expect(email.text).toContain("MX8-ABC234");
  });

  it("provides a plain-text fallback", () => {
    const email = buildConfirmationEmail(input);
    expect(email.text.length).toBeGreaterThan(50);
    expect(email.text).toContain("BE POSITIVE VALUABLE");
  });
});

describe("email HTML escaping (XSS / injection safety)", () => {
  it("escapes HTML in the attendee name", () => {
    const email = buildConfirmationEmail({
      ...input,
      fullName: '<script>alert("x")</script>',
    });
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
  });
});

describe("event details come from configuration, not invented values", () => {
  beforeEach(() => {
    process.env.EVENT_DATE = "2026-12-01";
    process.env.EVENT_VENUE = "Cairo University Main Hall";
    process.env.EVENT_TIME = "10:00 AM";
  });
  afterEach(() => {
    delete process.env.EVENT_DATE;
    delete process.env.EVENT_VENUE;
    delete process.env.EVENT_TIME;
  });

  it("uses configured event values when present", () => {
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("2026-12-01");
    expect(email.html).toContain("Cairo University Main Hall");
    expect(email.html).toContain("10:00 AM");
  });

  it("falls back to 'To be announced' rather than inventing a venue", () => {
    delete process.env.EVENT_VENUE;
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("To be announced");
  });
});