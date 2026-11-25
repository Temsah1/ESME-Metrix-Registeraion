"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Download, MapPin, Ticket } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { OFFICIAL_ESME_LINKEDIN_URL } from "@/config/registration";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";

interface ShareBadgeClientProps {
  attendeeName: string;
  attendeeUniversity?: string;
  ticketId: string;
  ogSrc: string;
}

export default function ShareBadgeClient({
  attendeeName,
  attendeeUniversity,
  ticketId,
  ogSrc,
}: ShareBadgeClientProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 sm:py-14 bg-[#15304B]">
      <div className="max-w-4xl w-full flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/40 bg-[#0F243A] text-[#F59E0B] text-xs font-semibold">
            <Ticket className="w-3.5 h-3.5" />
            {lang === "ar"
              ? "ESME METRIX 2026 • بطاقة الحضور الرسمية"
              : "ESME METRIX 2026 • OFFICIAL ATTENDING CARD"}
          </div>
          <LanguageSwitcher compact />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          {lang === "ar" ? (
            <>
              <span className="text-[#F59E0B]">{attendeeName}</span> يشارك في{" "}
              <span dir="ltr">ESME METRIX</span>!
            </>
          ) : (
            <>
              {attendeeName} is Attending <span className="text-[#F59E0B]">ESME METRIX</span>!
            </>
          )}
        </h1>
        {attendeeUniversity ? (
          <p className="text-xs sm:text-sm text-amber-200/90 mb-3 font-semibold">
            {attendeeUniversity}
          </p>
        ) : null}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-7 leading-relaxed">
          {t.share.headingSubtitle}
        </p>

        {/* Standalone 16:9 Personalized Card Display */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/50 shadow-[0_0_45px_rgba(217,119,6,0.22)] bg-[#07111E] mb-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogSrc}
            alt={`${attendeeName} — ESME METRIX Attendance Card`}
            className="w-full h-auto block"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
            {lang === "ar" ? "السبت، 12 ديسمبر 2026" : "Saturday, 12 December 2026"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
            <MapPin className="w-4 h-4 text-[#F59E0B]" />
            {lang === "ar" ? "جامعة القاهرة" : "Cairo University"}
          </span>
        </div>

        {/* Focused Public Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(217,119,6,0.35)] transition-all flex items-center gap-2"
          >
            {t.share.joinSummitCta} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:text-white hover:border-emerald-400 text-xs sm:text-sm font-bold transition-colors"
          >
            {t.share.backToSummit}
          </Link>
          <a
            href={OFFICIAL_ESME_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,119,181,0.3)]"
          >
            <FaLinkedin className="w-4 h-4" />{" "}
            {lang === "ar" ? "تابع شابتر ESME جامعة القاهرة" : "Follow ESME Cairo University"}
          </a>
          <a
            href={ogSrc}
            download={`ESME-METRIX-Attending-${ticketId || "Card"}.png`}
            className="px-5 py-3.5 rounded-xl border border-slate-700 bg-[#0F243A] text-slate-200 hover:text-white hover:border-[#D97706] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#F59E0B]" /> {t.dashboard.downloadBadgePng}
          </a>
        </div>

        <p className="mt-8 text-[11px] text-slate-400">
          {lang === "ar"
            ? "شابتر الجمعية المصرية لمهندسي المواد — جامعة القاهرة"
            : "ESME Cairo University Student Chapter • Materials Engineering Event"}
        </p>
      </div>
    </div>
  );
}
