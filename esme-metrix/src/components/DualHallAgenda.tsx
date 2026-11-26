"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Layers, Mic, Sparkles, Users } from "lucide-react";
import type { AgendaSession, DualHallAgendaConfig } from "@/lib/cms/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { AppLanguage } from "@/lib/i18n/types";

type HallFilter = "all" | "hall1" | "hall2";

type AgendaBlock =
  | { type: "shared"; session: AgendaSession }
  | { type: "parallel"; key: string; hall1: AgendaSession[]; hall2: AgendaSession[] };

interface DualHallAgendaProps {
  agenda: DualHallAgendaConfig;
  compact?: boolean;
  id?: string;
}

/**
 * Groups sorted sessions chronologically into full-width `shared` plenary
 * blocks and interleaved side-by-side (`hall1` | `hall2`) parallel blocks.
 */
export function buildAgendaBlocks(sessions: AgendaSession[]): AgendaBlock[] {
  const sorted = [...sessions].sort((a, b) => a.sortOrder - b.sortOrder);
  const blocks: AgendaBlock[] = [];
  let pendingHall1: AgendaSession[] = [];
  let pendingHall2: AgendaSession[] = [];
  let parallelGroupIndex = 0;

  const flushParallel = () => {
    if (pendingHall1.length > 0 || pendingHall2.length > 0) {
      parallelGroupIndex += 1;
      blocks.push({
        type: "parallel",
        key: `parallel-${parallelGroupIndex}`,
        hall1: pendingHall1,
        hall2: pendingHall2,
      });
      pendingHall1 = [];
      pendingHall2 = [];
    }
  };

  for (const session of sorted) {
    if (session.hallType === "shared") {
      flushParallel();
      blocks.push({ type: "shared", session });
    } else if (session.hallType === "hall1") {
      pendingHall1.push(session);
    } else {
      pendingHall2.push(session);
    }
  }
  flushParallel();

  return blocks;
}

function SharedPlenaryCard({
  session,
  lang,
}: {
  session: AgendaSession;
  lang: AppLanguage;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="col-span-2 w-full p-4 sm:p-5 rounded-2xl bg-[#0D2136]/95 border-2 border-emerald-500/55 hover:border-emerald-400 shadow-[0_8px_28px_rgba(16,185,129,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start"
    >
      <div className="space-y-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
            {lang === "ar" ? "جلسة مشتركة • لجميع المشاركين" : "SHARED • ALL ATTENDEES"}
          </span>
          {session.tag && session.tag !== "Shared Plenary" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800/90 border border-slate-700 text-slate-300">
              {session.tag}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight leading-snug">
          {session.title}
        </h3>

        {session.description && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            {session.description}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:items-end justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-500/20">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-xs font-bold text-emerald-300">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {session.time}
        </span>
      </div>
    </motion.article>
  );
}

function HallSessionCard({
  session,
  hallVariant,
  hallLabel,
}: {
  session: AgendaSession;
  hallVariant: "hall1" | "hall2";
  hallLabel: string;
}) {
  const isHall1 = hallVariant === "hall1";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0F243A]/95 border transition-all flex flex-col gap-2 min-w-0 text-start ${
        isHall1
          ? "border-emerald-500/45 hover:border-emerald-400/85 shadow-[0_6px_22px_rgba(16,185,129,0.08)]"
          : "border-orange-500/45 hover:border-orange-400/85 shadow-[0_6px_22px_rgba(249,115,22,0.09)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider border ${
            isHall1
              ? "bg-emerald-500/15 border-emerald-400/45 text-emerald-300"
              : "bg-orange-500/15 border-orange-400/45 text-orange-300"
          }`}
        >
          {hallLabel}
        </span>

        {session.tag && (
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800/90 border border-slate-700 text-slate-300">
            {session.tag}
          </span>
        )}
      </div>

      <div
        className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold ${
          isHall1 ? "text-emerald-300" : "text-orange-300"
        }`}
      >
        <Clock className="w-3 h-3 shrink-0" />
        <span className="break-words">{session.time}</span>
      </div>

      <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug break-words">
        {session.title}
      </h4>

      {session.description && (
        <p className="hidden sm:block text-xs text-slate-300 leading-relaxed">
          {session.description}
        </p>
      )}

    </motion.article>
  );
}

function HallColumnHeader({
  hallName,
  capacity,
  subtitle,
  variant,
  sessionCount,
  lang,
}: {
  hallName: string;
  capacity: string;
  subtitle: string;
  variant: "hall1" | "hall2";
  sessionCount: number;
  lang: AppLanguage;
}) {
  const isHall1 = variant === "hall1";
  return (
    <div
      className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-start ${
        isHall1
          ? "bg-gradient-to-r from-emerald-500/15 to-[#0F243A] border-emerald-400/50"
          : "bg-gradient-to-r from-orange-500/15 to-[#0F243A] border-orange-400/50"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider ${
              isHall1 ? "text-emerald-300" : "text-orange-300"
            }`}
          >
            {hallName}
          </span>
          {capacity && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${
                isHall1
                  ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
                  : "bg-orange-500/20 border-orange-400/40 text-orange-200"
              }`}
            >
              <Users className="w-2.5 h-2.5 shrink-0" />
              {capacity}
            </span>
          )}
        </div>
        {subtitle && (
          <div className="hidden sm:block text-xs font-semibold text-slate-200 mt-1 truncate">
            {subtitle}
          </div>
        )}
      </div>

      <span
        className={`hidden md:inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
          isHall1
            ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
            : "bg-orange-500/20 border-orange-400/40 text-orange-200"
        }`}
      >
        {lang === "ar" ? `${sessionCount} جلسات` : `${sessionCount} SESSIONS`}
      </span>
    </div>
  );
}

export default function DualHallAgenda({
  agenda,
  compact = false,
  id = "agenda",
}: DualHallAgendaProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const [filter, setFilter] = useState<HallFilter>("all");
  const blocks = useMemo(() => buildAgendaBlocks(agenda.sessions), [agenda.sessions]);

  const hall1BadgeLabel = agenda.hall1Capacity
    ? `${agenda.hall1Name} • ${agenda.hall1Capacity}`
    : agenda.hall1Name;
  const hall2BadgeLabel = agenda.hall2Capacity
    ? `${agenda.hall2Name} • ${agenda.hall2Capacity}`
    : agenda.hall2Name;

  const filteredSessions = useMemo(() => {
    const sorted = [...agenda.sessions].sort((a, b) => a.sortOrder - b.sortOrder);
    if (filter === "all") return sorted;
    return sorted.filter((s) => s.hallType === "shared" || s.hallType === filter);
  }, [agenda.sessions, filter]);

  return (
    <section
      id={id}
      data-aos={compact ? undefined : "fade-up"}
      className={
        compact
          ? "w-full"
          : "relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-16 sm:py-20 w-full"
      }
    >
      <div className={compact ? "text-center mb-6" : "text-center mb-10"}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/35 bg-[#0F243A] text-slate-200 text-xs mb-3 font-semibold">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          {agenda.eyebrow}
        </div>
        <h2
          className={
            compact
              ? "text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight"
              : "text-3xl sm:text-4xl font-extrabold text-white mb-2.5 tracking-tight"
          }
        >
          {agenda.title}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          {agenda.subtitle}
        </p>

        {/* Optional Quick Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter agenda by conference hall"
          className="inline-flex flex-wrap justify-center items-center gap-1.5 p-1.5 rounded-2xl bg-[#0F243A] border border-slate-800 mt-6 shadow-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t.agenda.allHallsTab}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filter === "hall1"}
            onClick={() => setFilter("hall1")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "hall1"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                : "text-slate-300 hover:text-emerald-300"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            {hall1BadgeLabel}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={filter === "hall2"}
            onClick={() => setFilter("hall2")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "hall2"
                ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]"
                : "text-slate-300 hover:text-orange-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {hall2BadgeLabel}
          </button>
        </div>
      </div>

      {/* Default Wireframe View: Full-width Shared bars + Side-by-Side Green Hall 1 | Orange Hall 2 */}
      {filter === "all" ? (
        <div className="space-y-4 sm:space-y-5">
          {blocks.map((block) =>
            block.type === "shared" ? (
              <div key={block.session.id} className="grid grid-cols-2 sr-agenda-card">
                <SharedPlenaryCard session={block.session} lang={lang} />
              </div>
            ) : (
              <div
                key={block.key}
                className="grid grid-cols-2 gap-2.5 sm:gap-5 items-start"
              >
                {/* Hall 1 Column (Green Theme) */}
                <div className="space-y-2.5 sm:space-y-3.5 min-w-0 sr-agenda-card">
                  <HallColumnHeader
                    hallName={agenda.hall1Name}
                    capacity={agenda.hall1Capacity}
                    subtitle={agenda.hall1Subtitle}
                    variant="hall1"
                    sessionCount={block.hall1.length}
                    lang={lang}
                  />
                  <div className="space-y-2.5 sm:space-y-3">
                    {block.hall1.map((session) => (
                      <HallSessionCard
                        key={session.id}
                        session={session}
                        hallVariant="hall1"
                        hallLabel={agenda.hall1Name}
                      />
                    ))}
                  </div>
                </div>

                {/* Hall 2 Column (Orange Theme) */}
                <div className="space-y-2.5 sm:space-y-3.5 min-w-0 sr-agenda-card">
                  <HallColumnHeader
                    hallName={agenda.hall2Name}
                    capacity={agenda.hall2Capacity}
                    subtitle={agenda.hall2Subtitle}
                    variant="hall2"
                    sessionCount={block.hall2.length}
                    lang={lang}
                  />
                  <div className="space-y-2.5 sm:space-y-3">
                    {block.hall2.map((session) => (
                      <HallSessionCard
                        key={session.id}
                        session={session}
                        hallVariant="hall2"
                        hallLabel={agenda.hall2Name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <HallColumnHeader
            hallName={filter === "hall1" ? agenda.hall1Name : agenda.hall2Name}
            capacity={filter === "hall1" ? agenda.hall1Capacity : agenda.hall2Capacity}
            subtitle={filter === "hall1" ? agenda.hall1Subtitle : agenda.hall2Subtitle}
            variant={filter}
            sessionCount={filteredSessions.filter((s) => s.hallType === filter).length}
            lang={lang}
          />
          <div className="space-y-3">
            {filteredSessions.map((session) =>
              session.hallType === "shared" ? (
                <SharedPlenaryCard key={session.id} session={session} lang={lang} />
              ) : (
                <HallSessionCard
                  key={session.id}
                  session={session}
                  hallVariant={filter}
                  hallLabel={filter === "hall1" ? agenda.hall1Name : agenda.hall2Name}
                />
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
