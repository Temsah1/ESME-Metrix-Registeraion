import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildConfirmationEmail, CONFIRMATION_SUBJECT, maskNationalId } from "@/lib/email/confirmation";

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

describe("prompt spec: subject, greeting, instructions, tagline", () => {
  it("uses the subject from the build prompt", () => {
    expect(buildConfirmationEmail(input).subject).toBe(CONFIRMATION_SUBJECT);
    expect(CONFIRMATION_SUBJECT).toBe("✅ You're registered — ESME Metrix 2026");
  });

  it("greets the attendee by name with 'Congratulations'", () => {
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("Congratulations, Omar Hassan!");
    expect(email.text).toContain("Congratulations, Omar Hassan!");
  });

  it("includes QR usage instructions and the tagline", () => {
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("How to use your QR on event day");
    expect(email.html).toContain("BE POSITIVE VALUABLE");
  });
});

describe("branding and social links come from configuration", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.ESME_INSTAGRAM_URL;
  });

  it("shows the logo only when NEXT_PUBLIC_APP_URL is an https URL", () => {
    expect(buildConfirmationEmail(input).html).not.toContain("esme_logo.png");
    process.env.NEXT_PUBLIC_APP_URL = "https://esme-metrix.example.com/";
    expect(buildConfirmationEmail(input).html).toContain('src="https://esme-metrix.example.com/esme_logo.png"');
  });

  it("renders configured social links and ignores unsafe ones", () => {
    process.env.ESME_INSTAGRAM_URL = "https://instagram.com/esme";
    expect(buildConfirmationEmail(input).html).toContain('href="https://instagram.com/esme"');
    process.env.ESME_INSTAGRAM_URL = "javascript:alert(1)";
    expect(buildConfirmationEmail(input).html).not.toContain("javascript:");
  });
});

describe("National ID is masked in the email", () => {
  it("shows only the last 4 digits", () => {
    const email = buildConfirmationEmail({ ...input, nationalId: "29912010101234" });
    expect(email.html).not.toContain("29912010101234");
    expect(email.text).not.toContain("29912010101234");
    expect(email.html).toContain("1234");
    expect(maskNationalId("29912010101234")).toBe("••••••••••1234");
    expect(maskNationalId(null)).toBe("N/A");
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

  it("falls back to 'Cairo University' when venue is not explicitly set", () => {
    delete process.env.EVENT_VENUE;
    const email = buildConfirmationEmail(input);
    expect(email.html).toContain("Cairo University");
  });
});