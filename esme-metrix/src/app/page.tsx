import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import TiltCard from "@/components/TiltCard";
import GalleryShowcase from "@/components/GalleryShowcase";
import DualHallAgenda from "@/components/DualHallAgenda";
import { getFullCmsData } from "@/lib/cms/server";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  ExternalLink,
  MapPin,
  Sparkles,
  Ticket,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const cms = await getFullCmsData();
  const { landing, highlights, gallery, agenda } = cms;

  return (
    <div className="relative overflow-hidden flex-1 flex flex-col bg-[#15304B]">
      {/* Lightweight 2D Ambient Backdrop */}
      <HeroParticles />

      {/* Tech grid background */}
      <div className="fixed inset-0 tech-grid pointer-events-none z-0 opacity-30" />

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24 flex flex-col items-center text-center">
        {/* Live Status Pill */}
        <div
          data-aos="fade-down"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] font-mono text-xs font-semibold mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          {landing.statusBadge}
        </div>

        {/* Hero Headline */}
        <h1
          data-aos="fade-up"
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          {landing.titleLine1}
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#F59E0B]">
            {landing.titleHighlight}
          </span>
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="80"
          dir="auto"
          className="max-w-2xl text-slate-200 text-sm sm:text-lg mb-8 leading-relaxed font-normal"
        >
          {landing.subtitle}
        </p>

        {/* Official Certificate Spotlight Card (Preserves Bilingual Badge & Arabic Description) */}
        <div
          data-aos="fade-up"
          data-aos-delay="120"
          className="w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/40 animate-border-glow backdrop-blur-md flex items-center justify-between gap-4 mb-10 shadow-lg text-left"
        >
          <div className="flex items-center gap-3.5 w-full">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {landing.certificateTitle}
                </span>
                <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded font-bold tracking-wider">
                  {landing.certificateBadge}
                </span>
              </div>
              <p dir="auto" className="text-xs text-slate-300 mt-1 leading-snug">
                {landing.certificateDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div
          data-aos="fade-up"
          data-aos-delay="160"
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-12"
        >
          <Link
            href="/register"
            className="liquid-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(217,119,6,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            {landing.primaryCtaLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
          <a
            href="#agenda"
            className="w-full sm:w-auto px-7 py-4 rounded-xl border border-slate-700 bg-[#0F243A]/85 text-slate-200 hover:text-white hover:border-[#D97706] font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            {landing.secondaryCtaLabel} <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:text-white hover:border-emerald-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4 text-emerald-300" />
            Member Dashboard
          </Link>
        </div>

        {/* Quick Venue & Date Box */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full"
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 text-left">
            <Calendar className="w-5 h-5 text-[#D97706] shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Event Date</div>
              <div className="text-xs sm:text-sm font-bold text-white">{cms.eventDate}</div>
            </div>
          </div>
          <a
            href={cms.eventMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 hover:border-[#D97706]/60 text-left transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="w-5 h-5 text-[#D97706] shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Venue</div>
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {cms.eventVenue}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#F59E0B] shrink-0" />
          </a>
        </div>
      </section>

      {/* ── METRICS STRIP ── */}
      <section
        data-aos="fade-up"
        className="relative z-10 w-full bg-[#0A1F33] border-y border-slate-800 py-8"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{h.value}</span>
                <span className="text-xs text-slate-300 font-medium mt-1">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENT SUMMARY #1: UPPER OVERVIEW & VISION ── */}
      <section id="story" className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-8 w-full">
        <div data-aos="fade-up" className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/30 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-3 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            {landing.storyEyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            {landing.storyTitle}
          </h2>
          <p dir="auto" className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {landing.storyLead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {landing.storyPillars.map((pillar, idx) => (
            <TiltCard
              key={pillar.id || idx}
              className="p-6 rounded-2xl bg-[#0F243A]/90 border border-slate-800 hover:border-[#D97706]/50 flex flex-col gap-3 shadow-xl"
            >
              <span className="text-[11px] font-mono font-bold text-[#F59E0B] tracking-wider">
                {pillar.tag}
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">{pillar.title}</h3>
              <p dir="auto" className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── 8-IMAGE EVENT GALLERY SHOWCASE (8 REAL EVENT PHOTOS) ── */}
      <GalleryShowcase
        gallery={gallery}
        eyebrow={landing.galleryEyebrow}
        title={landing.galleryTitle}
        subtitle={landing.gallerySubtitle}
      />

      {/* ── WIREFRAME DUAL-HALL EVENT AGENDA (SHARED + GREEN HALL 1 + ORANGE HALL 2) ── */}
      <DualHallAgenda agenda={agenda} />

      {/* ── EVENT SUMMARY #2: INSIDE THE GATHERING (WITH BILINGUAL HIGHLIGHTS) ── */}
      <section
        id="about"
        data-aos="fade-up"
        className="relative z-10 max-w-6xl mx-auto px-4 pb-14 w-full"
      >
        <div className="rounded-3xl bg-[#0F243A]/90 border border-[#D97706]/25 p-7 sm:p-11 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D97706] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {landing.aboutEyebrow}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {landing.aboutTitle}
            </h2>
            <p dir="auto" className="text-slate-300 text-sm leading-relaxed font-normal">
              {landing.aboutText}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
              >
                {landing.primaryCtaLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 bg-[#15304B]/80 text-slate-200 hover:text-white hover:border-[#D97706] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Open My Dashboard
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 gap-3">
            {landing.experienceBullets.map((bullet, idx) => (
              <div
                key={idx}
                dir="auto"
                className="flex items-start gap-3 p-4 rounded-xl bg-[#15304B]/70 border border-slate-800/90 text-xs sm:text-sm text-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span className="flex-1">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section
        data-aos="fade-up"
        className="relative z-10 max-w-6xl mx-auto px-4 pb-24 text-center w-full"
      >
        <div className="rounded-3xl border border-[#D97706]/30 bg-gradient-to-br from-[#0F243A] to-[#15304B] p-8 sm:p-14 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {landing.ctaTitle}
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            {landing.ctaDescription}
          </p>
          <Link
            href="/register"
            className="liquid-btn inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:brightness-110 transition-all"
          >
            {landing.ctaButtonLabel}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
