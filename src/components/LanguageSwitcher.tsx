"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  compact?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  compact = false,
  className = "",
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      dir="ltr"
      className={`inline-flex items-center rounded-lg border border-[#D97706]/35 bg-[#0F243A]/90 p-0.5 text-xs font-semibold shadow-sm shrink-0 ${className}`}
    >
      {!compact && (
        <Languages className="w-3.5 h-3.5 text-[#F59E0B] mx-1.5 hidden sm:inline-block" />
      )}
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
          lang === "en"
            ? "bg-[#D97706] text-white shadow-sm"
            : "text-slate-300 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-arabic ${
          lang === "ar"
            ? "bg-[#D97706] text-white shadow-sm"
            : "text-slate-300 hover:text-white"
        }`}
      >
        العربية
      </button>
    </div>
  );
}
