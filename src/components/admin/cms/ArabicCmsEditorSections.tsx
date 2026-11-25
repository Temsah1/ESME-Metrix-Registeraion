"use client";

import React from "react";
import { DEFAULT_ARABIC_CMS } from "@/lib/cms/arabic";
import type {
  ArabicCmsData,
  ArabicCmsSessionCopy,
  FullCmsData,
  RegistrationFormConfig,
} from "@/lib/cms/types";
import { CmsTextArea, CmsTextInput } from "@/components/admin/cms/CmsFormFields";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type CmsSectionTab =
  | "landing"
  | "gallery"
  | "agenda"
  | "form"
  | "confirmation"
  | "footer";

const AR_FIELD_META: Array<{
  key: Exclude<keyof RegistrationFormConfig["fields"], "isEsmeMember">;
  enLabel: string;
}> = [
  { key: "fullName", enLabel: "Full Name" },
  { key: "nationalId", enLabel: "National ID (14 digits)" },
  { key: "phone", enLabel: "Phone Number" },
  { key: "email", enLabel: "Email Address" },
  { key: "city", enLabel: "City of Residence" },
  { key: "university", enLabel: "University" },
  { key: "faculty", enLabel: "Faculty / Major Category" },
  { key: "department", enLabel: "Department / Specialization" },
  { key: "customMajor", enLabel: "Custom Major Input" },
  { key: "academicYear", enLabel: "Academic Year" },
  { key: "graduationYear", enLabel: "Graduation Year" },
  { key: "jobTitle", enLabel: "Job Title" },
  { key: "company", enLabel: "Company / Organization" },
  { key: "committee", enLabel: "Committee" },
  { key: "idPhotoUrl", enLabel: "National ID Card (Front)" },
  { key: "avatarUrl", enLabel: "Profile Photo (For Event Badge)" },
];

export default function ArabicCmsEditorSections({
  subTab,
  cms,
  onChange,
}: {
  subTab: CmsSectionTab;
  cms: FullCmsData;
  onChange: (next: FullCmsData) => void;
}) {
  const { lang } = useLanguage();
  const ar: ArabicCmsData = cms.ar ?? DEFAULT_ARABIC_CMS;

  const patchAr = (updater: (prev: ArabicCmsData) => ArabicCmsData) => {
    onChange({
      ...cms,
      ar: updater(cms.ar ?? DEFAULT_ARABIC_CMS),
    });
  };

  if (subTab === "landing") {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            {lang === "ar"
              ? "البيانات الأساسية والواجهة الرئيسية (النسخة العربية)"
              : "Hero & Event Metadata (Arabic)"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CmsTextInput
              label="موعد الملتقى"
              value={ar.eventDate}
              onChange={(v) => patchAr((prev) => ({ ...prev, eventDate: v }))}
            />
            <CmsTextInput
              label="مقر الانعقاد"
              value={ar.eventVenue}
              onChange={(v) => patchAr((prev) => ({ ...prev, eventVenue: v }))}
            />
            <CmsTextInput
              label="عرض التوقيت"
              value={ar.eventTime}
              onChange={(v) => patchAr((prev) => ({ ...prev, eventTime: v }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CmsTextInput
              label="شارة الحالة"
              value={ar.landing.statusBadge}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, statusBadge: v },
                }))
              }
            />
            <CmsTextInput
              label="عنوان الهيرو الرئيسي"
              value={ar.landing.titleLine1}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, titleLine1: v },
                }))
              }
            />
            <CmsTextInput
              label="الاسم المميّز"
              value={ar.landing.titleHighlight}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, titleHighlight: v },
                }))
              }
            />
          </div>

          <CmsTextArea
            label="الوصف الترحيبي (Hero Subtitle)"
            rows={2}
            value={ar.landing.subtitle}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, subtitle: v },
              }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsTextInput
              label="زر التسجيل الرئيسي"
              value={ar.landing.primaryCtaLabel}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, primaryCtaLabel: v },
                }))
              }
            />
            <CmsTextInput
              label="الزر الثانوي"
              value={ar.landing.secondaryCtaLabel}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, secondaryCtaLabel: v },
                }))
              }
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            {lang === "ar"
              ? "ملخص الملتقى الأول والثاني والشهادة المعتمدة"
              : "Story Pillars, About Summit & Certificate (Arabic)"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsTextInput
              label="العنوان العلوي للقصة"
              value={ar.landing.storyEyebrow}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, storyEyebrow: v },
                }))
              }
            />
            <CmsTextInput
              label="عنوان قسم ما هو ESME METRIX"
              value={ar.landing.storyTitle}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, storyTitle: v },
                }))
              }
            />
          </div>
          <CmsTextArea
            label="النص الرئيسي للقصة"
            rows={2}
            value={ar.landing.storyLead}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, storyLead: v },
              }))
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ar.landing.storyPillars.map((pillar, idx) => (
              <div
                key={pillar.id || idx}
                className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
              >
                <CmsTextInput
                  label={`الوسم #${idx + 1}`}
                  value={pillar.tag}
                  onChange={(v) =>
                    patchAr((prev) => ({
                      ...prev,
                      landing: {
                        ...prev.landing,
                        storyPillars: prev.landing.storyPillars.map((p, i) =>
                          i === idx ? { ...p, tag: v } : p
                        ),
                      },
                    }))
                  }
                />
                <CmsTextInput
                  label="العنوان"
                  value={pillar.title}
                  onChange={(v) =>
                    patchAr((prev) => ({
                      ...prev,
                      landing: {
                        ...prev.landing,
                        storyPillars: prev.landing.storyPillars.map((p, i) =>
                          i === idx ? { ...p, title: v } : p
                        ),
                      },
                    }))
                  }
                />
                <CmsTextArea
                  label="الوصف"
                  rows={3}
                  value={pillar.description}
                  onChange={(v) =>
                    patchAr((prev) => ({
                      ...prev,
                      landing: {
                        ...prev.landing,
                        storyPillars: prev.landing.storyPillars.map((p, i) =>
                          i === idx ? { ...p, description: v } : p
                        ),
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <CmsTextInput
              label="عنوان فرعي — عن الملتقى"
              value={ar.landing.aboutEyebrow}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, aboutEyebrow: v },
                }))
              }
            />
            <CmsTextInput
              label="عنوان قسم عن الملتقى"
              value={ar.landing.aboutTitle}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, aboutTitle: v },
                }))
              }
            />
          </div>
          <CmsTextArea
            label="فقرة تعريف الملتقى"
            rows={3}
            value={ar.landing.aboutText}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, aboutText: v },
              }))
            }
          />
          <CmsTextArea
            label="أبرز مميزات الحضور (نقطة في كل سطر)"
            rows={4}
            value={ar.landing.experienceBullets.join("\n")}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: {
                  ...prev.landing,
                  experienceBullets: v
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                },
              }))
            }
          />

          <CmsTextArea
            label="شريط الأرقام الإحصائية (الصيغة: القيمة | الوصف في كل سطر)"
            rows={6}
            value={ar.highlights.map((h) => `${h.value} | ${h.label}`).join("\n")}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                highlights: v
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [val, lbl] = line.split("|").map((s) => s.trim());
                    return { value: val || "—", label: lbl || "مؤشر" };
                  }),
              }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <CmsTextInput
              label="شارة الشهادة"
              value={ar.landing.certificateBadge}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, certificateBadge: v },
                }))
              }
            />
            <div className="sm:col-span-2">
              <CmsTextInput
                label="عنوان بطاقة الشهادة"
                value={ar.landing.certificateTitle}
                onChange={(v) =>
                  patchAr((prev) => ({
                    ...prev,
                    landing: { ...prev.landing, certificateTitle: v },
                  }))
                }
              />
            </div>
          </div>
          <CmsTextArea
            label="وصف بطاقة الشهادة"
            rows={2}
            value={ar.landing.certificateDescription}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, certificateDescription: v },
              }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <CmsTextInput
              label="عنوان الدعوة الختامية للتسجيل"
              value={ar.landing.ctaTitle}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, ctaTitle: v },
                }))
              }
            />
            <CmsTextInput
              label="نص زر الدعوة الختامية"
              value={ar.landing.ctaButtonLabel}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, ctaButtonLabel: v },
                }))
              }
            />
          </div>
          <CmsTextArea
            label="وصف الدعوة الختامية"
            rows={2}
            value={ar.landing.ctaDescription}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, ctaDescription: v },
              }))
            }
          />
        </div>
      </div>
    );
  }

  if (subTab === "gallery") {
    return (
      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-5" dir="rtl">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          نصوص معرض الصور الـ 8 (النسخة العربية)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CmsTextInput
            label="العنوان العلوي للمعرض"
            value={ar.landing.galleryEyebrow}
            onChange={(v) =>
              patchAr((prev) => ({
                ...prev,
                landing: { ...prev.landing, galleryEyebrow: v },
              }))
            }
          />
          <div className="sm:col-span-2">
            <CmsTextInput
              label="عنوان قسم المعرض"
              value={ar.landing.galleryTitle}
              onChange={(v) =>
                patchAr((prev) => ({
                  ...prev,
                  landing: { ...prev.landing, galleryTitle: v },
                }))
              }
            />
          </div>
        </div>
        <CmsTextInput
          label="وصف المعرض"
          value={ar.landing.gallerySubtitle}
          onChange={(v) =>
            patchAr((prev) => ({
              ...prev,
              landing: { ...prev.landing, gallerySubtitle: v },
            }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cms.gallery.map((item, idx) => {
            const arItem =
              ar.gallery.find((g) => g.id === item.id) ??
              ar.gallery[idx] ?? {
                id: item.id,
                caption: item.caption,
                alt: item.alt,
              };

            const updateGalleryAr = (patch: Partial<{ caption: string; alt: string }>) => {
              patchAr((prev) => {
                const exists = prev.gallery.some((g) => g.id === item.id);
                const nextList = exists
                  ? prev.gallery.map((g) => (g.id === item.id ? { ...g, ...patch } : g))
                  : [...prev.gallery, { id: item.id, caption: arItem.caption, alt: arItem.alt, ...patch }];
                return { ...prev, gallery: nextList };
              });
            };

            return (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
              >
                <div className="text-xs font-bold text-[#F59E0B]">
                  صورة المعرض #{idx + 1} — <span dir="ltr" className="text-slate-400 font-normal">{item.caption}</span>
                </div>
                <CmsTextInput
                  label="التعليق العربي على الصورة"
                  value={arItem.caption}
                  onChange={(caption) => updateGalleryAr({ caption })}
                />
                <CmsTextInput
                  label="النص البديل (Alt)"
                  value={arItem.alt}
                  onChange={(alt) => updateGalleryAr({ alt })}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (subTab === "agenda") {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            عناوين جدول الفعاليات والقاعات (النسخة العربية)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CmsTextInput
              label="العنوان العلوي"
              value={ar.agenda.eyebrow}
              onChange={(v) =>
                patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, eyebrow: v } }))
              }
            />
            <div className="sm:col-span-2">
              <CmsTextInput
                label="عنوان الجدول الرئيسي"
                value={ar.agenda.title}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, title: v } }))
                }
              />
            </div>
          </div>
          <CmsTextInput
            label="وصف الجدول"
            value={ar.agenda.subtitle}
            onChange={(v) =>
              patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, subtitle: v } }))
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
              <CmsTextInput
                label="اسم القاعة الأولى"
                value={ar.agenda.hall1Name}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall1Name: v } }))
                }
              />
              <CmsTextInput
                label="السعة (القاعة الأولى)"
                value={ar.agenda.hall1Capacity}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall1Capacity: v } }))
                }
              />
              <CmsTextInput
                label="وصف القاعة الأولى"
                value={ar.agenda.hall1Subtitle}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall1Subtitle: v } }))
                }
              />
            </div>
            <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 space-y-2.5">
              <CmsTextInput
                label="اسم القاعة الثانية"
                value={ar.agenda.hall2Name}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall2Name: v } }))
                }
              />
              <CmsTextInput
                label="السعة (القاعة الثانية)"
                value={ar.agenda.hall2Capacity}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall2Capacity: v } }))
                }
              />
              <CmsTextInput
                label="وصف القاعة الثانية"
                value={ar.agenda.hall2Subtitle}
                onChange={(v) =>
                  patchAr((prev) => ({ ...prev, agenda: { ...prev.agenda, hall2Subtitle: v } }))
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            ترجمة وتعديل جلسات الأجندة بالعربية
          </h3>
          <div className="space-y-4">
            {[...cms.agenda.sessions]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((session) => {
                const arSession: ArabicCmsSessionCopy =
                  ar.agenda.sessions[session.id] ?? {
                    time: session.time,
                    title: "",
                    speaker: "",
                    role: "",
                    tag: "",
                    description: "",
                  };

                const updateSessionAr = (patch: Partial<ArabicCmsSessionCopy>) => {
                  patchAr((prev) => ({
                    ...prev,
                    agenda: {
                      ...prev.agenda,
                      sessions: {
                        ...prev.agenda.sessions,
                        [session.id]: { ...arSession, ...patch },
                      },
                    },
                  }));
                };

                return (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-[#F59E0B]">{session.hallType.toUpperCase()}</span>
                      <span dir="ltr" className="text-slate-400 font-mono">
                        EN: {session.title}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <CmsTextInput
                        label="التوقيت بالعربية"
                        value={arSession.time || ""}
                        onChange={(time) => updateSessionAr({ time })}
                      />
                      <div className="sm:col-span-2">
                        <CmsTextInput
                          label="عنوان الجلسة بالعربية"
                          value={arSession.title}
                          onChange={(title) => updateSessionAr({ title })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <CmsTextInput
                        label="المتحدث"
                        value={arSession.speaker}
                        onChange={(speaker) => updateSessionAr({ speaker })}
                      />
                      <CmsTextInput
                        label="الصفة / المنصب"
                        value={arSession.role}
                        onChange={(role) => updateSessionAr({ role })}
                      />
                      <CmsTextInput
                        label="التصنيف"
                        value={arSession.tag}
                        onChange={(tag) => updateSessionAr({ tag })}
                      />
                    </div>
                    <CmsTextArea
                      label="وصف الجلسة بالعربية"
                      rows={2}
                      value={arSession.description}
                      onChange={(description) => updateSessionAr({ description })}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  if (subTab === "form") {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            إعدادات شريط الشهادة وخطوات التسجيل (النسخة العربية)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CmsTextInput
              label="شارة الشهادة"
              value={ar.form.bannerBadge}
              onChange={(bannerBadge) =>
                patchAr((prev) => ({ ...prev, form: { ...prev.form, bannerBadge } }))
              }
            />
            <CmsTextInput
              label="عنوان الشهادة"
              value={ar.form.bannerTitle}
              onChange={(bannerTitle) =>
                patchAr((prev) => ({ ...prev, form: { ...prev.form, bannerTitle } }))
              }
            />
          </div>
          <CmsTextArea
            label="وصف الشهادة في صفحة التسجيل"
            rows={2}
            value={ar.form.bannerDescription}
            onChange={(bannerDescription) =>
              patchAr((prev) => ({ ...prev, form: { ...prev.form, bannerDescription } }))
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CmsTextArea
              label="نص الموافقة والإقرار (الخطوة 4)"
              rows={2}
              value={ar.form.termsLabel}
              onChange={(termsLabel) =>
                patchAr((prev) => ({ ...prev, form: { ...prev.form, termsLabel } }))
              }
            />
            <CmsTextInput
              label="نص زر تأكيد التسجيل"
              value={ar.form.submitButtonLabel}
              onChange={(submitButtonLabel) =>
                patchAr((prev) => ({ ...prev, form: { ...prev.form, submitButtonLabel } }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {(["step1", "step2", "step3", "step4"] as const).map((stepKey, idx) => (
              <div
                key={stepKey}
                className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
              >
                <div className="text-xs font-bold text-[#F59E0B]">الخطوة #{idx + 1}</div>
                <CmsTextInput
                  label="اسم المرحلة المختصر"
                  value={ar.form.steps[stepKey].navLabel}
                  onChange={(navLabel) =>
                    patchAr((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        steps: {
                          ...prev.form.steps,
                          [stepKey]: { ...prev.form.steps[stepKey], navLabel },
                        },
                      },
                    }))
                  }
                />
                <CmsTextInput
                  label="عنوان المرحلة"
                  value={ar.form.steps[stepKey].title}
                  onChange={(title) =>
                    patchAr((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        steps: {
                          ...prev.form.steps,
                          [stepKey]: { ...prev.form.steps[stepKey], title },
                        },
                      },
                    }))
                  }
                />
                <CmsTextInput
                  label="الوصف"
                  value={ar.form.steps[stepKey].subtitle}
                  onChange={(subtitle) =>
                    patchAr((prev) => ({
                      ...prev,
                      form: {
                        ...prev.form,
                        steps: {
                          ...prev.form.steps,
                          [stepKey]: { ...prev.form.steps[stepKey], subtitle },
                        },
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            عناوين الحقول والنصوص التوضيحية بالعربية
          </h3>
          <div className="p-4 rounded-xl bg-[#0A192A] border border-[#D97706]/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CmsTextInput
              label="سؤال عضوية ESME"
              value={ar.form.fields.isEsmeMember.label}
              onChange={(label) =>
                patchAr((prev) => ({
                  ...prev,
                  form: {
                    ...prev.form,
                    fields: {
                      ...prev.form.fields,
                      isEsmeMember: { ...prev.form.fields.isEsmeMember, label },
                    },
                  },
                }))
              }
            />
            <CmsTextInput
              label="خيار نعم"
              value={ar.form.fields.isEsmeMember.yesLabel || ""}
              onChange={(yesLabel) =>
                patchAr((prev) => ({
                  ...prev,
                  form: {
                    ...prev.form,
                    fields: {
                      ...prev.form.fields,
                      isEsmeMember: { ...prev.form.fields.isEsmeMember, yesLabel },
                    },
                  },
                }))
              }
            />
            <CmsTextInput
              label="خيار لا"
              value={ar.form.fields.isEsmeMember.noLabel || ""}
              onChange={(noLabel) =>
                patchAr((prev) => ({
                  ...prev,
                  form: {
                    ...prev.form,
                    fields: {
                      ...prev.form.fields,
                      isEsmeMember: { ...prev.form.fields.isEsmeMember, noLabel },
                    },
                  },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AR_FIELD_META.map(({ key, enLabel }) => {
              const cfg = ar.form.fields[key] ?? { label: "", placeholder: "", helperText: "" };
              return (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
                >
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{enLabel}</span>
                  </div>
                  <CmsTextInput
                    label="اسم الحقل بالعربية"
                    value={cfg.label}
                    onChange={(label) =>
                      patchAr((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          fields: {
                            ...prev.form.fields,
                            [key]: { ...cfg, label },
                          },
                        },
                      }))
                    }
                  />
                  <CmsTextInput
                    label="النص الإرشادي داخل الحقل"
                    value={cfg.placeholder || ""}
                    onChange={(placeholder) =>
                      patchAr((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          fields: {
                            ...prev.form.fields,
                            [key]: { ...cfg, placeholder },
                          },
                        },
                      }))
                    }
                  />
                  <CmsTextInput
                    label="نص توضيحي أسفل الحقل (اختياري)"
                    value={cfg.helperText || ""}
                    onChange={(helperText) =>
                      patchAr((prev) => ({
                        ...prev,
                        form: {
                          ...prev.form,
                          fields: {
                            ...prev.form.fields,
                            [key]: { ...cfg, helperText },
                          },
                        },
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (subTab === "confirmation") {
    return (
      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-5" dir="rtl">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          شاشة ما بعد التسجيل ولوحة المشارك (النسخة العربية)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CmsTextInput
            label="شارة التأكيد"
            value={ar.confirmation.badgeLabel}
            onChange={(badgeLabel) =>
              patchAr((prev) => ({ ...prev, confirmation: { ...prev.confirmation, badgeLabel } }))
            }
          />
          <div className="sm:col-span-2">
            <CmsTextInput
              label="عنوان الترحيب الرئيسي"
              value={ar.confirmation.heading}
              onChange={(heading) =>
                patchAr((prev) => ({ ...prev, confirmation: { ...prev.confirmation, heading } }))
              }
            />
          </div>
        </div>
        <CmsTextArea
          label="العنوان الفرعي"
          rows={2}
          value={ar.confirmation.subheading}
          onChange={(subheading) =>
            patchAr((prev) => ({ ...prev, confirmation: { ...prev.confirmation, subheading } }))
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CmsTextInput
            label="شارة الواتساب"
            value={ar.confirmation.whatsappBadge}
            onChange={(whatsappBadge) =>
              patchAr((prev) => ({
                ...prev,
                confirmation: { ...prev.confirmation, whatsappBadge },
              }))
            }
          />
          <CmsTextInput
            label="عنوان جروب الواتساب"
            value={ar.confirmation.whatsappTitle}
            onChange={(whatsappTitle) =>
              patchAr((prev) => ({
                ...prev,
                confirmation: { ...prev.confirmation, whatsappTitle },
              }))
            }
          />
          <CmsTextInput
            label="نص زر الواتساب"
            value={ar.confirmation.whatsappButtonLabel}
            onChange={(whatsappButtonLabel) =>
              patchAr((prev) => ({
                ...prev,
                confirmation: { ...prev.confirmation, whatsappButtonLabel },
              }))
            }
          />
        </div>
        <CmsTextArea
          label="وصف جروب الواتساب"
          rows={2}
          value={ar.confirmation.whatsappDescription}
          onChange={(whatsappDescription) =>
            patchAr((prev) => ({
              ...prev,
              confirmation: { ...prev.confirmation, whatsappDescription },
            }))
          }
        />
        <CmsTextInput
          label="عنوان قائمة التجهيزات"
          value={ar.confirmation.checklistTitle}
          onChange={(checklistTitle) =>
            patchAr((prev) => ({
              ...prev,
              confirmation: { ...prev.confirmation, checklistTitle },
            }))
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ar.confirmation.checklist.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2"
            >
              <CmsTextInput
                label={`بند #${idx + 1} — العنوان`}
                value={item.title}
                onChange={(title) =>
                  patchAr((prev) => ({
                    ...prev,
                    confirmation: {
                      ...prev.confirmation,
                      checklist: prev.confirmation.checklist.map((c, i) =>
                        i === idx ? { ...c, title } : c
                      ),
                    },
                  }))
                }
              />
              <CmsTextArea
                label="الوصف"
                rows={3}
                value={item.description}
                onChange={(description) =>
                  patchAr((prev) => ({
                    ...prev,
                    confirmation: {
                      ...prev.confirmation,
                      checklist: prev.confirmation.checklist.map((c, i) =>
                        i === idx ? { ...c, description } : c
                      ),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
        <CmsTextArea
          label="نص منشور LinkedIn بالعربية"
          rows={5}
          value={ar.confirmation.linkedinCaption}
          onChange={(linkedinCaption) =>
            patchAr((prev) => ({
              ...prev,
              confirmation: { ...prev.confirmation, linkedinCaption },
            }))
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-5" dir="rtl">
      <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
        نصوص التذييل (Footer) بالنسخة العربية
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CmsTextInput
          label="اسم العلامة"
          value={ar.footer.brandTitle}
          onChange={(brandTitle) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, brandTitle } }))
          }
        />
        <CmsTextInput
          label="اسم الشابتر"
          value={ar.footer.chapterName}
          onChange={(chapterName) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, chapterName } }))
          }
        />
        <CmsTextInput
          label="الشعار الجانبي"
          value={ar.footer.tagline}
          onChange={(tagline) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, tagline } }))
          }
        />
      </div>
      <CmsTextArea
        label="نبذة الشابتر بالعربية"
        rows={2}
        value={ar.footer.bio}
        onChange={(bio) =>
          patchAr((prev) => ({ ...prev, footer: { ...prev.footer, bio } }))
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CmsTextInput
          label="شارة التاريخ والمكان"
          value={ar.footer.eventMeta}
          onChange={(eventMeta) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, eventMeta } }))
          }
        />
        <CmsTextInput
          label="نص زر منصة الشابتر"
          value={ar.footer.portalLabel}
          onChange={(portalLabel) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, portalLabel } }))
          }
        />
        <CmsTextInput
          label="حقوق النشر"
          value={ar.footer.copyrightText}
          onChange={(copyrightText) =>
            patchAr((prev) => ({ ...prev, footer: { ...prev.footer, copyrightText } }))
          }
        />
      </div>
    </div>
  );
}
