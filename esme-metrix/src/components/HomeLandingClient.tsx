"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { animate, type JSAnimation } from "animejs";
import { MotionConfig, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import HeroParticles from "@/components/HeroParticles";
import TiltCard from "@/components/TiltCard";
import GalleryShowcase from "@/components/GalleryShowcase";
import DualHallAgenda from "@/components/DualHallAgenda";
import { getLocalizedCms } from "@/lib/cms/arabic";
import { DEFAULT_EVENT_STATS, type FullCmsData } from "@/lib/cms/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
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

interface HomeLandingClientProps {
  cms: FullCmsData;
}

function parseStatNumeric(value: string): { prefix: string; num: number; suffix: string } | null {
  const match = value.trim().match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const num = Number(match[2]);
  if (!Number.isFinite(num)) return null;
  return { prefix: match[1] || "", num, suffix: match[3] || "" };
}

export default function HomeLandingClient({ cms }: HomeLandingClientProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const viewCms = getLocalizedCms(cms, lang);
  const { landing, gallery, agenda } = viewCms;
  const statsItems =
    cms.eventStats && cms.eventStats.length > 0 ? cms.eventStats : DEFAULT_EVENT_STATS;

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const statsAnimatedRef = useRef(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !heroRef.current
    ) return;

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(".home-orbit", { scale: 0.35, opacity: 0, duration: 1, stagger: 0.12, rotate: -12 })
        .from(".hero-stagger", { y: 36, opacity: 0, scale: 0.96, duration: 0.82, stagger: 0.11 }, "-=0.72");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = statsRef.current;
    if (
      typeof window === "undefined" ||
      !container ||
      statsAnimatedRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const activeAnimations: JSAnimation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || statsAnimatedRef.current) return;
        statsAnimatedRef.current = true;
        observer.disconnect();

        container.querySelectorAll<HTMLElement>("[data-stat-value]").forEach((el, idx) => {
          const rawVal = el.dataset.statValue || el.textContent || "";
          const parsed = parseStatNumeric(rawVal);
          if (!parsed) return;
          const counter = { current: 0 };
          const anim = animate(counter, {
            current: parsed.num,
            duration: 1200,
            delay: idx * 70,
            ease: "outExpo",
            onUpdate: () => {
              const formatted = rawVal.includes(".")
                ? counter.current.toFixed(1)
                : String(Math.round(counter.current));
              el.textContent = `${parsed.prefix}${formatted}${parsed.suffix}`;
            },
            onComplete: () => { el.textContent = rawVal; },
          });
          activeAnimations.push(anim);
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      activeAnimations.forEach((a) => a.revert());
    };
  }, [statsItems.length]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !rootRef.current
    ) return;

    type ScrollRevealFactory = typeof import("scrollreveal");
    let cancelled = false;
    let srInstance: ReturnType<ScrollRevealFactory> | null = null;

    import("scrollreveal")
      .then((mod) => {
        if (cancelled || !rootRef.current) return;
        const factory = ((mod as unknown as { default?: ScrollRevealFactory }).default ?? mod) as ScrollRevealFactory;
        srInstance = factory({
          distance: "24px",
          duration: 580,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          viewFactor: 0.12,
          cleanup: true,
          mobile: true,
          reset: false,
        });
        srInstance.reveal(rootRef.current.querySelectorAll(".sr-summary-card"), { interval: 75 });
        srInstance.reveal(rootRef.current.querySelectorAll(".sr-agenda-card"), { interval: 65 });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      try { srInstance?.destroy(); } catch {}
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative overflow-hidden flex-1 flex flex-col bg-[#15304B] pb-mobile-safe sm:pb-0">
        <HeroParticles />
        <div className="fixed inset-0 tech-grid pointer-events-none z-0 opacity-30" />

        <motion.section
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-24 flex flex-col items-center text-center"
        >
          <div className="home-orbit orbit-one" aria-hidden="true" />
          <div className="home-orbit orbit-two" aria-hidden="true" />
          <div className="home-orbit orbit-three" aria-hidden="true" />

          <motion.div whileTap={{ scale: 0.94 }} className="hero-stagger inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-400/35 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {landing.statusBadge}
          </motion.div>

          <h1 className="hero-stagger text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 max-w-4xl">
            {landing.titleLine1}
            <span dir="ltr" className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#F59E0B]">
              {landing.titleHighlight}
            </span>
          </h1>

          <p className="hero-stagger max-w-2xl text-slate-200 text-sm sm:text-lg mb-8 leading-relaxed">
            {landing.subtitle}
          </p>

          <motion.div whileTap={{ scale: 0.985 }} className="hero-stagger w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-[#0F243A]/90 border border-[#D97706]/40 backdrop-blur-md flex items-center justify-between gap-4 mb-10 shadow-lg text-start">
            <div className="flex items-center gap-3.5 w-full">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white">{landing.certificateTitle}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold">
                    {landing.certificateBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">{landing.certificateDescription}</p>
              </div>
            </div>
          </motion.div>

          <motion.div whileTap={{ scale: 0.995 }} className="hero-stagger flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-12">
            <Link href="/register" className="liquid-btn w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(217,119,6,0.4)] transition-all flex items-center justify-center gap-2">
              {landing.primaryCtaLabel}
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <a href="#agenda" className="w-full sm:w-auto px-7 py-4 rounded-xl border border-slate-700 bg-[#0F243A]/85 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2">
              {landing.secondaryCtaLabel}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
            <Link href="/dashboard" className="w-full sm:w-auto px-6 py-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-semibold text-sm transition-all flex items-center justify-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-300" />
              {t.nav.memberDashboard}
            </Link>
          </motion.div>

          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 18 }} className="hero-stagger grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 text-start">
              <Calendar className="w-5 h-5 text-[#D97706] shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.landing.statDateLabel}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{viewCms.eventDate}</div>
              </div>
            </div>
            <motion.a whileTap={{ scale: 0.97 }} href={viewCms.eventMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#0F243A]/90 border border-slate-700/60 text-start">
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-[#D97706] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.landing.statVenueLabel}</div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate">{viewCms.eventVenue}</div>
                  <div className="text-[10px] text-[#F59E0B] font-medium truncate mt-0.5">{t.landing.statVenueCta}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
            </motion.a>
          </motion.div>
        </motion.section>

        <motion.section ref={statsRef} data-aos="fade-up" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.55 }} className="relative z-10 w-full bg-[#0A1F33] border-y border-slate-800 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <Swiper
              dir={lang === "ar" ? "rtl" : "ltr"}
              key={lang}
              modules={[Autoplay, FreeMode]}
              freeMode
              speed={900}
              slidesPerView={2}
              spaceBetween={10}
              loop={statsItems.length > 2}
              autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 18 },
                1024: { slidesPerView: 6, spaceBetween: 20 },
              }}
              className="stats-mobile-slider"
              aria-label="Event statistics"
            >
              {statsItems.map((stat, i) => (
                <SwiperSlide key={`${stat.value}-${i}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.35 }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="min-h-[92px] px-2 flex flex-col items-center justify-center text-center"
                  >
                    <span dir="ltr" data-stat-value={stat.value} className="text-2xl sm:text-3xl font-black text-white tabular-nums">{stat.value}</span>
                    <span className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug">{lang === "ar" ? stat.label.ar || stat.label.en : stat.label.en || stat.label.ar}</span>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.section>

        <motion.section id="story" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.08 }} className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-8 w-full">
          <motion.div className="sr-summary-card text-center max-w-3xl mx-auto mb-12" initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.62 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/30 bg-[#0F243A] text-[#F59E0B] text-xs mb-3 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              {landing.storyEyebrow}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">{landing.storyTitle}</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{landing.storyLead}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {landing.storyPillars.map((pillar, idx) => (
              <TiltCard key={pillar.id || idx} className="sr-summary-card p-6 rounded-2xl bg-[#0F243A]/90 border border-slate-800 flex flex-col gap-3 shadow-xl text-start">
                <span className="text-[11px] font-bold text-[#F59E0B] tracking-wider">{pillar.tag}</span>
                <h3 className="text-lg font-bold text-white leading-snug">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
              </TiltCard>
            ))}
          </div>
        </motion.section>

        <GalleryShowcase gallery={gallery} eyebrow={landing.galleryEyebrow} title={landing.galleryTitle} subtitle={landing.gallerySubtitle} />
        <DualHallAgenda agenda={agenda} />

        <motion.section id="about" initial={{ opacity: 0, y: 36, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.18 }} transition={{ duration: 0.68 }} className="sr-summary-card relative z-10 max-w-6xl mx-auto px-4 pb-14 w-full">
          <div className="rounded-3xl bg-[#0F243A]/90 border border-[#D97706]/25 p-7 sm:p-11 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {landing.aboutEyebrow}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{landing.aboutTitle}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{landing.aboutText}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/register" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs tracking-wider shadow-lg">
                  {landing.primaryCtaLabel}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 bg-[#15304B]/80 text-slate-200 text-xs font-bold tracking-wider">
                  {t.landing.heroPortalCta}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 gap-3">
              {landing.experienceBullets.map((bullet, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: 24, scale: 0.97 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: false, amount: 0.3 }} transition={{ delay: idx * 0.09, duration: 0.42 }} whileTap={{ scale: 0.985 }} className="flex items-start gap-3 p-4 rounded-xl bg-[#15304B]/70 border border-slate-800/90 text-xs sm:text-sm text-slate-200 text-start">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="flex-1">{bullet}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section data-aos="fade-up" initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.65 }} className="relative z-10 max-w-6xl mx-auto px-4 pb-24 text-center w-full">
          <div className="rounded-3xl border border-[#D97706]/30 bg-gradient-to-br from-[#0F243A] to-[#15304B] p-8 sm:p-14 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{landing.ctaTitle}</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">{landing.ctaDescription}</p>
            <Link href="/register" className="liquid-btn inline-flex items-center gap-2 px-9 py-4 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(217,119,6,0.3)]">
              {landing.ctaButtonLabel}
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </motion.section>

        <div className={`sm:hidden mobile-cta-bar transition-all duration-500 ${showMobileBar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`} style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="flex gap-2">
            <Link href="/register" className="liquid-btn flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-sm text-center flex items-center justify-center gap-2">
              {landing.primaryCtaLabel}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="flex-none px-4 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-semibold text-sm flex items-center gap-2">
              <Ticket className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
