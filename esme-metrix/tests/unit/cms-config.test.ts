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

  it("auto-upgrades legacy linkedin_caption, old 3/4-item committees, strips roles, and upgrades company URL", () => {
    const legacyCaption =
      "I'm attending *ESME METRIX*!\n\nRegister now: https://esme-metrix-registeration.vercel.app/\n\n#ESMEMetrix";
    const expected8Committees = [
      "High Board",
      "Business & Finance Sector",
      "IT & Digital Transformation Sector",
      "Marketing & Media Sector",
      "Operations & Supply Chain Sector",
      "Quality Sector",
      "Technical & Engineering Sector",
      "SID Sector",
    ];

    const legacy3Form = JSON.stringify({
      esmeCommittees: ["IT", "Marketing", "Digital"],
      esmeRoles: ["High Board", "Head", "Member"],
      fields: { role: { label: "Role / Position", placeholder: "", required: true } },
    });
    const cms3 = buildFullCmsData({
      linkedin_caption: legacyCaption,
      [CMS_KEYS.form]: legacy3Form,
      [CMS_KEYS.arabic]: JSON.stringify({
        form: { fields: { role: { label: "المنصب", placeholder: "اختر المنصب..." } } },
      }),
    });
    expect(cms3.confirmation.linkedinCaption).toContain("/share/[ticketId]");
    expect(cms3.confirmation.linkedinCaption).toContain(
      "Follow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/"
    );
    expect(cms3.form.esmeCommittees).toEqual(expected8Committees);
    expect("esmeRoles" in cms3.form).toBe(false);
    expect("role" in cms3.form.fields).toBe(false);
    expect("role" in (cms3.ar?.form?.fields || {})).toBe(false);

    const legacy4Form = JSON.stringify({
      esmeCommittees: ["High Board", "IT", "Marketing", "Digital"],
      esmeRoles: ["Member", "Director", "Head"],
    });
    const cms4 = buildFullCmsData({ [CMS_KEYS.form]: legacy4Form });
    expect(cms4.form.esmeCommittees).toEqual(expected8Committees);
    expect("esmeRoles" in cms4.form).toBe(false);

    const linkedInSoc = cms3.footer.socialLinks.find((s) => s.platform === "linkedin");
    expect(linkedInSoc?.url).toBe(
      "https://www.linkedin.com/company/esme-cairo-university-student-chapter/"
    );
    expect(cms3.heroLogoUrl).toBe("/esme-icon.jpg");

    const legacyLogoUpgraded = buildFullCmsData({ hero_logo_url: "/esme_logo.png" });
    expect(legacyLogoUpgraded.heroLogoUrl).toBe("/esme-icon.jpg");
  });

  it("supports dynamic bilingual eventStats with 6-item fallback and Supabase round-trip", () => {
    const fallback = buildFullCmsData({ [CMS_KEYS.eventStats]: "[]" });
    expect(fallback.eventStats).toHaveLength(6);
    expect(fallback.eventStats[0]).toEqual({
      value: "400+",
      label: { en: "Total Seat Capacity", ar: "إجمالي السعة الاستيعابية" },
    });
    expect(fallback.eventStats[5]).toEqual({
      value: "100%",
      label: { en: "Accredited Certificate", ar: "شهادة معتمدة" },
    });

    const customStats = [
      { value: "600+", label: { en: "Summit Seats", ar: "مقعد للملتقى" } },
      { value: "25+", label: { en: "Keynote Guests", ar: "متحدث رئيسي" } },
      { value: "3", label: { en: "Technical Halls", ar: "قاعات تقنية" } },
    ];
    const rows = serializeFullCmsToSiteContentRows({
      ...DEFAULT_FULL_CMS,
      eventStats: customStats,
    });
    const rawMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const parsed = buildFullCmsData(rawMap);

    expect(parsed.eventStats).toEqual(customStats);
    expect(parsed.highlights).toEqual([
      { value: "600+", label: "Summit Seats" },
      { value: "25+", label: "Keynote Guests" },
      { value: "3", label: "Technical Halls" },
    ]);
    expect(parsed.ar?.highlights).toEqual([
      { value: "600+", label: "مقعد للملتقى" },
      { value: "25+", label: "متحدث رئيسي" },
      { value: "3", label: "قاعات تقنية" },
    ]);
  });

  it("never overwrites saved custom values or empty optional strings with defaults", () => {
    const custom = {
      ...DEFAULT_FULL_CMS,
      landing: {
        ...DEFAULT_FULL_CMS.landing,
        storyEyebrow: "",
        storyTitle: "Custom Summit Story Title",
      },
      gallery: [
        {
          id: "gal-custom-1",
          url: "/images/gallery/event-1.jpg",
          caption: "Custom Single Gallery Shot",
          alt: "Custom Alt",
        },
      ],
      agenda: {
        ...DEFAULT_FULL_CMS.agenda,
        hall1Subtitle: "",
        sessions: [
          {
            id: "custom-s1",
            hallType: "hall1" as const,
            sortOrder: 1,
            time: "11:00 AM",
            title: "Custom Alloy Talk",
            speaker: "Prof. Z",
            role: "",
            tag: "Metallurgy",
            description: "Custom description",
          },
        ],
      },
      ar: {
        ...DEFAULT_FULL_CMS.ar!,
        landing: {
          ...DEFAULT_FULL_CMS.ar!.landing,
          storyTitle: "عنوان قصة مخصص",
        },
      },
    };
    const rows = serializeFullCmsToSiteContentRows(custom);
    const rawMap = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const parsed = buildFullCmsData(rawMap);

    expect(parsed.landing.storyEyebrow).toBe("");
    expect(parsed.landing.storyTitle).toBe("Custom Summit Story Title");
    expect(parsed.gallery).toHaveLength(1);
    expect(parsed.gallery[0].caption).toBe("Custom Single Gallery Shot");
    expect(parsed.agenda.hall1Subtitle).toBe("");
    expect(parsed.agenda.sessions).toHaveLength(1);
    expect(parsed.agenda.sessions[0].title).toBe("Custom Alloy Talk");
    expect(parsed.ar?.landing.storyTitle).toBe("عنوان قصة مخصص");
  });
});
