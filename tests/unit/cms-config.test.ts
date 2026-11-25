import { describe, it, expect } from "vitest";
import { DEFAULT_FULL_CMS } from "@/lib/cms/defaults";
import {
  CMS_KEYS,
  buildFullCmsData,
  serializeFullCmsToSiteContentRows,
} from "@/lib/cms/parse";

describe("Comprehensive CMS defaults, parsing & serialization", () => {
  it("provides 8 local event gallery photos, wireframe shared+dual-hall agenda, and preserves landing Arabic accents", () => {
    const cms = buildFullCmsData({});
    expect(cms.gallery).toHaveLength(8);
    expect(cms.gallery.every((g) => g.url.startsWith("/images/gallery/event-"))).toBe(true);

    const shared = cms.agenda.sessions.filter((s) => s.hallType === "shared");
    const hall1 = cms.agenda.sessions.filter((s) => s.hallType === "hall1");
    const hall2 = cms.agenda.sessions.filter((s) => s.hallType === "hall2");
    expect(shared.length).toBeGreaterThan(2); // Opening, Giveaways, Closing
    expect(hall1.length).toBeGreaterThan(2);
    expect(hall2.length).toBeGreaterThan(2);
    expect(cms.agenda.hall1Capacity).toContain("250");
    expect(cms.agenda.hall2Capacity).toContain("150");

    // Landing preserves original Arabic accents while keeping registration form English
    expect(cms.landing.certificateBadge).toBe("معتمد");
    expect(cms.landing.subtitle).toMatch(/[\u0600-\u06FF]/);
    expect(cms.agenda.subtitle).toMatch(/[\u0600-\u06FF]/);
    expect(JSON.stringify(cms.form)).not.toMatch(/[\u0600-\u06FF]/);

    expect(cms.footer.portalUrl).toBe(
      "https://eslamemadportfolio22.my.canva.site/esmecairo"
    );
    expect(cms.eventMapsUrl).toBe("https://maps.app.goo.gl/rZuGj1EEioQNB8K5A?g_st=ic");
  });

  it("upgrades legacy split hall1Sessions/hall2Sessions payloads seamlessly", () => {
    const legacyAgenda = JSON.stringify({
      title: "Custom Agenda",
      hall1Sessions: [
        { id: "a", time: "10:00", title: "Legacy H1 Talk", speaker: "Dr. A", role: "", tag: "Keynote", description: "" },
      ],
      hall2Sessions: [
        { id: "b", time: "10:00", title: "Legacy H2 Workshop", speaker: "Eng. B", role: "", tag: "Workshop", description: "" },
      ],
    });
    const cms = buildFullCmsData({ [CMS_KEYS.agenda]: legacyAgenda });
    expect(cms.agenda.sessions.some((s) => s.hallType === "shared")).toBe(true);
    expect(cms.agenda.sessions.some((s) => s.hallType === "hall1" && s.title === "Legacy H1 Talk")).toBe(true);
    expect(cms.agenda.sessions.some((s) => s.hallType === "hall2" && s.title === "Legacy H2 Workshop")).toBe(true);
  });

  it("keeps post-registration WhatsApp separate from footer links", () => {
    const cms = buildFullCmsData({
      [CMS_KEYS.postRegistrationWhatsappUrl]: "https://chat.whatsapp.com/PrivateAttendeeLink",
    });
    expect(cms.confirmation.postRegistrationWhatsappUrl).toBe(
      "https://chat.whatsapp.com/PrivateAttendeeLink"
    );
    const footerUrls = cms.footer.socialLinks.map((s) => s.url).join(" ");
    expect(footerUrls).not.toContain("whatsapp");
    expect(cms.footer.portalUrl).not.toContain("whatsapp");
  });

  it("round-trips serialized CMS rows cleanly via site_content map", () => {
    const modified = {
      ...DEFAULT_FULL_CMS,
      landing: {
        ...DEFAULT_FULL_CMS.landing,
        titleHighlight: "ESME METRIX TEST EDITION",
      },
      form: {
        ...DEFAULT_FULL_CMS.form,
        esmeCommittees: ["IT", "PR"],
      },
    };
    const rows = serializeFullCmsToSiteContentRows(modified);
    const rawMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const parsed = buildFullCmsData(rawMap);

    expect(parsed.landing.titleHighlight).toBe("ESME METRIX TEST EDITION");
    expect(parsed.form.esmeCommittees).toEqual(["IT", "PR"]);
    expect(parsed.gallery).toHaveLength(8);
  });

  it("auto-upgrades legacy linkedin_caption and company URL to official student chapter URL", () => {
    const legacyCaption =
      "I'm attending *ESME METRIX*!\n\nRegister now: https://esme-metrix-registeration.vercel.app/\n\n#ESMEMetrix";
    const cms = buildFullCmsData({ linkedin_caption: legacyCaption });
    expect(cms.confirmation.linkedinCaption).toContain(
      "Follow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/"
    );
    const linkedInSoc = cms.footer.socialLinks.find((s) => s.platform === "linkedin");
    expect(linkedInSoc?.url).toBe(
      "https://www.linkedin.com/company/esme-cairo-university-student-chapter/"
    );
  });
});
