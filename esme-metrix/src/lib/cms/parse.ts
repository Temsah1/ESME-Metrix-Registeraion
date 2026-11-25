import {
  DEFAULT_AGENDA_CMS,
  DEFAULT_CONFIRMATION_CMS,
  DEFAULT_FOOTER_CMS,
  DEFAULT_FORM_CMS,
  DEFAULT_FULL_CMS,
  DEFAULT_GALLERY_CMS,
  DEFAULT_HIGHLIGHTS_CMS,
  DEFAULT_LANDING_CMS,
} from "@/lib/cms/defaults";
import type {
  AgendaHallType,
  AgendaSession,
  ConfirmationCmsConfig,
  DualHallAgendaConfig,
  FooterCmsConfig,
  FullCmsData,
  GalleryItem,
  HighlightMetric,
  LandingCmsConfig,
  RegistrationFormConfig,
  SocialLinkItem,
} from "@/lib/cms/types";

export const CMS_KEYS = {
  landing: "cms_landing",
  highlights: "cms_highlights",
  gallery: "cms_gallery",
  agenda: "cms_agenda",
  form: "cms_form_config",
  confirmation: "cms_confirmation",
  footer: "cms_footer",
  eventMapsUrl: "event_maps_url",
  postRegistrationWhatsappUrl: "post_registration_whatsapp_url",
} as const;

interface LegacyAgendaShape {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  hall1Name?: string;
  hall1Capacity?: string;
  hall1Subtitle?: string;
  hall2Name?: string;
  hall2Capacity?: string;
  hall2Subtitle?: string;
  sessions?: unknown;
  hall1Sessions?: unknown;
  hall2Sessions?: unknown;
}

function safeJsonParse<T>(raw: string | undefined): Partial<T> | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Partial<T>) : null;
  } catch {
    return null;
  }
}

function safeJsonArray<T>(raw: string | undefined): T[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

function normalizeHallType(raw: unknown, fallback: AgendaHallType): AgendaHallType {
  if (raw === "shared" || raw === "hall1" || raw === "hall2") {
    return raw;
  }
  return fallback;
}

function sanitizeAgendaSessions(
  items: unknown,
  defaultHallType: AgendaHallType = "hall1",
  baseOrder = 1
): AgendaSession[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item): item is Partial<AgendaSession> => Boolean(item && typeof item === "object"))
    .map((item, idx) => ({
      id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `session-${idx + 1}`,
      hallType: normalizeHallType(item.hallType, defaultHallType),
      sortOrder:
        typeof item.sortOrder === "number" && Number.isFinite(item.sortOrder)
          ? item.sortOrder
          : baseOrder + idx,
      time: typeof item.time === "string" ? item.time : "",
      title: typeof item.title === "string" ? item.title : "",
      speaker: typeof item.speaker === "string" ? item.speaker : "",
      role: typeof item.role === "string" ? item.role : "",
      tag: typeof item.tag === "string" ? item.tag : "Session",
      description: typeof item.description === "string" ? item.description : "",
    }))
    .filter((item) => item.title.trim().length > 0 || item.time.trim().length > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function parseAgendaConfig(parsed: LegacyAgendaShape | null): DualHallAgendaConfig {
  if (!parsed) return DEFAULT_AGENDA_CMS;

  let sessions: AgendaSession[];
  if (Array.isArray(parsed.sessions)) {
    const cleaned = sanitizeAgendaSessions(parsed.sessions, "shared", 1);
    sessions = cleaned.length > 0 ? cleaned : DEFAULT_AGENDA_CMS.sessions;
  } else if (Array.isArray(parsed.hall1Sessions) || Array.isArray(parsed.hall2Sessions)) {
    // Graceful upgrade from previous split-array schema -> preserve saved Hall 1/2 items + shared plenaries
    const h1 = sanitizeAgendaSessions(parsed.hall1Sessions, "hall1", 2);
    const h2 = sanitizeAgendaSessions(parsed.hall2Sessions, "hall2", 2);
    const maxOrder = Math.max(2, h1.length + 1, h2.length + 1);
    const defaultSharedTop = DEFAULT_AGENDA_CMS.sessions.filter(
      (s) => s.hallType === "shared" && s.sortOrder === 1
    );
    const defaultSharedBottom = DEFAULT_AGENDA_CMS.sessions
      .filter((s) => s.hallType === "shared" && s.sortOrder > 1)
      .map((s, idx) => ({ ...s, sortOrder: maxOrder + idx + 1 }));
    sessions = [...defaultSharedTop, ...h1, ...h2, ...defaultSharedBottom].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  } else {
    sessions = DEFAULT_AGENDA_CMS.sessions;
  }

  return {
    eyebrow: parsed.eyebrow?.trim() || DEFAULT_AGENDA_CMS.eyebrow,
    title: parsed.title?.trim() || DEFAULT_AGENDA_CMS.title,
    subtitle: parsed.subtitle?.trim() || DEFAULT_AGENDA_CMS.subtitle,
    hall1Name: parsed.hall1Name?.trim() || DEFAULT_AGENDA_CMS.hall1Name,
    hall1Capacity: parsed.hall1Capacity?.trim() || DEFAULT_AGENDA_CMS.hall1Capacity,
    hall1Subtitle: parsed.hall1Subtitle?.trim() || DEFAULT_AGENDA_CMS.hall1Subtitle,
    hall2Name: parsed.hall2Name?.trim() || DEFAULT_AGENDA_CMS.hall2Name,
    hall2Capacity: parsed.hall2Capacity?.trim() || DEFAULT_AGENDA_CMS.hall2Capacity,
    hall2Subtitle: parsed.hall2Subtitle?.trim() || DEFAULT_AGENDA_CMS.hall2Subtitle,
    sessions,
  };
}

/**
 * Merges raw `site_content` key-value pairs with full defaults so public pages,
 * `/register`, `/dashboard`, `/member`, `/api/register`, and Admin CMS share one source of truth.
 */
export function buildFullCmsData(raw: Record<string, string>): FullCmsData {
  const parsedLanding = safeJsonParse<LandingCmsConfig>(raw[CMS_KEYS.landing]);
  const parsedHighlights = safeJsonArray<HighlightMetric>(raw[CMS_KEYS.highlights]);
  const parsedGallery = safeJsonArray<GalleryItem>(raw[CMS_KEYS.gallery]);
  const parsedAgenda = safeJsonParse<LegacyAgendaShape>(raw[CMS_KEYS.agenda]);
  const parsedForm = safeJsonParse<RegistrationFormConfig>(raw[CMS_KEYS.form]);
  const parsedConfirmation = safeJsonParse<ConfirmationCmsConfig>(raw[CMS_KEYS.confirmation]);
  const parsedFooter = safeJsonParse<FooterCmsConfig>(raw[CMS_KEYS.footer]);

  const landing: LandingCmsConfig = {
    ...DEFAULT_LANDING_CMS,
    ...(parsedLanding || {}),
    storyPillars:
      Array.isArray(parsedLanding?.storyPillars) && parsedLanding.storyPillars.length > 0
        ? parsedLanding.storyPillars
        : DEFAULT_LANDING_CMS.storyPillars,
    experienceBullets:
      Array.isArray(parsedLanding?.experienceBullets) && parsedLanding.experienceBullets.length > 0
        ? parsedLanding.experienceBullets
        : DEFAULT_LANDING_CMS.experienceBullets,
  };

  if (!parsedLanding?.aboutText && raw.about_text?.trim()) {
    landing.aboutText = raw.about_text.trim();
  }
  if (!parsedLanding?.titleHighlight && raw.hero_headline?.trim()) {
    landing.titleHighlight = raw.hero_headline.trim();
  }
  if (!parsedLanding?.subtitle && raw.hero_subtitle?.trim()) {
    landing.subtitle = raw.hero_subtitle.trim();
  }

  const highlights: HighlightMetric[] =
    parsedHighlights && parsedHighlights.length > 0
      ? parsedHighlights.map((h, i) => ({
          value: h?.value || DEFAULT_HIGHLIGHTS_CMS[i]?.value || "—",
          label: h?.label || DEFAULT_HIGHLIGHTS_CMS[i]?.label || "Metric",
        }))
      : DEFAULT_HIGHLIGHTS_CMS;

  const gallery: GalleryItem[] = Array.from({ length: 8 }, (_, idx) => {
    const def = DEFAULT_GALLERY_CMS[idx];
    const fromJson = parsedGallery?.[idx];
    const legacyUrl = raw[`gallery_image_${idx + 1}`]?.trim();
    const isOldPlaceholder =
      !legacyUrl ||
      legacyUrl.includes("images.unsplash.com/") ||
      legacyUrl === "/images/materials-4.svg";
    return {
      id: fromJson?.id || def.id,
      url: fromJson?.url?.trim() || (!isOldPlaceholder ? legacyUrl : "") || def.url,
      caption: fromJson?.caption?.trim() || def.caption,
      alt: fromJson?.alt?.trim() || fromJson?.caption?.trim() || def.alt,
    };
  });

  const agenda = parseAgendaConfig(parsedAgenda);

  const form: RegistrationFormConfig = {
    ...DEFAULT_FORM_CMS,
    ...(parsedForm || {}),
    steps: {
      step1: { ...DEFAULT_FORM_CMS.steps.step1, ...(parsedForm?.steps?.step1 || {}) },
      step2: { ...DEFAULT_FORM_CMS.steps.step2, ...(parsedForm?.steps?.step2 || {}) },
      step3: { ...DEFAULT_FORM_CMS.steps.step3, ...(parsedForm?.steps?.step3 || {}) },
      step4: { ...DEFAULT_FORM_CMS.steps.step4, ...(parsedForm?.steps?.step4 || {}) },
    },
    fields: {
      fullName: { ...DEFAULT_FORM_CMS.fields.fullName, ...(parsedForm?.fields?.fullName || {}) },
      nationalId: { ...DEFAULT_FORM_CMS.fields.nationalId, ...(parsedForm?.fields?.nationalId || {}) },
      phone: { ...DEFAULT_FORM_CMS.fields.phone, ...(parsedForm?.fields?.phone || {}) },
      email: { ...DEFAULT_FORM_CMS.fields.email, ...(parsedForm?.fields?.email || {}) },
      city: { ...DEFAULT_FORM_CMS.fields.city, ...(parsedForm?.fields?.city || {}) },
      university: { ...DEFAULT_FORM_CMS.fields.university, ...(parsedForm?.fields?.university || {}) },
      faculty: { ...DEFAULT_FORM_CMS.fields.faculty, ...(parsedForm?.fields?.faculty || {}) },
      department: { ...DEFAULT_FORM_CMS.fields.department, ...(parsedForm?.fields?.department || {}) },
      customMajor: { ...DEFAULT_FORM_CMS.fields.customMajor, ...(parsedForm?.fields?.customMajor || {}) },
      academicYear: {
        ...DEFAULT_FORM_CMS.fields.academicYear,
        ...(parsedForm?.fields?.academicYear || {}),
      },
      graduationYear: {
        ...DEFAULT_FORM_CMS.fields.graduationYear,
        ...(parsedForm?.fields?.graduationYear || {}),
      },
      jobTitle: { ...DEFAULT_FORM_CMS.fields.jobTitle, ...(parsedForm?.fields?.jobTitle || {}) },
      company: { ...DEFAULT_FORM_CMS.fields.company, ...(parsedForm?.fields?.company || {}) },
      isEsmeMember: {
        ...DEFAULT_FORM_CMS.fields.isEsmeMember,
        ...(parsedForm?.fields?.isEsmeMember || {}),
      },
      committee: { ...DEFAULT_FORM_CMS.fields.committee, ...(parsedForm?.fields?.committee || {}) },
      role: { ...DEFAULT_FORM_CMS.fields.role, ...(parsedForm?.fields?.role || {}) },
      idPhotoUrl: { ...DEFAULT_FORM_CMS.fields.idPhotoUrl, ...(parsedForm?.fields?.idPhotoUrl || {}) },
      avatarUrl: { ...DEFAULT_FORM_CMS.fields.avatarUrl, ...(parsedForm?.fields?.avatarUrl || {}) },
    },
    faculties:
      Array.isArray(parsedForm?.faculties) && parsedForm.faculties.length > 0
        ? parsedForm.faculties
            .map((f) => ({
              name: (f?.name || "").trim(),
              departments: Array.isArray(f?.departments)
                ? f.departments.map((d) => String(d).trim()).filter(Boolean)
                : [],
            }))
            .filter((f) => f.name.length > 0)
        : DEFAULT_FORM_CMS.faculties,
    cities:
      Array.isArray(parsedForm?.cities) && parsedForm.cities.length > 0
        ? parsedForm.cities.map((c) => String(c).trim()).filter(Boolean)
        : DEFAULT_FORM_CMS.cities,
    academicYears:
      Array.isArray(parsedForm?.academicYears) && parsedForm.academicYears.length > 0
        ? parsedForm.academicYears.filter((a) => a?.value && a?.label)
        : DEFAULT_FORM_CMS.academicYears,
    graduationYears:
      Array.isArray(parsedForm?.graduationYears) && parsedForm.graduationYears.length > 0
        ? parsedForm.graduationYears.filter((g) => g?.value && g?.label)
        : DEFAULT_FORM_CMS.graduationYears,
    esmeCommittees:
      Array.isArray(parsedForm?.esmeCommittees) && parsedForm.esmeCommittees.length > 0
        ? parsedForm.esmeCommittees.map((c) => String(c).trim()).filter(Boolean)
        : DEFAULT_FORM_CMS.esmeCommittees,
    esmeRoles:
      Array.isArray(parsedForm?.esmeRoles) && parsedForm.esmeRoles.length > 0
        ? parsedForm.esmeRoles.map((r) => String(r).trim()).filter(Boolean)
        : DEFAULT_FORM_CMS.esmeRoles,
  };

  const confirmation: ConfirmationCmsConfig = {
    ...DEFAULT_CONFIRMATION_CMS,
    ...(parsedConfirmation || {}),
    postRegistrationWhatsappUrl:
      parsedConfirmation?.postRegistrationWhatsappUrl?.trim() ||
      raw[CMS_KEYS.postRegistrationWhatsappUrl]?.trim() ||
      raw.whatsapp_group_url?.trim() ||
      DEFAULT_CONFIRMATION_CMS.postRegistrationWhatsappUrl,
    linkedinCaption:
      parsedConfirmation?.linkedinCaption?.trim() ||
      raw.linkedin_caption?.trim() ||
      DEFAULT_CONFIRMATION_CMS.linkedinCaption,
    ogHighlightsText:
      parsedConfirmation?.ogHighlightsText?.trim() ||
      raw.og_highlights?.trim() ||
      DEFAULT_CONFIRMATION_CMS.ogHighlightsText,
    checklist:
      Array.isArray(parsedConfirmation?.checklist) && parsedConfirmation.checklist.length > 0
        ? parsedConfirmation.checklist
        : DEFAULT_CONFIRMATION_CMS.checklist,
  };

  const socialLinks: SocialLinkItem[] =
    Array.isArray(parsedFooter?.socialLinks) && parsedFooter.socialLinks.length > 0
      ? parsedFooter.socialLinks.map((s, idx) => ({
          id: s?.id || `soc-${idx}`,
          platform: s?.platform || "website",
          label: s?.label || "Link",
          url: s?.url || "",
          enabled: typeof s?.enabled === "boolean" ? s.enabled : true,
        }))
      : DEFAULT_FOOTER_CMS.socialLinks;

  const footer: FooterCmsConfig = {
    ...DEFAULT_FOOTER_CMS,
    ...(parsedFooter || {}),
    socialLinks,
  };

  return {
    eventDate: raw.event_date?.trim() || DEFAULT_FULL_CMS.eventDate,
    eventVenue: raw.event_venue?.trim() || DEFAULT_FULL_CMS.eventVenue,
    eventTime: raw.event_time?.trim() || DEFAULT_FULL_CMS.eventTime,
    eventMapsUrl: raw[CMS_KEYS.eventMapsUrl]?.trim() || DEFAULT_FULL_CMS.eventMapsUrl,
    heroLogoUrl: raw.hero_logo_url?.trim() || DEFAULT_FULL_CMS.heroLogoUrl,
    ticketBgUrl: raw.ticket_bg_url?.trim() || DEFAULT_FULL_CMS.ticketBgUrl,
    landing,
    highlights,
    gallery,
    agenda,
    form,
    confirmation,
    footer,
  };
}

export interface SiteContentUpsertRow {
  key: string;
  value: string;
  label: string;
  category: string;
  field_type: string;
  updated_at: string;
}

/**
 * Serializes the full structured CMS state into `site_content` upsert rows,
 * keeping legacy scalar keys (`event_date`, `linkedin_caption`, `og_highlights`, etc.) in sync.
 */
export function serializeFullCmsToSiteContentRows(cms: FullCmsData): SiteContentUpsertRow[] {
  const now = new Date().toISOString();
  const sortedAgenda: DualHallAgendaConfig = {
    ...cms.agenda,
    sessions: [...cms.agenda.sessions].sort((a, b) => a.sortOrder - b.sortOrder),
  };

  return [
    {
      key: "event_date",
      value: cms.eventDate,
      label: "Event Date",
      category: "Event Details",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "event_venue",
      value: cms.eventVenue,
      label: "Event Venue",
      category: "Event Details",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "event_time",
      value: cms.eventTime,
      label: "Event Time Display",
      category: "Event Details",
      field_type: "text",
      updated_at: now,
    },
    {
      key: CMS_KEYS.eventMapsUrl,
      value: cms.eventMapsUrl,
      label: "Venue Google Maps URL",
      category: "Event Details",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "hero_logo_url",
      value: cms.heroLogoUrl,
      label: "Hero / Navbar Logo",
      category: "Brand Assets",
      field_type: "image",
      updated_at: now,
    },
    {
      key: "ticket_bg_url",
      value: cms.ticketBgUrl,
      label: "Ticket Background Image",
      category: "Brand Assets",
      field_type: "image",
      updated_at: now,
    },
    {
      key: "hero_headline",
      value: cms.landing.titleHighlight,
      label: "Hero Headline",
      category: "Hero Section",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "hero_subtitle",
      value: cms.landing.subtitle,
      label: "Hero Subtitle",
      category: "Hero Section",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "about_text",
      value: cms.landing.aboutText,
      label: "About the Event",
      category: "Home Page",
      field_type: "textarea",
      updated_at: now,
    },
    {
      key: "linkedin_caption",
      value: cms.confirmation.linkedinCaption,
      label: "LinkedIn Share Caption",
      category: "Social Amplification",
      field_type: "textarea",
      updated_at: now,
    },
    {
      key: "og_highlights",
      value: cms.confirmation.ogHighlightsText,
      label: "LinkedIn Card Highlights",
      category: "Social Amplification",
      field_type: "textarea",
      updated_at: now,
    },
    {
      key: CMS_KEYS.postRegistrationWhatsappUrl,
      value: cms.confirmation.postRegistrationWhatsappUrl,
      label: "Post-Registration WhatsApp Invite URL",
      category: "Confirmation",
      field_type: "text",
      updated_at: now,
    },
    {
      key: "whatsapp_group_url",
      value: cms.confirmation.postRegistrationWhatsappUrl,
      label: "Attendee WhatsApp Group Link",
      category: "Social Amplification",
      field_type: "text",
      updated_at: now,
    },
    {
      key: CMS_KEYS.landing,
      value: JSON.stringify(cms.landing),
      label: "Landing Page Storytelling Config (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.highlights,
      value: JSON.stringify(cms.highlights),
      label: "Highlights Metrics Strip (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.gallery,
      value: JSON.stringify(cms.gallery),
      label: "8-Photo Gallery Showcase (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.agenda,
      value: JSON.stringify(sortedAgenda),
      label: "Dual-Hall Event Agenda (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.form,
      value: JSON.stringify(cms.form),
      label: "Dynamic Registration Form Config (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.confirmation,
      value: JSON.stringify(cms.confirmation),
      label: "Confirmation & Ticket Screen Config (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.footer,
      value: JSON.stringify(cms.footer),
      label: "Footer & Chapter Social Links Config (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    ...cms.gallery.map((g, idx) => ({
      key: `gallery_image_${idx + 1}`,
      value: g.url,
      label: `Gallery Photo ${idx + 1} URL`,
      category: "Gallery",
      field_type: "image",
      updated_at: now,
    })),
  ];
}
