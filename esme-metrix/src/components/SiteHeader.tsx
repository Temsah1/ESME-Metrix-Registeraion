"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
import { Menu, X } from "lucide-react";

interface SiteHeaderProps {
  heroLogoUrl: string;
}

export default function SiteHeader({ heroLogoUrl }: SiteHeaderProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div id="scroll-progress" style={{ width: "0%" }} />

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 site-header-glass ${scrolled ? "scrolled" : ""}`}
        style={{ transition: "background 0.3s, box-shadow 0.3s" }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-full bg-[#082546] border border-[#D97706]/45 flex items-center justify-center overflow-hidden group-hover:border-[#D97706] group-hover:shadow-[0_0_16px_rgba(217,119,6,0.4)] transition-all duration-300">
              <Image
                src={heroLogoUrl || "/esme-icon.jpg"}
                alt="ESME Logo"
                width={36}
                height={36}
                className="w-full h-full rounded-full object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span
                dir="ltr"
                className="text-xs sm:text-sm font-bold tracking-wider text-white group-hover:text-[#D97706] transition-colors whitespace-nowrap"
              >
                ESME <span className="text-[#D97706]">METRIX</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight hidden xs:inline sm:inline">
                {t.nav.brandSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 sm:gap-3">
            <Link href="/#story" className="nav-link text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5 py-1">
              {t.nav.story}
            </Link>
            <Link href="/#gallery" className="nav-link text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5 py-1">
              {t.nav.gallery}
            </Link>
            <Link href="/#agenda" className="nav-link text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5 py-1">
              {t.nav.agenda}
            </Link>
            <LanguageSwitcher compact />
            <Link
              href="/dashboard"
              className="text-[11px] sm:text-xs px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/20 transition-all font-semibold whitespace-nowrap"
            >
              {t.nav.memberDashboard}
            </Link>
            <Link
              href="/register"
              className="liquid-btn text-[11px] sm:text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] whitespace-nowrap"
            >
              {t.nav.registerNow}
            </Link>
          </nav>

          {/* Mobile Nav Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher compact />
            <motion.button
              whileTap={{ scale: 0.88, rotate: mobileOpen ? 8 : -8 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg border border-slate-700 bg-[#0F243A] text-slate-300 hover:text-white hover:border-[#D97706]/50 transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-navigation"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden"
            >
          <motion.div
            initial="closed"
            animate="open"
            variants={{
              closed: {},
              open: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
            }}
            className="px-4 pb-4 pt-2 border-t border-[#D97706]/10 flex flex-col gap-2"
          >
            <Link href="/#story" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-[#F59E0B] py-2.5 border-b border-slate-800 transition-colors">
              {t.nav.story}
            </Link>
            <Link href="/#gallery" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-[#F59E0B] py-2.5 border-b border-slate-800 transition-colors">
              {t.nav.gallery}
            </Link>
            <Link href="/#agenda" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-[#F59E0B] py-2.5 border-b border-slate-800 transition-colors">
              {t.nav.agenda}
            </Link>
            <div className="flex gap-2 pt-1">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-xs text-center px-3 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-semibold"
              >
                {t.nav.memberDashboard}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 liquid-btn text-xs text-center px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold"
              >
                {t.nav.registerNow}
              </Link>
            </div>
          </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
