"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, CheckCircle2, XCircle, Clock, ShieldCheck, Loader2, AlertCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Registrant } from "@/types/database";
import { REGISTRATION_ID_REGEX } from "@/lib/registration-id";
import { getAdminPhotoUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  localizeCity,
  localizeCommittee,
  localizeDepartment,
  localizeFaculty,
  localizeRole,
} from "@/lib/i18n/registrationLabels";

const PHONE_REGEX = /^01[0125][0-9]{8}$/;

interface AttendanceInfo {
  scanned_at: string;
  scanned_by: string;
}

interface SearchResult {
  registrant: Registrant;
  attendance: AttendanceInfo | null;
}

export default function AdminSearchPage() {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setSearchError(null);
    setCheckInError(null);

    try {
      const supabase = createClient();
      const clean = query.trim();

      let builder = supabase.from("registrants").select("*");
      if (PHONE_REGEX.test(clean)) {
        builder = builder.eq("phone", clean);
      } else if (REGISTRATION_ID_REGEX.test(clean.toUpperCase())) {
        builder = builder.eq("registration_id", clean.toUpperCase());
      } else {
        const safeName = clean.replace(/[%_\\]/g, "");
        builder = builder.ilike("full_name", `%${safeName}%`);
      }

      const { data: reg, error } = await builder.limit(1).maybeSingle();

      if (error) {
        setResult(null);
        setSearchError(t.dashboard.networkError);
        return;
      }

      if (reg) {
        const { data: att } = await supabase
          .from("attendance")
          .select("scanned_at, scanned_by")
          .eq("registrant_id", reg.id)
          .maybeSingle();

        setResult({ registrant: reg, attendance: att });
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
      setSearchError(t.dashboard.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async () => {
    if (!result?.registrant || checkingIn) return;

    setCheckingIn(true);
    setCheckInError(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manual_registrant_id: result.registrant.id,
          notes: "Manual check-in after identity verification",
        }),
      });

      const data = await response.json();

      if (data.status === "SUCCESS" || data.status === "ALREADY_SCANNED") {
        setResult((prev) =>
          prev
            ? {
                ...prev,
                attendance: {
                  scanned_at: data.scanned_at,
                  scanned_by: data.scanned_by,
                },
              }
            : prev
        );
        if (data.status === "ALREADY_SCANNED") {
          setCheckInError(
            lang === "ar"
              ? "هذا المشارك مسجّل حضور مسبقاً. يتم عرض بيانات تسجيل الحضور."
              : "This attendee was already checked in. Showing the recorded check-in."
          );
        }
      } else if (data.status === "UNAUTHORIZED") {
        setCheckInError(
          lang === "ar"
            ? "انتهت صلاحية جلسة المشرف، يُرجى إعادة تسجيل الدخول لتسجيل الحضور."
            : "Your admin session expired. Sign in again to record attendance."
        );
      } else {
        setCheckInError(
          data.error ||
            (lang === "ar" ? "فشل تسجيل الحضور، يُرجى المحاولة مجدداً." : "Check-in failed. Please retry.")
        );
      }
    } catch (e) {
      console.error(e);
      setCheckInError(t.dashboard.networkError);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-start">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t.admin.searchTitle}</h1>
        <p className="text-xs text-slate-400 mt-1">{t.admin.searchSubtitle}</p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            required
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.admin.searchInputPlaceholder}
            className="w-full h-11 ps-10 pe-3.5 rounded-xl bg-[#0F243A] border border-[#D97706]/30 text-white placeholder-slate-400 focus:outline-none focus:border-[#D97706] text-xs sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 h-11 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,119,6,0.3)] shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {lang === "ar" ? "بحث" : "SEARCH"}
        </button>
      </form>

      {/* Search Results Display */}
      {searchError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {searchError}
        </div>
      )}
      {searched && (
        <>
          {result ? (
            <div className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/30 shadow-xl space-y-6 animate-in fade-in duration-300">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span dir="ltr" className="font-mono text-xs font-bold text-[#F59E0B] px-2 py-0.5 rounded bg-[#F59E0B]/10">
                    {result.registrant.registration_id}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {result.registrant.full_name}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {result.registrant.university} • {localizeFaculty(result.registrant.faculty, lang)}
                    {result.registrant.department &&
                    result.registrant.department !== result.registrant.faculty
                      ? ` (${localizeDepartment(result.registrant.department, lang)})`
                      : ""}
                  </div>
                </div>

                {/* Attendance Status Badge */}
                <div>
                  {result.attendance ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" /> {t.admin.alreadyCheckedIn}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold">
                      <Clock className="w-4 h-4" />{" "}
                      {lang === "ar" ? "لم يسجل الدخول بعد" : "NOT YET SCANNED"}
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Contact & Academic Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#15304B] p-4 rounded-xl border border-slate-800 text-slate-300">
                <div>
                  <span className="text-slate-400">{t.register.reviewPhoneLabel}:</span>{" "}
                  <span dir="ltr" className="font-mono">{result.registrant.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewEmailLabel}:</span>{" "}
                  <span dir="ltr" className="font-mono">{result.registrant.email}</span>
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewCityLabel}:</span>{" "}
                  {localizeCity(result.registrant.city, lang)}
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewYearLabel}:</span>{" "}
                  {result.registrant.academic_year}
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewRoleLabel}:</span>{" "}
                  {result.registrant.job_title}
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewCompanyLabel}:</span>{" "}
                  {result.registrant.company || "—"}
                </div>
                <div>
                  <span className="text-slate-400">{t.register.reviewEsmeLabel}:</span>{" "}
                  {result.registrant.is_esme_member
                    ? t.register.yesEsmeMember
                    : t.register.noEsmeMember}
                </div>
                {result.registrant.is_esme_member && (
                  <div>
                    <span className="text-slate-400">{t.register.committeeLabel}:</span>{" "}
                    {result.registrant.committee
                      ? localizeCommittee(result.registrant.committee, lang)
                      : "—"}{" "}
                    ({result.registrant.role ? localizeRole(result.registrant.role, lang) : "—"})
                  </div>
                )}
              </div>

              {/* Verification & Portrait Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1">
                    {lang === "ar" ? "صورة بطاقة الرقم القومي:" : "National ID Photo:"}
                  </div>
                  <div className="relative w-full h-40 rounded-xl bg-[#15304B] border border-slate-800 overflow-hidden">
                    <Image
                      src={getAdminPhotoUrl(result.registrant.id_photo_url)}
                      alt="National ID"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1">
                    {lang === "ar" ? "الصورة الشخصية للبادج:" : "Badge Portrait Photo:"}
                  </div>
                  <div className="relative w-full h-40 rounded-xl bg-[#15304B] border border-slate-800 overflow-hidden flex items-center justify-center">
                    {result.registrant.avatar_url ? (
                      <Image
                        src={getAdminPhotoUrl(result.registrant.avatar_url)}
                        alt="Badge Portrait"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs">
                        <User className="w-6 h-6" />
                        <span>{lang === "ar" ? "لم تُرفع صورة شخصية" : "No portrait uploaded"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual Check-in Action */}
              {checkInError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {checkInError}
                </div>
              )}
              {!result.attendance && (
                <div className="border-t border-slate-800 pt-4 flex justify-end">
                  <button
                    onClick={handleManualCheckIn}
                    disabled={checkingIn}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-extrabold text-xs sm:text-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.35)] disabled:opacity-50 cursor-pointer"
                  >
                    {checkingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {t.admin.checkInButton}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0F243A] border border-slate-800 text-center text-slate-400 text-sm">
              <XCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              {lang === "ar" ? (
                <>
                  لم يتم العثور على مشارك مطابق للبحث &quot;
                  <span dir="ltr" className="text-white font-mono">{query}</span>&quot;.
                </>
              ) : (
                <>
                  No matching attendee registration found for &quot;
                  <span className="text-white font-mono">{query}</span>&quot;.
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
