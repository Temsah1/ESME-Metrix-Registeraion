"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Images,
  LayoutTemplate,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { FullCmsData, SocialPlatform } from "@/lib/cms/types";
import {
  CmsImageField,
  CmsTextArea,
  CmsTextInput,
  FormBuilderSection,
  WireframeAgendaEditor,
} from "@/components/admin/cms/CmsFormFields";

type CmsSectionTab =
  | "landing"
  | "gallery"
  | "agenda"
  | "form"
  | "confirmation"
  | "footer";

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "website",
  "linkedin",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "email",
];

interface CmsEditorProps {
  cms: FullCmsData;
  loading: boolean;
  saving: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  uploadingKey: string | null;
  onChange: (next: FullCmsData) => void;
  onUploadImage: (key: string, file: File, applyUrl: (url: string) => void) => void;
  onSave: () => void;
  onReset: () => void;
}

export default function CmsEditor({
  cms,
  loading,
  saving,
  successMessage,
  errorMessage,
  uploadingKey,
  onChange,
  onUploadImage,
  onSave,
  onReset,
}: CmsEditorProps) {
  const [subTab, setSubTab] = useState<CmsSectionTab>("landing");

  const subTabs: Array<{
    id: CmsSectionTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "landing", label: "Landing & Story", icon: LayoutTemplate },
    { id: "gallery", label: "8-Photo Gallery", icon: Images },
    { id: "agenda", label: "Dual-Hall Agenda", icon: CalendarDays },
    { id: "form", label: "Form Builder", icon: ClipboardList },
    { id: "confirmation", label: "Confirmation & Social", icon: Share2 },
    { id: "footer", label: "Footer & Links", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Sticky Action Header */}
      <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <h2 className="text-base font-bold text-white">
              Total Site &amp; Form CMS Control
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Edit landing copy, 8-photo gallery, Hall 1 &amp; Hall 2 sessions, registration form fields &amp; dropdowns, confirmation copy, and footer links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save &amp; Publish Changes
              </>
            )}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-[#D97706] hover:border-[#D97706] transition-colors"
            title="Preview live site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-[#0F243A] border border-slate-800">
        {subTabs.map((t) => {
          const Icon = t.icon;
          const active = subTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                active
                  ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_0_12px_rgba(217,119,6,0.3)]"
                  : "text-slate-300 hover:text-white hover:bg-[#15304B]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LANDING & STORYTELLING */}
      {subTab === "landing" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
              Hero &amp; Event Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CmsTextInput
                label="Event Date"
                value={cms.eventDate}
                onChange={(v) => onChange({ ...cms, eventDate: v })}
              />
              <CmsTextInput
                label="Event Venue"
                value={cms.eventVenue}
                onChange={(v) => onChange({ ...cms, eventVenue: v })}
              />
              <CmsTextInput
                label="Event Time Display"
                value={cms.eventTime}
                onChange={(v) => onChange({ ...cms, eventTime: v })}
              />
              <CmsTextInput
                label="Venue Google Maps URL"
                value={cms.eventMapsUrl}
                onChange={(v) => onChange({ ...cms, eventMapsUrl: v })}
                mono
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CmsTextInput
                label="Live Status Pill"
                value={cms.landing.statusBadge}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, statusBadge: v } })
                }
              />
              <CmsTextInput
                label="Hero Title Line 1"
                value={cms.landing.titleLine1}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, titleLine1: v } })
                }
              />
              <CmsTextInput
                label="Hero Highlight Title"
                value={cms.landing.titleHighlight}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, titleHighlight: v } })
                }
              />
            </div>

            <CmsTextArea
              label="Hero Subtitle"
              rows={2}
              value={cms.landing.subtitle}
              onChange={(v) =>
                onChange({ ...cms, landing: { ...cms.landing, subtitle: v } })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsTextInput
                label="Primary CTA Button"
                value={cms.landing.primaryCtaLabel}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, primaryCtaLabel: v } })
                }
              />
              <CmsTextInput
                label="Secondary CTA Button"
                value={cms.landing.secondaryCtaLabel}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    landing: { ...cms.landing, secondaryCtaLabel: v },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CmsImageField
                label="Navbar / Footer Logo URL"
                value={cms.heroLogoUrl}
                uploading={uploadingKey === "hero_logo_url"}
                onChange={(v) => onChange({ ...cms, heroLogoUrl: v })}
                onUpload={(file) =>
                  onUploadImage("hero_logo_url", file, (url) =>
                    onChange({ ...cms, heroLogoUrl: url })
                  )
                }
              />
              <CmsImageField
                label="Ticket Stub Background URL"
                value={cms.ticketBgUrl}
                uploading={uploadingKey === "ticket_bg_url"}
                onChange={(v) => onChange({ ...cms, ticketBgUrl: v })}
                onUpload={(file) =>
                  onUploadImage("ticket_bg_url", file, (url) =>
                    onChange({ ...cms, ticketBgUrl: url })
                  )
                }
              />
            </div>
          </div>

          {/* Storytelling & Vision */}
          <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
              Event Summary #1 (Upper Overview) &amp; Event Summary #2 (About Summit)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsTextInput
                label="Story Eyebrow"
                value={cms.landing.storyEyebrow}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, storyEyebrow: v } })
                }
              />
              <CmsTextInput
                label="Story Heading"
                value={cms.landing.storyTitle}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, storyTitle: v } })
                }
              />
            </div>
            <CmsTextArea
              label="Story Lead Paragraph"
              rows={2}
              value={cms.landing.storyLead}
              onChange={(v) =>
                onChange({ ...cms, landing: { ...cms.landing, storyLead: v } })
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cms.landing.storyPillars.map((pillar, idx) => (
                <div
                  key={pillar.id || idx}
                  className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
                >
                  <CmsTextInput
                    label={`Pillar ${idx + 1} Tag`}
                    value={pillar.tag}
                    onChange={(v) =>
                      onChange({
                        ...cms,
                        landing: {
                          ...cms.landing,
                          storyPillars: cms.landing.storyPillars.map((p, i) =>
                            i === idx ? { ...p, tag: v } : p
                          ),
                        },
                      })
                    }
                    mono
                  />
                  <CmsTextInput
                    label="Title"
                    value={pillar.title}
                    onChange={(v) =>
                      onChange({
                        ...cms,
                        landing: {
                          ...cms.landing,
                          storyPillars: cms.landing.storyPillars.map((p, i) =>
                            i === idx ? { ...p, title: v } : p
                          ),
                        },
                      })
                    }
                  />
                  <CmsTextArea
                    label="Description"
                    rows={3}
                    value={pillar.description}
                    onChange={(v) =>
                      onChange({
                        ...cms,
                        landing: {
                          ...cms.landing,
                          storyPillars: cms.landing.storyPillars.map((p, i) =>
                            i === idx ? { ...p, description: v } : p
                          ),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <CmsTextInput
                label="About Section Eyebrow"
                value={cms.landing.aboutEyebrow}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, aboutEyebrow: v } })
                }
              />
              <CmsTextInput
                label="About Section Heading"
                value={cms.landing.aboutTitle}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, aboutTitle: v } })
                }
              />
            </div>
            <CmsTextArea
              label="About Section Story Copy"
              rows={3}
              value={cms.landing.aboutText}
              onChange={(v) =>
                onChange({ ...cms, landing: { ...cms.landing, aboutText: v } })
              }
            />
            <CmsTextArea
              label="Attendee Experience Highlights (one bullet per line)"
              rows={4}
              value={cms.landing.experienceBullets.join("\n")}
              onChange={(v) =>
                onChange({
                  ...cms,
                  landing: {
                    ...cms.landing,
                    experienceBullets: v
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </div>

          {/* Metrics Strip, Certificate Spotlight & Final CTA */}
          <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
              Metrics Strip, Certificate Spotlight &amp; Final CTA
            </h3>
            <CmsTextArea
              label="Homepage 6-Column Highlights (Format: Value | Label per line)"
              rows={6}
              mono
              value={cms.highlights.map((h) => `${h.value} | ${h.label}`).join("\n")}
              onChange={(v) =>
                onChange({
                  ...cms,
                  highlights: v
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const [val, lbl] = line.split("|").map((s) => s.trim());
                      return { value: val || "—", label: lbl || "Metric" };
                    }),
                })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CmsTextInput
                label="Certificate Badge"
                value={cms.landing.certificateBadge}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    landing: { ...cms.landing, certificateBadge: v },
                  })
                }
              />
              <div className="sm:col-span-2">
                <CmsTextInput
                  label="Certificate Card Title"
                  value={cms.landing.certificateTitle}
                  onChange={(v) =>
                    onChange({
                      ...cms,
                      landing: { ...cms.landing, certificateTitle: v },
                    })
                  }
                />
              </div>
            </div>
            <CmsTextArea
              label="Certificate Card Description"
              rows={2}
              value={cms.landing.certificateDescription}
              onChange={(v) =>
                onChange({
                  ...cms,
                  landing: { ...cms.landing, certificateDescription: v },
                })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <CmsTextInput
                label="Final CTA Title"
                value={cms.landing.ctaTitle}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, ctaTitle: v } })
                }
              />
              <CmsTextInput
                label="Final CTA Button"
                value={cms.landing.ctaButtonLabel}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, ctaButtonLabel: v } })
                }
              />
            </div>
            <CmsTextArea
              label="Final CTA Description"
              rows={2}
              value={cms.landing.ctaDescription}
              onChange={(v) =>
                onChange({ ...cms, landing: { ...cms.landing, ctaDescription: v } })
              }
            />
          </div>
        </div>
      )}

      {/* TAB 2: 8-PHOTO GALLERY */}
      {subTab === "gallery" && (
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
            8-Image Event Photo Gallery
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CmsTextInput
              label="Gallery Eyebrow"
              value={cms.landing.galleryEyebrow}
              onChange={(v) =>
                onChange({ ...cms, landing: { ...cms.landing, galleryEyebrow: v } })
              }
            />
            <div className="sm:col-span-2">
              <CmsTextInput
                label="Gallery Section Heading"
                value={cms.landing.galleryTitle}
                onChange={(v) =>
                  onChange({ ...cms, landing: { ...cms.landing, galleryTitle: v } })
                }
              />
            </div>
          </div>
          <CmsTextInput
            label="Gallery Subtitle"
            value={cms.landing.gallerySubtitle}
            onChange={(v) =>
              onChange({ ...cms, landing: { ...cms.landing, gallerySubtitle: v } })
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cms.gallery.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-3"
              >
                <div className="text-xs font-mono font-bold text-[#F59E0B]">
                  Gallery Image #{idx + 1}
                </div>
                <CmsImageField
                  label="Image Upload / URL"
                  value={item.url}
                  uploading={uploadingKey === `gallery_image_${idx + 1}`}
                  onChange={(url) =>
                    onChange({
                      ...cms,
                      gallery: cms.gallery.map((g, i) =>
                        i === idx ? { ...g, url } : g
                      ),
                    })
                  }
                  onUpload={(file) =>
                    onUploadImage(`gallery_image_${idx + 1}`, file, (url) =>
                      onChange({
                        ...cms,
                        gallery: cms.gallery.map((g, i) =>
                          i === idx ? { ...g, url } : g
                        ),
                      })
                    )
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CmsTextInput
                    label="Caption Overlay"
                    value={item.caption}
                    onChange={(caption) =>
                      onChange({
                        ...cms,
                        gallery: cms.gallery.map((g, i) =>
                          i === idx ? { ...g, caption } : g
                        ),
                      })
                    }
                  />
                  <CmsTextInput
                    label="Alt Description"
                    value={item.alt}
                    onChange={(alt) =>
                      onChange({
                        ...cms,
                        gallery: cms.gallery.map((g, i) =>
                          i === idx ? { ...g, alt } : g
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DUAL-HALL AGENDA */}
      {subTab === "agenda" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
              Agenda Section Heading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CmsTextInput
                label="Eyebrow"
                value={cms.agenda.eyebrow}
                onChange={(v) =>
                  onChange({ ...cms, agenda: { ...cms.agenda, eyebrow: v } })
                }
              />
              <div className="sm:col-span-2">
                <CmsTextInput
                  label="Section Title"
                  value={cms.agenda.title}
                  onChange={(v) =>
                    onChange({ ...cms, agenda: { ...cms.agenda, title: v } })
                  }
                />
              </div>
            </div>
            <CmsTextInput
              label="Section Subtitle"
              value={cms.agenda.subtitle}
              onChange={(v) =>
                onChange({ ...cms, agenda: { ...cms.agenda, subtitle: v } })
              }
            />
          </div>

          <WireframeAgendaEditor
            agenda={cms.agenda}
            onChange={(nextAgenda) => onChange({ ...cms, agenda: nextAgenda })}
          />
        </div>
      )}

      {/* TAB 4: DYNAMIC FORM BUILDER */}
      {subTab === "form" && (
        <FormBuilderSection
          form={cms.form}
          onChange={(nextForm) => onChange({ ...cms, form: nextForm })}
        />
      )}

      {/* TAB 5: POST-REGISTRATION & SOCIAL */}
      {subTab === "confirmation" && (
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
            Post-Registration Ticket Screen &amp; LinkedIn Share Config
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CmsTextInput
              label="Confirmation Badge"
              value={cms.confirmation.badgeLabel}
              onChange={(v) =>
                onChange({
                  ...cms,
                  confirmation: { ...cms.confirmation, badgeLabel: v },
                })
              }
            />
            <div className="sm:col-span-2">
              <CmsTextInput
                label="Main Welcome Heading"
                value={cms.confirmation.heading}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    confirmation: { ...cms.confirmation, heading: v },
                  })
                }
              />
            </div>
          </div>

          <CmsTextArea
            label="Subheading (Follows 'Congratulations <Name>.')"
            rows={2}
            value={cms.confirmation.subheading}
            onChange={(v) =>
              onChange({
                ...cms,
                confirmation: { ...cms.confirmation, subheading: v },
              })
            }
          />

          {/* Separate Private Post-Registration WhatsApp Setting */}
          <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/35 space-y-3">
            <div className="text-xs font-mono font-bold text-emerald-300 uppercase">
              Post-Registration Attendee WhatsApp Group (Never shown in public footer)
            </div>
            <CmsTextInput
              label="postRegistrationWhatsappUrl (Invite URL)"
              value={cms.confirmation.postRegistrationWhatsappUrl}
              onChange={(v) =>
                onChange({
                  ...cms,
                  confirmation: {
                    ...cms.confirmation,
                    postRegistrationWhatsappUrl: v,
                  },
                })
              }
              mono
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CmsTextInput
                label="Banner Pill Label"
                value={cms.confirmation.whatsappBadge}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    confirmation: { ...cms.confirmation, whatsappBadge: v },
                  })
                }
              />
              <CmsTextInput
                label="Banner Title"
                value={cms.confirmation.whatsappTitle}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    confirmation: { ...cms.confirmation, whatsappTitle: v },
                  })
                }
              />
              <CmsTextInput
                label="Button Text"
                value={cms.confirmation.whatsappButtonLabel}
                onChange={(v) =>
                  onChange({
                    ...cms,
                    confirmation: { ...cms.confirmation, whatsappButtonLabel: v },
                  })
                }
              />
            </div>
            <CmsTextArea
              label="WhatsApp Banner Description"
              rows={2}
              value={cms.confirmation.whatsappDescription}
              onChange={(v) =>
                onChange({
                  ...cms,
                  confirmation: { ...cms.confirmation, whatsappDescription: v },
                })
              }
            />
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <CmsTextInput
              label="Admission Checklist Title"
              value={cms.confirmation.checklistTitle}
              onChange={(v) =>
                onChange({
                  ...cms,
                  confirmation: { ...cms.confirmation, checklistTitle: v },
                })
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {cms.confirmation.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2"
                >
                  <div className="text-[11px] font-mono text-[#F59E0B] font-bold">
                    Checklist Item #{idx + 1}
                  </div>
                  <CmsTextInput
                    label="Title"
                    value={item.title}
                    onChange={(title) =>
                      onChange({
                        ...cms,
                        confirmation: {
                          ...cms.confirmation,
                          checklist: cms.confirmation.checklist.map((c, i) =>
                            i === idx ? { ...c, title } : c
                          ),
                        },
                      })
                    }
                  />
                  <CmsTextArea
                    label="Description"
                    rows={3}
                    value={item.description}
                    onChange={(description) =>
                      onChange({
                        ...cms,
                        confirmation: {
                          ...cms.confirmation,
                          checklist: cms.confirmation.checklist.map((c, i) =>
                            i === idx ? { ...c, description } : c
                          ),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <CmsTextArea
            label="LinkedIn Pre-Filled Share Post Text"
            rows={5}
            value={cms.confirmation.linkedinCaption}
            onChange={(v) =>
              onChange({
                ...cms,
                confirmation: { ...cms.confirmation, linkedinCaption: v },
              })
            }
          />
          <CmsTextArea
            label="OG Card / Attending Metrics (Format: Value | Label per line)"
            rows={6}
            mono
            value={cms.confirmation.ogHighlightsText}
            onChange={(v) =>
              onChange({
                ...cms,
                confirmation: { ...cms.confirmation, ogHighlightsText: v },
              })
            }
          />
        </div>
      )}

      {/* TAB 6: FOOTER & CHAPTER SOCIAL LINKS */}
      {subTab === "footer" && (
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
            Footer Branding, Chapter Portal &amp; Social Media Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CmsTextInput
              label="Brand Title"
              value={cms.footer.brandTitle}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, brandTitle: v } })
              }
            />
            <CmsTextInput
              label="Chapter Name"
              value={cms.footer.chapterName}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, chapterName: v } })
              }
            />
            <CmsTextInput
              label="Footer Tagline"
              value={cms.footer.tagline}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, tagline: v } })
              }
            />
          </div>

          <CmsTextArea
            label="Footer Chapter Bio"
            rows={2}
            value={cms.footer.bio}
            onChange={(v) =>
              onChange({ ...cms, footer: { ...cms.footer, bio: v } })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsTextInput
              label="Event Date & Venue Badge"
              value={cms.footer.eventMeta}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, eventMeta: v } })
              }
            />
            <CmsTextInput
              label="Copyright Notice"
              value={cms.footer.copyrightText}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, copyrightText: v } })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <CmsTextInput
              label="Chapter Portal Button Label"
              value={cms.footer.portalLabel}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, portalLabel: v } })
              }
            />
            <CmsTextInput
              label="Chapter Portal URL"
              value={cms.footer.portalUrl}
              onChange={(v) =>
                onChange({ ...cms, footer: { ...cms.footer, portalUrl: v } })
              }
              mono
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase">
                Public Social Links (WhatsApp attendee invite kept separate in Confirmation tab)
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...cms,
                    footer: {
                      ...cms.footer,
                      socialLinks: [
                        ...cms.footer.socialLinks,
                        {
                          id: `soc-${Date.now()}`,
                          platform: "website",
                          label: "New Link",
                          url: "https://",
                          enabled: true,
                        },
                      ],
                    },
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#15304B] border border-slate-700 hover:border-[#F59E0B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F59E0B]" /> Add Social Link
              </button>
            </div>

            <div className="space-y-3">
              {cms.footer.socialLinks.map((soc, idx) => (
                <div
                  key={soc.id || idx}
                  className="p-3.5 rounded-xl bg-[#0A192A] border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                >
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Platform
                    </label>
                    <select
                      value={soc.platform}
                      onChange={(e) =>
                        onChange({
                          ...cms,
                          footer: {
                            ...cms.footer,
                            socialLinks: cms.footer.socialLinks.map((s, i) =>
                              i === idx
                                ? { ...s, platform: e.target.value as SocialPlatform }
                                : s
                            ),
                          },
                        })
                      }
                      className="h-10 px-2.5 rounded-xl bg-[#15304B] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#D97706]"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <CmsTextInput
                      label="Label"
                      value={soc.label}
                      onChange={(label) =>
                        onChange({
                          ...cms,
                          footer: {
                            ...cms.footer,
                            socialLinks: cms.footer.socialLinks.map((s, i) =>
                              i === idx ? { ...s, label } : s
                            ),
                          },
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-5">
                    <CmsTextInput
                      label="URL / mailto:"
                      value={soc.url}
                      onChange={(url) =>
                        onChange({
                          ...cms,
                          footer: {
                            ...cms.footer,
                            socialLinks: cms.footer.socialLinks.map((s, i) =>
                              i === idx ? { ...s, url } : s
                            ),
                          },
                        })
                      }
                      mono
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between gap-2 h-10">
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={soc.enabled}
                        onChange={(e) =>
                          onChange({
                            ...cms,
                            footer: {
                              ...cms.footer,
                              socialLinks: cms.footer.socialLinks.map((s, i) =>
                                i === idx ? { ...s, enabled: e.target.checked } : s
                              ),
                            },
                          })
                        }
                        className="rounded border-slate-600 text-[#D97706]"
                      />
                      Show
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...cms,
                          footer: {
                            ...cms.footer,
                            socialLinks: cms.footer.socialLinks.filter(
                              (_, i) => i !== idx
                            ),
                          },
                        })
                      }
                      className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15 cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
