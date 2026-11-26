"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { DEFAULT_ARABIC_CMS } from "@/lib/cms/arabic";
import {
  DEFAULT_EVENT_STATS,
  type AgendaHallType,
  type AgendaSession,
  type DualHallAgendaConfig,
  type EventStatItem,
  type FormFieldConfig,
  type FullCmsData,
  type RegistrationFormConfig,
} from "@/lib/cms/types";

export function CmsTextInput({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 px-3.5 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none transition-colors ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

export function CmsTextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none transition-colors leading-relaxed ${
          mono ? "font-mono" : ""
        }`}
      />
    </div>
  );
}

export function CmsImageField({
  label,
  value,
  uploading,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onChange: (val: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-24 h-16 rounded-xl bg-[#15304B] border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-[10px] text-slate-500">No image</span>
          )}
        </div>

        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 h-10 px-3.5 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none font-mono"
          />

          <label className="px-3.5 h-10 rounded-xl bg-[#1D3046] hover:bg-[#D97706]/20 border border-slate-700 hover:border-[#D97706] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[#D97706]" /> Upload
              </>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

const HALL_TYPE_BADGES: Record<AgendaHallType, { label: string; border: string; pill: string }> = {
  shared: {
    label: "Shared Plenary (Full-Width Green)",
    border: "border-emerald-500/45",
    pill: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  },
  hall1: {
    label: "Hall 1 (Left • Green • 250 Cap)",
    border: "border-emerald-500/35",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
  },
  hall2: {
    label: "Hall 2 (Right • Orange • 150 Cap)",
    border: "border-orange-500/40",
    pill: "bg-orange-500/15 text-orange-300 border-orange-500/35",
  },
};

const createNewSession = (hallType: AgendaHallType, sortOrder: number): AgendaSession => {
  const titleDefaults: Record<AgendaHallType, string> = {
    shared: "New Shared Plenary Session",
    hall1: "New Hall 1 Keynote / Session",
    hall2: "New Hall 2 Workshop / Talk",
  };
  const uid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : `${sortOrder}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id: `${hallType}-${uid}`,
    hallType,
    sortOrder,
    time: "12:00 PM – 01:00 PM",
    title: titleDefaults[hallType],
    speaker: "Speaker Name",
    role: hallType === "shared" ? "Shared Plenary • All Attendees" : "Speaker Role / Org",
    tag: hallType === "shared" ? "Shared Plenary" : "Session",
    description: "Short session overview for attendees and member dashboard.",
  };
};

export function WireframeAgendaEditor({
  agenda,
  onChange,
}: {
  agenda: DualHallAgendaConfig;
  onChange: (next: DualHallAgendaConfig) => void;
}) {
  const sorted = [...agenda.sessions].sort((a, b) => a.sortOrder - b.sortOrder);

  const updateSession = (id: string, patch: Partial<AgendaSession>) => {
    onChange({
      ...agenda,
      sessions: agenda.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const moveSession = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= sorted.length) return;
    const copy = [...sorted];
    const [removed] = copy.splice(idx, 1);
    copy.splice(target, 0, removed);
    onChange({
      ...agenda,
      sessions: copy.map((item, i) => ({ ...item, sortOrder: i + 1 })),
    });
  };

  const addSession = (hallType: AgendaHallType) => {
    const maxOrder = sorted.reduce((acc, s) => Math.max(acc, s.sortOrder), 0);
    onChange({
      ...agenda,
      sessions: [...agenda.sessions, createNewSession(hallType, maxOrder + 1)],
    });
  };

  return (
    <div className="space-y-6">
      {/* Hall 1 (Green) & Hall 2 (Orange) Column Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F243A] border border-emerald-500/40 space-y-3">
          <div className="text-xs font-mono font-extrabold text-emerald-300 uppercase">
            Left Column — Hall 1 (Green Theme)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CmsTextInput
              label="Hall Badge Title"
              value={agenda.hall1Name}
              onChange={(hall1Name) => onChange({ ...agenda, hall1Name })}
            />
            <CmsTextInput
              label="Capacity Label"
              value={agenda.hall1Capacity}
              onChange={(hall1Capacity) => onChange({ ...agenda, hall1Capacity })}
            />
          </div>
          <CmsTextInput
            label="Hall Subtitle"
            value={agenda.hall1Subtitle}
            onChange={(hall1Subtitle) => onChange({ ...agenda, hall1Subtitle })}
          />
        </div>

        <div className="p-5 rounded-2xl bg-[#0F243A] border border-orange-500/40 space-y-3">
          <div className="text-xs font-mono font-extrabold text-orange-300 uppercase">
            Right Column — Hall 2 (Orange Theme)
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CmsTextInput
              label="Hall Badge Title"
              value={agenda.hall2Name}
              onChange={(hall2Name) => onChange({ ...agenda, hall2Name })}
            />
            <CmsTextInput
              label="Capacity Label"
              value={agenda.hall2Capacity}
              onChange={(hall2Capacity) => onChange({ ...agenda, hall2Capacity })}
            />
          </div>
          <CmsTextInput
            label="Hall Subtitle"
            value={agenda.hall2Subtitle}
            onChange={(hall2Subtitle) => onChange({ ...agenda, hall2Subtitle })}
          />
        </div>
      </div>

      {/* Unified Chronological Sessions List (Shared Full-Width + Hall 1 + Hall 2) */}
      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/25 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Agenda Sessions (Shared Full-Width &amp; Parallel Halls)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Items marked <code className="text-emerald-300">shared</code> span full width (Opening, Giveaways, Closing). Parallel <code className="text-emerald-300">hall1</code> and <code className="text-orange-300">hall2</code> sessions render side-by-side underneath.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => addSession("shared")}
              className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/50 hover:bg-emerald-500/25 text-emerald-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Shared Plenary
            </button>
            <button
              type="button"
              onClick={() => addSession("hall1")}
              className="px-3 py-2 rounded-xl bg-[#15304B] border border-emerald-500/45 hover:border-emerald-400 text-emerald-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hall 1
            </button>
            <button
              type="button"
              onClick={() => addSession("hall2")}
              className="px-3 py-2 rounded-xl bg-[#15304B] border border-orange-500/45 hover:border-orange-400 text-orange-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hall 2
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sorted.map((session, idx) => {
            const meta = HALL_TYPE_BADGES[session.hallType];
            return (
              <div
                key={session.id || idx}
                className={`p-4 rounded-xl bg-[#0A192A] border ${meta.border} space-y-3`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${meta.pill}`}>
                      {meta.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Order #{session.sortOrder}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveSession(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white disabled:opacity-35 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSession(idx, 1)}
                      disabled={idx === sorted.length - 1}
                      className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white disabled:opacity-35 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...agenda,
                          sessions: agenda.sessions.filter((s) => s.id !== session.id),
                        })
                      }
                      className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/15 cursor-pointer"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">hallType</label>
                    <select
                      value={session.hallType}
                      onChange={(e) =>
                        updateSession(session.id, {
                          hallType: e.target.value as AgendaHallType,
                        })
                      }
                      className="h-10 px-3 rounded-xl bg-[#15304B] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#D97706]"
                    >
                      <option value="shared">shared (Full-Width)</option>
                      <option value="hall1">hall1 (Green • 250 Cap)</option>
                      <option value="hall2">hall2 (Orange • 150 Cap)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">Sort Order</label>
                    <input
                      type="number"
                      min={1}
                      value={session.sortOrder}
                      onChange={(e) =>
                        updateSession(session.id, {
                          sortOrder: Number(e.target.value) || 1,
                        })
                      }
                      className="h-10 px-3 rounded-xl bg-[#15304B] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-[#D97706]"
                    />
                  </div>

                  <CmsTextInput
                    label="Time Slot"
                    value={session.time}
                    onChange={(time) => updateSession(session.id, { time })}
                    mono
                  />

                  <CmsTextInput
                    label="Topic Tag"
                    value={session.tag}
                    onChange={(tag) => updateSession(session.id, { tag })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CmsTextInput
                    label="Lecture / Session Title"
                    value={session.title}
                    onChange={(title) => updateSession(session.id, { title })}
                  />
                </div>

                <CmsTextArea
                  label="Short Description"
                  rows={2}
                  value={session.description}
                  onChange={(description) => updateSession(session.id, { description })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const EDITABLE_FIELD_KEYS: Array<{
  key: keyof Omit<RegistrationFormConfig["fields"], "isEsmeMember">;
  title: string;
}> = [
  { key: "fullName", title: "Step 1 — Full Name" },
  { key: "nationalId", title: "Step 1 — National ID" },
  { key: "phone", title: "Step 1 — Mobile Phone" },
  { key: "email", title: "Step 1 — Email Address" },
  { key: "city", title: "Step 1 — Governorate / City" },
  { key: "university", title: "Step 2 — University" },
  { key: "faculty", title: "Step 2 — Faculty / Major Category" },
  { key: "department", title: "Step 2 — Department / Specialization" },
  { key: "customMajor", title: "Step 2 — Other Custom Major Input" },
  { key: "academicYear", title: "Step 2 — Academic Year" },
  { key: "graduationYear", title: "Step 2 — Graduation Year" },
  { key: "jobTitle", title: "Step 2 — Role / Job Title" },
  { key: "company", title: "Step 2 — Company / Organization" },
  { key: "committee", title: "Step 2 — ESME Committee" },
  { key: "idPhotoUrl", title: "Step 3 — National ID Photo Upload" },
  { key: "avatarUrl", title: "Step 3 — Profile Badge Photo Upload" },
];

export function FormBuilderSection({
  form,
  onChange,
}: {
  form: RegistrationFormConfig;
  onChange: (next: RegistrationFormConfig) => void;
}) {
  const updateField = (
    key: keyof Omit<RegistrationFormConfig["fields"], "isEsmeMember">,
    patch: Partial<FormFieldConfig>
  ) => {
    onChange({
      ...form,
      fields: {
        ...form.fields,
        [key]: { ...form.fields[key], ...patch },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
          Form Header Banner &amp; Terms / Submit Button
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CmsTextInput
            label="Banner Badge"
            value={form.bannerBadge}
            onChange={(v) => onChange({ ...form, bannerBadge: v })}
          />
          <div className="sm:col-span-2">
            <CmsTextInput
              label="Banner Title"
              value={form.bannerTitle}
              onChange={(v) => onChange({ ...form, bannerTitle: v })}
            />
          </div>
        </div>
        <CmsTextArea
          label="Banner Description"
          rows={2}
          value={form.bannerDescription}
          onChange={(v) => onChange({ ...form, bannerDescription: v })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CmsTextArea
            label="Step 4 Terms & Conditions Checkbox Text"
            rows={2}
            value={form.termsLabel}
            onChange={(v) => onChange({ ...form, termsLabel: v })}
          />
          <CmsTextInput
            label="Final Submit Button Label"
            value={form.submitButtonLabel}
            onChange={(v) => onChange({ ...form, submitButtonLabel: v })}
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
          Wizard Step Titles &amp; Descriptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["step1", "step2", "step3", "step4"] as const).map((stepKey, idx) => (
            <div
              key={stepKey}
              className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
            >
              <div className="text-xs font-mono font-bold text-[#F59E0B]">
                Step {idx + 1}
              </div>
              <CmsTextInput
                label="Stepper Tab Label"
                value={form.steps[stepKey].navLabel}
                onChange={(v) =>
                  onChange({
                    ...form,
                    steps: {
                      ...form.steps,
                      [stepKey]: { ...form.steps[stepKey], navLabel: v },
                    },
                  })
                }
              />
              <CmsTextInput
                label="Step Heading"
                value={form.steps[stepKey].title}
                onChange={(v) =>
                  onChange({
                    ...form,
                    steps: {
                      ...form.steps,
                      [stepKey]: { ...form.steps[stepKey], title: v },
                    },
                  })
                }
              />
              <CmsTextInput
                label="Step Subtitle"
                value={form.steps[stepKey].subtitle}
                onChange={(v) =>
                  onChange({
                    ...form,
                    steps: {
                      ...form.steps,
                      [stepKey]: { ...form.steps[stepKey], subtitle: v },
                    },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
          Field Labels, Placeholders &amp; Required Rules
        </h3>

        <div className="p-4 rounded-xl bg-[#0A192A] border border-[#D97706]/30 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#F59E0B]">
              Step 2 — ESME Chapter Membership Toggle
            </span>
            <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={form.fields.isEsmeMember.required}
                onChange={(e) =>
                  onChange({
                    ...form,
                    fields: {
                      ...form.fields,
                      isEsmeMember: {
                        ...form.fields.isEsmeMember,
                        required: e.target.checked,
                      },
                    },
                  })
                }
                className="rounded border-slate-600 text-[#D97706]"
              />
              Required
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CmsTextInput
              label="Question Label"
              value={form.fields.isEsmeMember.label}
              onChange={(v) =>
                onChange({
                  ...form,
                  fields: {
                    ...form.fields,
                    isEsmeMember: { ...form.fields.isEsmeMember, label: v },
                  },
                })
              }
            />
            <CmsTextInput
              label="Yes Option Text"
              value={form.fields.isEsmeMember.yesLabel}
              onChange={(v) =>
                onChange({
                  ...form,
                  fields: {
                    ...form.fields,
                    isEsmeMember: { ...form.fields.isEsmeMember, yesLabel: v },
                  },
                })
              }
            />
            <CmsTextInput
              label="No Option Text"
              value={form.fields.isEsmeMember.noLabel}
              onChange={(v) =>
                onChange({
                  ...form,
                  fields: {
                    ...form.fields,
                    isEsmeMember: { ...form.fields.isEsmeMember, noLabel: v },
                  },
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDITABLE_FIELD_KEYS.map(({ key, title }) => {
            const cfg = form.fields[key];
            return (
              <div
                key={key}
                className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">{title}</span>
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cfg.required}
                      onChange={(e) =>
                        updateField(key, { required: e.target.checked })
                      }
                      className="rounded border-slate-600 text-[#D97706]"
                    />
                    Required
                  </label>
                </div>
                <CmsTextInput
                  label="Label"
                  value={cfg.label}
                  onChange={(v) => updateField(key, { label: v })}
                />
                <CmsTextInput
                  label="Placeholder"
                  value={cfg.placeholder}
                  onChange={(v) => updateField(key, { placeholder: v })}
                />
                <CmsTextInput
                  label="Helper Text (Optional)"
                  value={cfg.helperText || ""}
                  onChange={(v) => updateField(key, { helperText: v })}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Dropdown Lists (Faculties, Majors, Years &amp; Committees)
          </h3>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...form,
                faculties: [
                  ...form.faculties,
                  { name: "New Faculty", departments: ["General Specialization"] },
                ],
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#15304B] border border-slate-700 hover:border-[#F59E0B] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer self-start"
          >
            <Plus className="w-3.5 h-3.5 text-[#F59E0B]" /> Add Faculty Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form.faculties.map((fac, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0A192A] border border-slate-800 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-[#F59E0B]">
                  Faculty #{idx + 1}
                </span>
                <button
                  type="button"
                  disabled={form.faculties.length <= 1}
                  onClick={() =>
                    onChange({
                      ...form,
                      faculties: form.faculties.filter((_, i) => i !== idx),
                    })
                  }
                  className="p-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/15 disabled:opacity-35 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <CmsTextInput
                label="Faculty / Major Category Name"
                value={fac.name}
                onChange={(v) =>
                  onChange({
                    ...form,
                    faculties: form.faculties.map((f, i) =>
                      i === idx ? { ...f, name: v } : f
                    ),
                  })
                }
              />
              <CmsTextArea
                label="Departments / Majors (one per line)"
                rows={4}
                mono
                value={fac.departments.join("\n")}
                onChange={(v) =>
                  onChange({
                    ...form,
                    faculties: form.faculties.map((f, i) =>
                      i === idx
                        ? {
                            ...f,
                            departments: v
                              .split("\n")
                              .map((d) => d.trim())
                              .filter(Boolean),
                          }
                        : f
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>

        <CmsTextArea
          label="ESME Chapter Committees / Sectors (one per line)"
          rows={8}
          mono
          value={form.esmeCommittees.join("\n")}
          onChange={(v) =>
            onChange({
              ...form,
              esmeCommittees: v
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CmsTextArea
            label="Academic Years (Format: value | Display Label)"
            rows={6}
            mono
            value={form.academicYears.map((y) => `${y.value} | ${y.label}`).join("\n")}
            onChange={(v) =>
              onChange({
                ...form,
                academicYears: v
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [val, lbl] = line.split("|").map((s) => s.trim());
                    return { value: val, label: lbl || val };
                  })
                  .filter((x) => x.value.length > 0),
              })
            }
          />
          <CmsTextArea
            label="Graduation Years (Format: value | Display Label)"
            rows={6}
            mono
            value={form.graduationYears.map((y) => `${y.value} | ${y.label}`).join("\n")}
            onChange={(v) =>
              onChange({
                ...form,
                graduationYears: v
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [val, lbl] = line.split("|").map((s) => s.trim());
                    return { value: val, label: lbl || val };
                  })
                  .filter((x) => x.value.length > 0),
              })
            }
          />
        </div>

        <CmsTextArea
          label="Governorates / Cities List (one per line)"
          rows={5}
          mono
          value={form.cities.join("\n")}
          onChange={(v) =>
            onChange({
              ...form,
              cities: v
                .split("\n")
                .map((c) => c.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </div>
  );
}

/** Updates `eventStats` on CMS state while keeping `highlights` and `ar.highlights` in sync. */
export function withUpdatedEventStats(cms: FullCmsData, nextStats: EventStatItem[]): FullCmsData {
  return {
    ...cms,
    eventStats: nextStats,
    highlights: nextStats.map((s) => ({
      value: s.value,
      label: s.label.en || s.label.ar || "Metric",
    })),
    ar: {
      ...(cms.ar ?? DEFAULT_ARABIC_CMS),
      highlights: nextStats.map((s) => ({
        value: s.value,
        label: s.label.ar || s.label.en || "مؤشر",
      })),
    },
  };
}

export function EventStatsEditorSection({
  eventStats,
  onChange,
  lang = "en",
}: {
  eventStats: EventStatItem[];
  onChange: (nextStats: EventStatItem[]) => void;
  lang?: "en" | "ar";
}) {
  const isAr = lang === "ar";
  const items = eventStats || [];

  const updateItem = (idx: number, patch: Partial<EventStatItem> & { en?: string; ar?: string }) => {
    onChange(
      items.map((item, i) =>
        i === idx
          ? {
              value: patch.value !== undefined ? patch.value : item.value,
              label: {
                en: patch.en !== undefined ? patch.en : item.label.en,
                ar: patch.ar !== undefined ? patch.ar : item.label.ar,
              },
            }
          : item
      )
    );
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        value: "10+",
        label: {
          en: "New Stat Highlight",
          ar: "إحصائية جديدة",
        },
      },
    ]);
  };

  const deleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const restoreDefaults = () => {
    onChange(
      DEFAULT_EVENT_STATS.map((item) => ({
        value: item.value,
        label: { ...item.label },
      }))
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#D97706]/30 bg-[#15304B]/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
        <div>
          <h4 className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider font-mono">
            {isAr
              ? "شريط إحصائيات وأرقام الملتقى (Event Stats / Highlights Bar)"
              : "Event Stats / Highlights Bar (EN + AR)"}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isAr
              ? "أضف أو عدّل أو احذف مؤشرات الشريط الرئيسي مع كتابة القيمة والوصف بالإنجليزية والعربية."
              : "Add, edit, or remove landing strip stats directly synced with Supabase (fallback restores the 6 defaults if left empty)."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={restoreDefaults}
            className="px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {isAr ? "استعادة الـ 6 الافتراضية" : "Restore 6 Defaults"}
          </button>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#F59E0B] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAr ? "إضافة عنصر" : "Add Stat Item"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-4 rounded-xl bg-[#0F243A] border border-dashed border-slate-700 text-center text-xs text-slate-400">
          {isAr
            ? "القائمة فارغة حالياً — سيتم عرض العناصر الـ 6 الافتراضية تلقائياً عند الحفظ أو اضغط إضافة عنصر."
            : "No custom items — automatic fallback will render the 6 default stats unless you add items above."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0F243A] border border-slate-700/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
            >
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {isAr ? `#${idx + 1} القيمة / الرقم` : `#${idx + 1} Value`}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={stat.value}
                  onChange={(e) => updateItem(idx, { value: e.target.value })}
                  placeholder="400+"
                  className="w-full h-9 px-3 rounded-lg bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="md:col-span-4 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {isAr ? "الوصف بالإنجليزية (EN)" : "English Label (EN)"}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={stat.label.en}
                  onChange={(e) => updateItem(idx, { en: e.target.value })}
                  placeholder="Total Seat Capacity"
                  className="w-full h-9 px-3 rounded-lg bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none"
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  {isAr ? "الوصف بالعربية (AR)" : "Arabic Label (العربية)"}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={stat.label.ar}
                  onChange={(e) => updateItem(idx, { ar: e.target.value })}
                  placeholder="إجمالي السعة الاستيعابية"
                  className="w-full h-9 px-3 rounded-lg bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none"
                />
              </div>

              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => deleteItem(idx)}
                  title={isAr ? "حذف العنصر" : "Delete stat item"}
                  aria-label={isAr ? "حذف العنصر" : "Delete stat item"}
                  className="h-9 px-2.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors inline-flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
