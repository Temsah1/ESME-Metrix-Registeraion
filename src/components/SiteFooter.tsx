"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { DEFAULT_ARABIC_CMS } from "@/lib/cms/arabic";
import type { ArabicCmsData, FooterCmsConfig, SocialPlatform } from "@/lib/cms/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "linkedin":
      return <FaLinkedin className="w-4 h-4" />;
    case "facebook":
      return <FaFacebook className="w-4 h-4" />;
    case "instagram":
      return <FaInstagram className="w-4 h-4" />;
    case "tiktok":
      return <FaTiktok className="w-4 h-4" />;
    case "youtube":
      return <FaYoutube className="w-4 h-4" />;
    case "email":
      return <FaEnvelope className="w-4 h-4" />;
    case "website":
    default:
      return <FaGlobe className="w-4 h-4" />;
  }
}

interface SiteFooterProps {
  footer: FooterCmsConfig;
  arFooter?: ArabicCmsData["footer"];
  logoUrl?: string;
}

export default function SiteFooter({
  footer,
  arFooter,
  logoUrl = "/esme_logo.png",
}: SiteFooterProps) {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const arFallback = DEFAULT_ARABIC_CMS.footer;

  const activeFooter =
    lang === "ar"
      ? {
          ...footer,
          brandTitle: arFooter?.brandTitle?.trim() || arFallback.brandTitle,
          chapterName: arFooter?.chapterName?.trim() || arFallback.chapterName,
          tagline: arFooter?.tagline?.trim() || arFallback.tagline,
          bio: arFooter?.bio?.trim() || arFallback.bio,
          eventMeta: arFooter?.eventMeta?.trim() || arFallback.eventMeta,
          portalLabel: arFooter?.portalLabel?.trim() || arFallback.portalLabel,
          copyrightText: arFooter?.copyrightText?.trim() || arFallback.copyrightText,
        }
      : footer;

  const visibleSocials = activeFooter.socialLinks.filter(
    (s) => s.enabled && s.url.trim().length > 0
  );

  return (
    <footer className="relative z-10 border-t border-[#D97706]/20 bg-[#0B1B2D] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-start">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/90">
          {/* Column 1: Chapter & Event Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-[#0F243A] border border-[#D97706]/35 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                <Image
                  src={logoUrl || "/esme_logo.png"}
                  alt="ESME Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div dir="ltr" className="text-base font-extrabold tracking-wider text-white">
                  {activeFooter.brandTitle}
                </div>
                <div className="text-[11px] text-[#F59E0B] font-semibold tracking-wider">
                  {activeFooter.chapterName}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              {activeFooter.bio}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F243A] border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {activeFooter.eventMeta}
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {t.footer.quickLinksTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/#about" className="text-slate-300 hover:text-white transition-colors">
                  {t.footer.aboutLink}
                </Link>
              </li>
              <li>
                <Link href="/#story" className="text-slate-300 hover:text-white transition-colors">
                  {t.footer.storyLink}
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-slate-300 hover:text-white transition-colors">
                  {t.footer.galleryLink}
                </Link>
              </li>
              <li>
                <Link href="/#agenda" className="text-slate-300 hover:text-white transition-colors">
                  {t.footer.agendaLink}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-emerald-300 hover:text-white transition-colors font-semibold"
                >
                  {t.footer.memberDashboardLink}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[#F59E0B] hover:text-amber-300 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  {t.footer.registerNowLink}
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chapter Hub & Social Media */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">
              {t.footer.followUsTitle}
            </h3>

            {activeFooter.portalUrl && (
              <motion.a
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                href={activeFooter.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-xl bg-[#0F243A] border border-[#D97706]/40 hover:border-[#F59E0B] text-white text-xs font-bold flex items-center justify-between gap-2 transition-colors shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <FaGlobe className="w-4 h-4 text-[#F59E0B]" />
                  {activeFooter.portalLabel}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#F59E0B] rtl:-scale-x-100" />
              </motion.a>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              {visibleSocials.map((item) => {
                const isMail = item.url.startsWith("mailto:");
                return (
                  <motion.a
                    key={item.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    href={item.url}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={item.label}
                    title={item.label}
                    className="w-10 h-10 rounded-xl bg-[#0F243A] border border-slate-700/80 hover:border-[#F59E0B] hover:bg-[#15304B] text-slate-300 hover:text-[#F59E0B] flex items-center justify-center transition-colors"
                  >
                    <SocialIcon platform={item.platform} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>{activeFooter.copyrightText}</div>
          <div dir="ltr" className="text-[#D97706] font-mono font-semibold tracking-wider uppercase">
            {activeFooter.tagline}
          </div>
        </div>
      </div>
    </footer>
  );
}
