import { describe, it, expect } from "vitest";
import {
  DEFAULT_OG_HIGHLIGHTS,
  LINKEDIN_POST_TEXT,
  OFFICIAL_ESME_LINKEDIN_URL,
  buildPersonalizedLinkedInPostText,
  parseOgHighlights,
} from "@/config/registration";
import {
  TEMPLATE_BASE_HEIGHT,
  TEMPLATE_BASE_WIDTH,
  TEMPLATE_SLOTS,
  computeNameFontSize,
  computeUniversityFontSize,
  formatEventDateLocationBar,
  formatRoleOrMajor,
  getInitials,
} from "@/lib/og/card-data";

describe("OG Card template slots, highlights & LinkedIn copy", () => {
  it("defines 16:9 master template coordinates", () => {
    expect(TEMPLATE_BASE_WIDTH).toBe(1024);
    expect(TEMPLATE_BASE_HEIGHT).toBe(576);
    expect(TEMPLATE_SLOTS.portrait.polygonPoints).toHaveLength(8);
    expect(TEMPLATE_SLOTS.nameMask.y).toBeLessThan(TEMPLATE_SLOTS.universityMask.y);
  });

  it("auto-scales long names and universities cleanly", () => {
    expect(computeNameFontSize("Omar Ali", 1)).toBeGreaterThan(
      computeNameFontSize("Abdelrahman Mohamed Ibrahim El-Sayed", 1)
    );
    expect(computeUniversityFontSize("Cairo University", 1)).toBeGreaterThan(
      computeUniversityFontSize("Arab Academy for Science, Technology & Maritime Transport", 1)
    );
  });

  it("parses custom CMS highlights and pads to 6 items", () => {
    const items = parseOgHighlights("600+ | GUESTS\n20+ | MENTORS");
    expect(items).toHaveLength(6);
    expect(items[0]).toEqual({ value: "600+", label: "GUESTS" });
    expect(items[1]).toEqual({ value: "20+", label: "MENTORS" });
    expect(items[2]).toEqual(DEFAULT_OG_HIGHLIGHTS[2]);
  });

  it("falls back to default 6 highlights when empty", () => {
    expect(parseOgHighlights("")).toEqual(DEFAULT_OG_HIGHLIGHTS);
  });

  it("formats Role / Major accurately for external and ESME members", () => {
    expect(
      formatRoleOrMajor({
        jobTitle: "Student",
        department: "Artificial Intelligence (AI)",
      })
    ).toBe("Student • Artificial Intelligence (AI)");

    expect(
      formatRoleOrMajor({
        jobTitle: "Student",
        department: "Computer Science (CS)",
        isEsmeMember: true,
        committee: "High Board",
      })
    ).toBe("ESME Member — High Board | Computer Science (CS)");
  });

  it("formats date & venue bar uppercase", () => {
    expect(formatEventDateLocationBar("12 December 2026", "Cairo University")).toBe(
      "12 DECEMBER 2026 | CAIRO UNIVERSITY"
    );
  });

  it("extracts initials safely", () => {
    expect(getInitials("Omar Hassan")).toBe("OH");
    expect(getInitials("")).toBe("EM");
  });

  it("keeps exact LinkedIn post copy, share URL, and tags", () => {
    const rendered = buildPersonalizedLinkedInPostText(LINKEDIN_POST_TEXT, "MX8-ABC123");
    expect(rendered).toContain("I'm attending ESME METRIX!");
    expect(rendered).not.toContain("*ESME METRIX*");
    expect(rendered).toContain(
      "Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials."
    );
    expect(rendered).toContain(
      "Discover, learn, and connect with fellow engineering students."
    );
    expect(rendered).toContain(
      "Register now: https://esme-metrix-registeration.vercel.app/share/MX8-ABC123"
    );
    expect(rendered).toContain(
      `Follow ESME Cairo University: ${OFFICIAL_ESME_LINKEDIN_URL}`
    );
    expect(rendered).toContain(
      "#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity"
    );
  });
});
