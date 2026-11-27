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
    expect(shared.length).toBeGreaterThan(2);
    expect(hall1.length).toBeGreaterThan(2);
    expect(hall2.length).toBeGreaterThan(2);
    expect(cms.agenda.hall1Capacity).toContain("300");
    expect(cms.agenda.hall2Capacity).toContain("200");
    expect(cms.eventStats[0].value).toBe("500");

    expect(cms.landing.certificateBadge).toBe("FULL DAY");
    expect(cms.ar?.landing.subtitle).toMatch(/[\u0600-\u06FF]/);
    expect(cms.ar?.agenda.subtitle).toMatch(/[\u0600-\u06FF]/);
    expect(JSON.stringify(cms.form)).not.toMatch(/[\u0600-\u06FF]/);

    expect(cms.footer.portalUrl).toBe(
      "https://eslamemadportfolio22.my.canva.site/esmecairo"
    );
    expect(cms.eventMapsUrl).toBe(
      "https://www.google.com/maps/search/?api=1&query=Development+Research+and+Technological+Planning+Center+DRTPC+Cairo+University"
    );
  });

  it("normalizes legacy venue values to DRTPC, Cairo University in both languages", () => {
    const cms = buildFullCmsData({
      event_venue: "Cairo University",
      [CMS_KEYS.arabic]: JSON.stringify({ eventVenue: "جامعة القاهرة" }),
    });

    expect(cms.eventVenue).toBe(DEFAULT_FULL_CMS.eventVenue);
    expect(cms.ar?.eventVenue).toContain("DRTPC");
  });

  it("upgrades the published legacy event once and keeps future CMS edits editable", () => {
    const oldCms = buildFullCmsData({
      event_date: "12 December 2026",
      event_venue: "Cairo University",
      event_time: "Saturday 12 / 12 / 2026",
      [CMS_KEYS.landing]: JSON.stringify({
        titleLine1: "The Annual Materials & Engineering Conference",
        titleHighlight: "ESME METRIX 2026",
      }),
      [CMS_KEYS.agenda]: JSON.stringify({
        sessions: [
          {
            id: "h1-s1",
            hallType: "hall1",
            title: "Future of Smart & Green Metallurgy",
            speaker: "Legacy speaker",
          },
        ],
      }),
      [CMS_KEYS.arabic]: JSON.stringify({
        eventVenue: "جامعة القاهرة",
        agenda: { title: "جدول الفعاليات" },
      }),
    });

    expect(oldCms.eventVenue).toBe("DRTPC, Cairo University");
    expect(oldCms.agenda.sessions).toHaveLength(17);
    expect(oldCms.agenda.sessions.every((session) => !session.speaker && !session.role)).toBe(true);
    expect(oldCms.eventStats[0].value).toBe("500");
    expect(oldCms.ar?.eventVenue).toContain("DRTPC");

    const editedCms = {
      ...oldCms,
      landing: { ...oldCms.landing, titleLine1: "CMS-managed custom headline" },
    };
    const rows = serializeFullCmsToSiteContentRows(editedCms);
    const rawMap = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    const persistedCms = buildFullCmsData(rawMap);

    expect(rawMap[CMS_KEYS.contentVersion]).toBe("2026-12-drtpc-v3");
    expect(persistedCms.landing.titleLine1).toBe("CMS-managed custom headline");
  });

  it("upgrades the saved v1 agenda without replacing other CMS edits", () => {
    const raw = Object.fromEntries(
      serializeFullCmsToSiteContentRows(DEFAULT_FULL_CMS).map((row) => [row.key, row.value])
    );
    raw[CMS_KEYS.contentVersion] = "2026-12-drtpc-v1";
    raw[CMS_KEYS.landing] = JSON.stringify({
      ...DEFAULT_FULL_CMS.landing,
      titleLine1: "A CMS-managed headline",
      statusBadge: "REGISTRATION OPEN — 370 SEATS",
      aboutText: "Two halls with capacities of 250 and 120.",
      ctaDescription: "Only 370 seats are available.",
    });
    raw[CMS_KEYS.eventStats] = JSON.stringify([
      { value: "370", label: { en: "Total Seats", ar: "إجمالي المقاعد" } },
      ...DEFAULT_FULL_CMS.eventStats.slice(1),
    ]);
    raw[CMS_KEYS.agenda] = JSON.stringify({
      ...DEFAULT_FULL_CMS.agenda,
      sessions: [
        {
          id: "shared-registration",
          hallType: "shared",
          sortOrder: 1,
          time: "09:00 AM – 09:30 AM",
          title: "Registration, Welcome & Catering",
          speaker: "",
          role: "",
          tag: "Registration",
          description: "Old agenda content",
        },
      ],
    });
    raw[CMS_KEYS.arabic] = JSON.stringify({
      ...DEFAULT_FULL_CMS.ar,
      landing: {
        ...DEFAULT_FULL_CMS.ar?.landing,
        titleLine1: "عنوان محفوظ في CMS",
        statusBadge: "التسجيل مفتوح — 370 مقعداً",
        aboutText: "قاعتان بسعتي 250 و120 مقعداً.",
      },
      agenda: {
        ...DEFAULT_FULL_CMS.ar?.agenda,
        sessions: {
          "shared-registration": {
            ...DEFAULT_FULL_CMS.ar?.agenda.sessions["shared-registration"],
            description: "محتوى الأجندة القديم",
          },
        },
      },
    });

    const upgraded = buildFullCmsData(raw);

    expect(upgraded.agenda.sessions).toHaveLength(17);
    expect(upgraded.agenda.sessions[1]?.time).toBe("09:30 AM – 10:10 AM");
    expect(upgraded.agenda.sessions.find((session) => session.id === "h1-predictive-maintenance")?.title)
      .toBe("Predictive Maintenance");
    expect(upgraded.agenda.sessions.find((session) => session.id === "shared-sponsor-talks")?.tag)
      .toContain("2 Slots");
    expect(upgraded.agenda.sessions.every((session) => !session.speaker && !session.role)).toBe(true);
    expect(upgraded.landing.titleLine1).toBe("A CMS-managed headline");
    expect(upgraded.landing.statusBadge).toContain("500");
    expect(upgraded.landing.aboutText).toContain("300 and 200");
    expect(upgraded.landing.ctaDescription).toContain("500");
    expect(upgraded.eventStats[0].value).toBe("500");
    expect(upgraded.ar?.landing.titleLine1).toBe("عنوان محفوظ في CMS");
    expect(upgraded.ar?.landing.statusBadge).toContain("500");
    expect(upgraded.ar?.landing.aboutText).toContain("300 و200");
    expect(upgraded.agenda.hall1Capacity).toBe("300 Capacity");
    expect(upgraded.agenda.hall2Capacity).toBe("200 Capacity");
    expect(upgraded.ar?.agenda.hall1Capacity).toBe("السعة: 300 مشارك");
    expect(upgraded.ar?.agenda.hall2Capacity).toBe("السعة: 200 مشارك");
    expect(upgraded.ar?.agenda.sessions["shared-registration"]?.title).toBe("التسجيل والاستقبال والبرانش");

    raw[CMS_KEYS.contentVersion] = "2026-12-drtpc-v2";
    expect(buildFullCmsData(raw).agenda.hall1Capacity).toBe("300 Capacity");
  });

  it("upgrades old CMS hall capacities even when the version marker is missing", () => {
    const cms = buildFullCmsData({
      [CMS_KEYS.agenda]: JSON.stringify({
        ...DEFAULT_FULL_CMS.agenda,
        hall1Capacity: "250 Capacity",
        hall2Capacity: "120 Capacity",
      }),
      [CMS_KEYS.landing]: JSON.stringify({
        ...DEFAULT_FULL_CMS.landing,
        aboutText: "The halls have capacities of 250 and 120.",
        ctaDescription: "Only 370 seats are available.",
      }),
    });

    expect(cms.agenda.hall1Capacity).toBe("300 Capacity");
    expect(cms.agenda.hall2Capacity).toBe("200 Capacity");
    expect(cms.landing.aboutText).toContain("300 and 200");
    expect(cms.landing.ctaDescription).toContain("500");
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
      value: "500",
      label: { en: "Total Seats", ar: "إجمالي المقاعد" },
    });
    expect(fallback.eventStats[5]).toEqual({
      value: "✓",
      label: { en: "Certificate for Full-Day Attendance", ar: "شهادة للحضور طوال اليوم" },
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
