import { describe, it, expect } from "vitest";
import { buildAgendaBlocks } from "@/components/DualHallAgenda";
import { DEFAULT_AGENDA_CMS } from "@/lib/cms/defaults";
import { parsePassLookupQuery } from "@/lib/registrants/public-pass";

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

describe("Member Dashboard Lookup Classification", () => {
  it("recognizes valid Egyptian phone numbers", () => {
    expect(parsePassLookupQuery(" 01012345678 ")).toEqual({
      kind: "phone",
      value: "01012345678",
    });
    expect(parsePassLookupQuery("01598765432")).toEqual({
      kind: "phone",
      value: "01598765432",
    });
  });

  it("recognizes Ticket IDs case-insensitively and normalizes uppercase", () => {
    expect(parsePassLookupQuery("mx8-ab23cd")).toEqual({
      kind: "id",
      value: "MX8-AB23CD",
    });
  });

  it("rejects malformed lookup tokens safely", () => {
    expect(parsePassLookupQuery("")).toEqual({ kind: "invalid" });
    expect(parsePassLookupQuery("02012345678")).toEqual({ kind: "invalid" });
    expect(parsePassLookupQuery("MX8-123")).toEqual({ kind: "invalid" });
    expect(parsePassLookupQuery("Omar Hassan")).toEqual({ kind: "invalid" });
  });
});
