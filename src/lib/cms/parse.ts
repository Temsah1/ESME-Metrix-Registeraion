import { OFFICIAL_ESME_LINKEDIN_URL } from "@/config/registration";
import { DEFAULT_ARABIC_CMS } from "@/lib/cms/arabic";
import {
  DEFAULT_AGENDA_CMS,
  DEFAULT_CONFIRMATION_CMS,
  DEFAULT_EVENT_STATS_CMS,
  DEFAULT_FOOTER_CMS,
  DEFAULT_FORM_CMS,
  DEFAULT_FULL_CMS,
  DEFAULT_GALLERY_CMS,
  DEFAULT_LANDING_CMS,
} from "@/lib/cms/defaults";
import type {
  AgendaHallType,
  AgendaSession,
  ArabicCmsData,
  ConfirmationCmsConfig,
  DualHallAgendaConfig,
  EventStatItem,
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
  eventStats: "eventStats",
  gallery: "cms_gallery",
  agenda: "cms_agenda",
  form: "cms_form_config",
  confirmation: "cms_confirmation",
  footer: "cms_footer",
  arabic: "cms_arabic",
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

function pickString(saved: unknown, fallback: string): string {
  return typeof saved === "string" ? saved : fallback;
}

function stripNullish<T extends object>(obj: Partial<T> | null | undefined): Partial<T> {
  if (!obj || typeof obj !== "object") return {};
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
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
    eyebrow: pickString(parsed.eyebrow, DEFAULT_AGENDA_CMS.eyebrow),
    title: pickString(parsed.title, DEFAULT_AGENDA_CMS.title),
    subtitle: pickString(parsed.subtitle, DEFAULT_AGENDA_CMS.subtitle),
    hall1Name: pickString(parsed.hall1Name, DEFAULT_AGENDA_CMS.hall1Name),
    hall1Capacity: pickString(parsed.hall1Capacity, DEFAULT_AGENDA_CMS.hall1Capacity),
    hall1Subtitle: pickString(parsed.hall1Subtitle, DEFAULT_AGENDA_CMS.hall1Subtitle),
    hall2Name: pickString(parsed.hall2Name, DEFAULT_AGENDA_CMS.hall2Name),
    hall2Capacity: pickString(parsed.hall2Capacity, DEFAULT_AGENDA_CMS.hall2Capacity),
    hall2Subtitle: pickString(parsed.hall2Subtitle, DEFAULT_AGENDA_CMS.hall2Subtitle),
    sessions,
  };
}

const LEGACY_LINKEDIN_COMPANY_URL = "https://www.linkedin.com/company/esme-cairo-university/";
const LEGACY_COMMITTEES_SIGNATURES = new Set([
  "digital|it|marketing",
  "digital|high board|it|marketing",
]);

function normalizeLinkedinCaption(rawCaption: string | undefined): string {
  const trimmed = rawCaption?.trim() || "";
  if (!trimmed) return DEFAULT_CONFIRMATION_CMS.linkedinCaption;

  // Auto-upgrade unmodified pre-0010 captions to include /share/[ticketId] and Chapter LinkedIn URL
  const isUntouchedLegacy =
    trimmed.includes("esme-metrix-registeration.vercel.app") &&
    (!trimmed.includes("Follow ESME Cairo University:") ||
      !trimmed.includes("/share/"));
  return isUntouchedLegacy ? DEFAULT_CONFIRMATION_CMS.linkedinCaption : trimmed;
}

function normalizeCommitteesList(items: unknown): string[] {
  if (!Array.isArray(items)) return DEFAULT_FORM_CMS.esmeCommittees;
  const cleaned = items.map((c) => String(c).trim()).filter(Boolean);
  if (cleaned.length === 0) return DEFAULT_FORM_CMS.esmeCommittees;

  const sortedSignature = [...cleaned].map((c) => c.toLowerCase()).sort().join("|");
  if (LEGACY_COMMITTEES_SIGNATURES.has(sortedSignature)) {
    return DEFAULT_FORM_CMS.esmeCommittees;
  }
  return cleaned;
}

/**
 * Merges raw `site_content` key-value pairs with full defaults so public pages,
 * `/register`, `/dashboard`, `/member`, `/api/register`, and Admin CMS share one source of truth.
 */
export function buildFullCmsData(raw: Record<string, string>): FullCmsData {
  const parsedLanding = safeJsonParse<LandingCmsConfig>(raw[CMS_KEYS.landing]);
  const parsedEventStats = safeJsonArray<EventStatItem>(
    raw[CMS_KEYS.eventStats] || raw.event_stats || raw.cms_event_stats
  );
  const parsedHighlights = safeJsonArray<HighlightMetric>(raw[CMS_KEYS.highlights]);
  const parsedGallery = safeJsonArray<GalleryItem>(raw[CMS_KEYS.gallery]);
  const parsedAgenda = safeJsonParse<LegacyAgendaShape>(raw[CMS_KEYS.agenda]);
  const parsedFormRaw = safeJsonParse<Record<string, unknown>>(raw[CMS_KEYS.form]);
  const parsedForm = parsedFormRaw as Partial<RegistrationFormConfig> | null;
  const parsedConfirmation = safeJsonParse<ConfirmationCmsConfig>(raw[CMS_KEYS.confirmation]);
  const parsedFooter = safeJsonParse<FooterCmsConfig>(raw[CMS_KEYS.footer]);
  const parsedArabic = safeJsonParse<ArabicCmsData>(raw[CMS_KEYS.arabic]);

  const landing: LandingCmsConfig = {
    ...DEFAULT_LANDING_CMS,
    ...stripNullish(parsedLanding),
    storyPillars:
      Array.isArray(parsedLanding?.storyPillars) && parsedLanding.storyPillars.length > 0
        ? parsedLanding.storyPillars
        : DEFAULT_LANDING_CMS.storyPillars,
    experienceBullets:
      Array.isArray(parsedLanding?.experienceBullets) && parsedLanding.experienceBullets.length > 0
        ? parsedLanding.experienceBullets
        : DEFAULT_LANDING_CMS.experienceBullets,
  };

  if (parsedLanding?.aboutText == null && raw.about_text?.trim()) {
    landing.aboutText = raw.about_text.trim();
  }
  if (parsedLanding?.titleHighlight == null && raw.hero_headline?.trim()) {
    landing.titleHighlight = raw.hero_headline.trim();
  }
  if (parsedLanding?.subtitle == null && raw.hero_subtitle?.trim()) {
    landing.subtitle = raw.hero_subtitle.trim();
  }

  const eventStats: EventStatItem[] =
    parsedEventStats && parsedEventStats.length > 0
      ? parsedEventStats
          .map((item, i) => {
            const def = DEFAULT_EVENT_STATS_CMS[i];
            const val = typeof item?.value === "string" ? item.value.trim() : "";
            const en = typeof item?.label?.en === "string" ? item.label.en.trim() : "";
            const arLabel = typeof item?.label?.ar === "string" ? item.label.ar.trim() : "";
            return {
              value: val || def?.value || "—",
              label: {
                en: en || def?.label.en || "Metric",
                ar: arLabel || def?.label.ar || en || "مؤشر",
              },
            };
          })
          .filter((item) => item.value || item.label.en || item.label.ar)
      : parsedHighlights && parsedHighlights.length > 0
      ? parsedHighlights.map((h, i) => {
          const def = DEFAULT_EVENT_STATS_CMS[i];
          const val = typeof h?.value === "string" ? h.value.trim() : "";
          const en = typeof h?.label === "string" ? h.label.trim() : "";
          const arExisting =
            typeof parsedArabic?.highlights?.[i]?.label === "string"
              ? parsedArabic.highlights[i].label.trim()
              : "";
          return {
            value: val || def?.value || "—",
            label: {
              en: en || def?.label.en || "Metric",
              ar: arExisting || def?.label.ar || en || "مؤشر",
            },
          };
        })
      : DEFAULT_EVENT_STATS_CMS.map((item) => ({
          value: item.value,
          label: { ...item.label },
        }));

  const highlights: HighlightMetric[] = eventStats.map((s) => ({
    value: s.value,
    label: s.label.en,
  }));

  const gallery: GalleryItem[] =
    parsedGallery && parsedGallery.length > 0
      ? parsedGallery.map((fromJson, idx) => {
          const def = DEFAULT_GALLERY_CMS[idx];
          const legacyUrl = raw[`gallery_image_${idx + 1}`]?.trim();
          const isOldPlaceholder =
            !legacyUrl ||
            legacyUrl.includes("images.unsplash.com/") ||
            legacyUrl === "/images/materials-4.svg";
          const url =
            typeof fromJson?.url === "string" && fromJson.url.trim().length > 0
              ? fromJson.url.trim()
              : (!isOldPlaceholder ? legacyUrl : "") || def?.url || "";
          const caption = pickString(fromJson?.caption, def?.caption || "");
          const alt = pickString(fromJson?.alt, caption || def?.alt || "");
          return {
            id:
              typeof fromJson?.id === "string" && fromJson.id.trim().length > 0
                ? fromJson.id.trim()
                : def?.id || `gal-${idx + 1}`,
            url,
            caption,
            alt,
          };
        })
      : Array.from({ length: 8 }, (_, idx) => {
          const def = DEFAULT_GALLERY_CMS[idx];
          const legacyUrl = raw[`gallery_image_${idx + 1}`]?.trim();
          const isOldPlaceholder =
            !legacyUrl ||
            legacyUrl.includes("images.unsplash.com/") ||
            legacyUrl === "/images/materials-4.svg";
          return {
            id: def.id,
            url: (!isOldPlaceholder ? legacyUrl : "") || def.url,
            caption: def.caption,
            alt: def.alt,
          };
        });

  const agenda = parseAgendaConfig(parsedAgenda);

  const form: RegistrationFormConfig = {
    ...DEFAULT_FORM_CMS,
    bannerBadge: pickString(parsedForm?.bannerBadge, DEFAULT_FORM_CMS.bannerBadge),
    bannerTitle: pickString(parsedForm?.bannerTitle, DEFAULT_FORM_CMS.bannerTitle),
    bannerDescription: pickString(
      parsedForm?.bannerDescription,
      DEFAULT_FORM_CMS.bannerDescription
    ),
    termsLabel: pickString(parsedForm?.termsLabel, DEFAULT_FORM_CMS.termsLabel),
    submitButtonLabel: pickString(
      parsedForm?.submitButtonLabel,
      DEFAULT_FORM_CMS.submitButtonLabel
    ),
    steps: {
      step1: {
        ...DEFAULT_FORM_CMS.steps.step1,
        ...stripNullish(parsedForm?.steps?.step1),
      },
      step2: {
        ...DEFAULT_FORM_CMS.steps.step2,
        ...stripNullish(parsedForm?.steps?.step2),
      },
      step3: {
        ...DEFAULT_FORM_CMS.steps.step3,
        ...stripNullish(parsedForm?.steps?.step3),
      },
      step4: {
        ...DEFAULT_FORM_CMS.steps.step4,
        ...stripNullish(parsedForm?.steps?.step4),
      },
    },
    fields: {
      fullName: {
        ...DEFAULT_FORM_CMS.fields.fullName,
        ...stripNullish(parsedForm?.fields?.fullName),
      },
      nationalId: {
        ...DEFAULT_FORM_CMS.fields.nationalId,
        ...stripNullish(parsedForm?.fields?.nationalId),
      },
      phone: {
        ...DEFAULT_FORM_CMS.fields.phone,
        ...stripNullish(parsedForm?.fields?.phone),
      },
      email: {
        ...DEFAULT_FORM_CMS.fields.email,
        ...stripNullish(parsedForm?.fields?.email),
      },
      city: {
        ...DEFAULT_FORM_CMS.fields.city,
        ...stripNullish(parsedForm?.fields?.city),
      },
      university: {
        ...DEFAULT_FORM_CMS.fields.university,
        ...stripNullish(parsedForm?.fields?.university),
      },
      faculty: {
        ...DEFAULT_FORM_CMS.fields.faculty,
        ...stripNullish(parsedForm?.fields?.faculty),
      },
      department: {
        ...DEFAULT_FORM_CMS.fields.department,
        ...stripNullish(parsedForm?.fields?.department),
      },
      customMajor: {
        ...DEFAULT_FORM_CMS.fields.customMajor,
        ...stripNullish(parsedForm?.fields?.customMajor),
      },
      academicYear: {
        ...DEFAULT_FORM_CMS.fields.academicYear,
        ...stripNullish(parsedForm?.fields?.academicYear),
      },
      graduationYear: {
        ...DEFAULT_FORM_CMS.fields.graduationYear,
        ...stripNullish(parsedForm?.fields?.graduationYear),
      },
      jobTitle: {
        ...DEFAULT_FORM_CMS.fields.jobTitle,
        ...stripNullish(parsedForm?.fields?.jobTitle),
      },
      company: {
        ...DEFAULT_FORM_CMS.fields.company,
        ...stripNullish(parsedForm?.fields?.company),
      },
      isEsmeMember: {
        ...DEFAULT_FORM_CMS.fields.isEsmeMember,
        ...stripNullish(parsedForm?.fields?.isEsmeMember),
      },
      committee: {
        ...DEFAULT_FORM_CMS.fields.committee,
        ...stripNullish(parsedForm?.fields?.committee),
      },
      idPhotoUrl: {
        ...DEFAULT_FORM_CMS.fields.idPhotoUrl,
        ...stripNullish(parsedForm?.fields?.idPhotoUrl),
      },
      avatarUrl: {
        ...DEFAULT_FORM_CMS.fields.avatarUrl,
        ...stripNullish(parsedForm?.fields?.avatarUrl),
      },
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
    esmeCommittees: normalizeCommitteesList(parsedForm?.esmeCommittees),
  };

  const confirmation: ConfirmationCmsConfig = {
    ...DEFAULT_CONFIRMATION_CMS,
    ...stripNullish(parsedConfirmation),
    postRegistrationWhatsappUrl:
      parsedConfirmation?.postRegistrationWhatsappUrl?.trim() ||
      raw[CMS_KEYS.postRegistrationWhatsappUrl]?.trim() ||
      raw.whatsapp_group_url?.trim() ||
      DEFAULT_CONFIRMATION_CMS.postRegistrationWhatsappUrl,
    linkedinCaption: normalizeLinkedinCaption(
      parsedConfirmation?.linkedinCaption?.trim() || raw.linkedin_caption?.trim()
    ),
    ogHighlightsText:
      typeof parsedConfirmation?.ogHighlightsText === "string"
        ? parsedConfirmation.ogHighlightsText
        : typeof raw.og_highlights === "string"
        ? raw.og_highlights
        : DEFAULT_CONFIRMATION_CMS.ogHighlightsText,
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
          label: typeof s?.label === "string" ? s.label : "Link",
          url:
            s?.url?.trim() === LEGACY_LINKEDIN_COMPANY_URL
              ? OFFICIAL_ESME_LINKEDIN_URL
              : s?.url || "",
          enabled: typeof s?.enabled === "boolean" ? s.enabled : true,
        }))
      : DEFAULT_FOOTER_CMS.socialLinks;

  const footer: FooterCmsConfig = {
    ...DEFAULT_FOOTER_CMS,
    ...stripNullish(parsedFooter),
    socialLinks,
  };

  const { role: _legacyArRole, ...cleanArFields } = (parsedArabic?.form?.fields ||
    {}) as Record<string, unknown>;
  void _legacyArRole;

  const ar: ArabicCmsData = {
    eventDate: pickString(parsedArabic?.eventDate, DEFAULT_ARABIC_CMS.eventDate),
    eventVenue: pickString(parsedArabic?.eventVenue, DEFAULT_ARABIC_CMS.eventVenue),
    eventTime: pickString(parsedArabic?.eventTime, DEFAULT_ARABIC_CMS.eventTime),
    landing: {
      ...DEFAULT_ARABIC_CMS.landing,
      ...stripNullish(parsedArabic?.landing),
      storyPillars:
        Array.isArray(parsedArabic?.landing?.storyPillars) &&
        parsedArabic.landing.storyPillars.length > 0
          ? parsedArabic.landing.storyPillars
          : DEFAULT_ARABIC_CMS.landing.storyPillars,
      experienceBullets:
        Array.isArray(parsedArabic?.landing?.experienceBullets) &&
        parsedArabic.landing.experienceBullets.length > 0
          ? parsedArabic.landing.experienceBullets
          : DEFAULT_ARABIC_CMS.landing.experienceBullets,
    },
    highlights: eventStats.map((s) => ({
      value: s.value,
      label: s.label.ar,
    })),
    gallery:
      Array.isArray(parsedArabic?.gallery) && parsedArabic.gallery.length > 0
        ? parsedArabic.gallery
        : DEFAULT_ARABIC_CMS.gallery,
    agenda: {
      ...DEFAULT_ARABIC_CMS.agenda,
      ...stripNullish(parsedArabic?.agenda),
      sessions: {
        ...DEFAULT_ARABIC_CMS.agenda.sessions,
        ...(parsedArabic?.agenda?.sessions || {}),
      },
    },
    form: {
      ...DEFAULT_ARABIC_CMS.form,
      ...stripNullish(parsedArabic?.form),
      steps: {
        step1: {
          ...DEFAULT_ARABIC_CMS.form.steps.step1,
          ...stripNullish(parsedArabic?.form?.steps?.step1),
        },
        step2: {
          ...DEFAULT_ARABIC_CMS.form.steps.step2,
          ...stripNullish(parsedArabic?.form?.steps?.step2),
        },
        step3: {
          ...DEFAULT_ARABIC_CMS.form.steps.step3,
          ...stripNullish(parsedArabic?.form?.steps?.step3),
        },
        step4: {
          ...DEFAULT_ARABIC_CMS.form.steps.step4,
          ...stripNullish(parsedArabic?.form?.steps?.step4),
        },
      },
      fields: {
        ...DEFAULT_ARABIC_CMS.form.fields,
        ...stripNullish(cleanArFields),
      },
    },
    confirmation: {
      ...DEFAULT_ARABIC_CMS.confirmation,
      ...stripNullish(parsedArabic?.confirmation),
      checklist:
        Array.isArray(parsedArabic?.confirmation?.checklist) &&
        parsedArabic.confirmation.checklist.length > 0
          ? parsedArabic.confirmation.checklist
          : DEFAULT_ARABIC_CMS.confirmation.checklist,
    },
    footer: {
      ...DEFAULT_ARABIC_CMS.footer,
      ...stripNullish(parsedArabic?.footer),
    },
  };

  return {
    eventDate: pickString(raw.event_date, DEFAULT_FULL_CMS.eventDate),
    eventVenue: pickString(raw.event_venue, DEFAULT_FULL_CMS.eventVenue),
    eventTime: pickString(raw.event_time, DEFAULT_FULL_CMS.eventTime),
    eventMapsUrl: raw[CMS_KEYS.eventMapsUrl]?.trim() || DEFAULT_FULL_CMS.eventMapsUrl,
    heroLogoUrl: raw.hero_logo_url?.trim() || DEFAULT_FULL_CMS.heroLogoUrl,
    ticketBgUrl: raw.ticket_bg_url?.trim() || DEFAULT_FULL_CMS.ticketBgUrl,
    landing,
    highlights,
    eventStats,
    gallery,
    agenda,
    form,
    confirmation,
    footer,
    ar,
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
  const normalizedEventStats: EventStatItem[] =
    cms.eventStats && cms.eventStats.length > 0
      ? cms.eventStats.map((item, i) => {
          const def = DEFAULT_EVENT_STATS_CMS[i];
          const val = item?.value?.trim() || def?.value || "—";
          const en = item?.label?.en?.trim() || def?.label.en || "Metric";
          const arLabel = item?.label?.ar?.trim() || def?.label.ar || en || "مؤشر";
          return { value: val, label: { en, ar: arLabel } };
        })
      : DEFAULT_EVENT_STATS_CMS.map((item) => ({
          value: item.value,
          label: { ...item.label },
        }));
  const syncedHighlights = normalizedEventStats.map((s) => ({
    value: s.value,
    label: s.label.en,
  }));
  const baseArabic = cms.ar ?? DEFAULT_ARABIC_CMS;
  const syncedArabic: ArabicCmsData = {
    ...baseArabic,
    highlights: normalizedEventStats.map((s) => ({
      value: s.value,
      label: s.label.ar,
    })),
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
      value: JSON.stringify(syncedHighlights),
      label: "Highlights Metrics Strip (JSON)",
      category: "CMS JSON",
      field_type: "json",
      updated_at: now,
    },
    {
      key: CMS_KEYS.eventStats,
      value: JSON.stringify(normalizedEventStats),
      label: "Landing Event Stats Bar (Bilingual JSON)",
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
    {
      key: CMS_KEYS.arabic,
      value: JSON.stringify(syncedArabic),
      label: "Arabic Bilingual Content Config (JSON)",
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
