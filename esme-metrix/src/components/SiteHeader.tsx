"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";

interface SiteHeaderProps {
  heroLogoUrl: string;
}

export default function SiteHeader({ heroLogoUrl }: SiteHeaderProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#15304B]/90 border-b border-[#D97706]/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-full bg-[#082546] border border-[#D97706]/45 flex items-center justify-center overflow-hidden group-hover:border-[#D97706] transition-colors">
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

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/#story"
            className="hidden lg:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5"
          >
            {t.nav.story}
          </Link>
          <Link
            href="/#gallery"
            className="hidden lg:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5"
          >
            {t.nav.gallery}
          </Link>
          <Link
            href="/#agenda"
            className="hidden lg:inline-block text-xs font-medium text-slate-300 hover:text-[#F59E0B] transition-colors px-1.5"
          >
            {t.nav.agenda}
          </Link>

          <LanguageSwitcher compact />

          <Link
            href="/dashboard"
            className="text-[11px] sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:text-white hover:border-emerald-400 transition-all font-semibold whitespace-nowrap"
          >
            {t.nav.memberDashboard}
          </Link>
          <Link
            href="/register"
            className="text-[11px] sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] whitespace-nowrap"
          >
            {t.nav.registerNow}
          </Link>
        </nav>
      </div>
    </header>
  );
}
