import { describe, it, expect } from "vitest";
import { buildAgendaBlocks } from "@/components/DualHallAgenda";
import { DEFAULT_AGENDA_CMS } from "@/lib/cms/defaults";
import {
  parseLegacyFacultyFallback,
  parseMemberLoginIdentifier,
} from "@/lib/registrants/public-pass";

describe("Wireframe Agenda Block Layout", () => {
  it("groups shared Opening top block, parallel Hall 1 & Hall 2 middle block, and shared bottom blocks", () => {
    const blocks = buildAgendaBlocks(DEFAULT_AGENDA_CMS.sessions);
    expect(blocks[0]?.type).toBe("shared");
    if (blocks[0]?.type === "shared") {
      expect(blocks[0].session.title).toBe("Opening");
    }

    expect(blocks[1]?.type).toBe("parallel");
    if (blocks[1]?.type === "parallel") {
      expect(blocks[1].hall1.length).toBeGreaterThan(2);
      expect(blocks[1].hall2.length).toBeGreaterThan(2);
    }

    const tail = blocks.slice(2);
    expect(tail.every((b) => b.type === "shared")).toBe(true);
    const tailTitles = tail.map((b) => (b.type === "shared" ? b.session.title : ""));
    expect(tailTitles).toContain("Giveaways / Awards Distribution");
    expect(tailTitles).toContain("Closing");
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
