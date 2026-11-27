import { describe, it, expect } from "vitest";
import { buildAgendaBlocks } from "@/components/DualHallAgenda";
import { DEFAULT_AGENDA_CMS } from "@/lib/cms/defaults";
import {
  parseLegacyFacultyFallback,
  parseMemberLoginIdentifier,
} from "@/lib/registrants/public-pass";

describe("Wireframe Agenda Block Layout", () => {
  it("keeps check-in, opening, parallel sessions, breaks, and plenaries in schedule order", () => {
    const blocks = buildAgendaBlocks(DEFAULT_AGENDA_CMS.sessions);
    expect(blocks[0]?.type).toBe("shared");
    if (blocks[0]?.type === "shared") {
      expect(blocks[0].session.title).toBe("Registration, Reception & Brunch");
    }

    expect(blocks[1]?.type).toBe("shared");
    if (blocks[1]?.type === "shared") {
      expect(blocks[1].session.title).toBe("Chapter Opening & Keynote");
    }

    expect(blocks[2]?.type).toBe("parallel");
    if (blocks[2]?.type === "parallel") {
      expect(blocks[2].hall1).toHaveLength(2);
      expect(blocks[2].hall2).toHaveLength(2);
      expect(blocks[2].hall1.map((session) => session.title)).toEqual([
        "AI Visual Inspection",
        "Robotics & Automation",
      ]);
      expect(blocks[2].hall2.map((session) => session.title)).toEqual([
        "Earthquake-Resistant Structures",
        "Water Treatment",
      ]);
    }

    const sharedTitles = blocks
      .filter((block) => block.type === "shared")
      .map((block) => (block.type === "shared" ? block.session.title : ""));
    expect(sharedTitles).toContain("Dhuhr Break • 35 min");
    expect(sharedTitles).toContain("HR Session — Interviews & CVs");
    expect(sharedTitles).toContain("Asr Break • 30 min");
    expect(sharedTitles).toContain("Sponsor Talks");
    expect(sharedTitles).toContain("Closing & Certificates");
    const reserveSession = DEFAULT_AGENDA_CMS.sessions.find(
      (session) => session.id === "h2-corrosion-protection"
    );
    expect(reserveSession?.description).toContain("Additive Manufacturing");
    expect(DEFAULT_AGENDA_CMS.sessions.every((session) => !session.speaker && !session.role)).toBe(true);
  });
});

describe("Member Portal Login Identifier Validation", () => {
  it("recognizes valid Egyptian phone numbers and email addresses", () => {
    expect(parseMemberLoginIdentifier(" 01012345678 ")).toEqual({
      kind: "phone",
      value: "01012345678",
    });
    expect(parseMemberLoginIdentifier("Omar.Ali@CU.edu.eg ")).toEqual({
      kind: "email",
      value: "omar.ali@cu.edu.eg",
    });
  });

  it("rejects empty or invalid identifiers safely", () => {
    expect(parseMemberLoginIdentifier("")).toEqual({ kind: "invalid" });
    expect(parseMemberLoginIdentifier("02012345678")).toEqual({ kind: "invalid" });
    expect(parseMemberLoginIdentifier("Omar Hassan")).toEqual({ kind: "invalid" });
  });

  it("extracts ESME High Board committee & role cleanly from legacy faculty strings", () => {
    expect(
      parseLegacyFacultyFallback("Engineering — Materials Engineering [ESME: High Board / Director]")
    ).toEqual({
      faculty: "Engineering",
      department: "Materials Engineering",
      is_esme_member: true,
      committee: "High Board",
      role: "Director",
    });
  });
});
