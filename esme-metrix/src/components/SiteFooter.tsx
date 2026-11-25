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
import type { FooterCmsConfig, SocialPlatform } from "@/lib/cms/types";

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
  logoUrl?: string;
}

export default function SiteFooter({
  footer,
  logoUrl = "/esme_logo.png",
}: SiteFooterProps) {
  const visibleSocials = footer.socialLinks.filter(
    (s) => s.enabled && s.url.trim().length > 0
  );

  return (
    <footer className="relative z-10 border-t border-[#D97706]/20 bg-[#0B1B2D] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <div className="text-base font-extrabold tracking-wider text-white">
                  {footer.brandTitle}
                </div>
                <div className="text-[11px] font-mono text-[#F59E0B] uppercase tracking-wider">
                  {footer.chapterName}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              {footer.bio}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F243A] border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {footer.eventMeta}
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F59E0B]">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/#about" className="text-slate-300 hover:text-white transition-colors">
                  About Summit
                </Link>
              </li>
              <li>
                <Link href="/#story" className="text-slate-300 hover:text-white transition-colors">
                  Our Story &amp; Vision
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-slate-300 hover:text-white transition-colors">
                  Event Gallery
                </Link>
              </li>
              <li>
                <Link href="/#agenda" className="text-slate-300 hover:text-white transition-colors">
                  Event Agenda
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-emerald-300 hover:text-white transition-colors font-semibold">
                  Member Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[#F59E0B] hover:text-amber-300 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  Register Now <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Chapter Hub & Social Media */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F59E0B]">
              Chapter Hub &amp; Social Media
            </h3>

            {footer.portalUrl && (
              <motion.a
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                href={footer.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-3 rounded-xl bg-[#0F243A] border border-[#D97706]/40 hover:border-[#F59E0B] text-white text-xs font-bold flex items-center justify-between gap-2 transition-colors shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <FaGlobe className="w-4 h-4 text-[#F59E0B]" />
                  {footer.portalLabel}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#F59E0B]" />
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div>{footer.copyrightText}</div>
          <div className="text-[#D97706] font-semibold tracking-wider uppercase">
            {footer.tagline}
          </div>
        </div>
      </div>
    </footer>
  );
}
