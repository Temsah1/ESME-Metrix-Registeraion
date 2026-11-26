"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Percent,
  Share2,
  Activity,
  ArrowUpRight,
  Loader2,
  Sliders,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import CmsEditor from "@/components/admin/CmsEditor";
import { DEFAULT_FULL_CMS } from "@/lib/cms/defaults";
import type { FullCmsData } from "@/lib/cms/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeCity } from "@/lib/i18n/registrationLabels";
import type { AppLanguage } from "@/lib/i18n/types";

const PIE_COLORS = ["#D97706", "#F59E0B", "#B45309", "#E11D48", "#10B981"];

interface Stats {
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  linkedinShares: number;
}

interface RecentRegistration {
  id: string;
  name: string;
  university: string;
  createdAt: string;
}

function aggregate(rows: { university: string | null; city: string | null }[]) {
  const uniMap = new Map<string, number>();
  const cityMap = new Map<string, number>();
  for (const r of rows) {
    const u = (r.university || "Unknown").trim();
    const c = (r.city || "Unknown").trim();
    uniMap.set(u, (uniMap.get(u) || 0) + 1);
    cityMap.set(c, (cityMap.get(c) || 0) + 1);
  }
  const top = (m: Map<string, number>, limit: number) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  return { universityData: top(uniMap, 6), cityData: top(cityMap, 5) };
}

function relativeTime(iso: string, lang: AppLanguage): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (lang === "ar") {
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} د`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} س`;
    return `منذ ${Math.floor(hrs / 24)} ي`;
  }
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = getDictionary(lang);
  const [activeTab, setActiveTab] = useState<"metrics" | "cms">("metrics");

  // Metrics State
  const [stats, setStats] = useState<Stats>({
    totalRegistered: 0,
    totalAttended: 0,
    attendanceRate: 0,
    linkedinShares: 0,
  });
  const [universityData, setUniversityData] = useState<{ name: string; count: number }[]>([]);
  const [cityData, setCityData] = useState<{ name: string; count: number }[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Structured CMS State
  const [cmsData, setCmsData] = useState<FullCmsData>(DEFAULT_FULL_CMS);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSuccess, setCmsSuccess] = useState<string | null>(null);
  const [cmsError, setCmsError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = createClient();

        const { count: regCount, error: regErr } = await supabase
          .from("registrants")
          .select("*", { count: "exact", head: true });
        if (regErr) throw regErr;

        const { count: attCount, error: attErr } = await supabase
          .from("attendance")
          .select("*", { count: "exact", head: true });
        if (attErr) throw attErr;

        const { count: shareCount, error: shareErr } = await supabase
          .from("registrants")
          .select("*", { count: "exact", head: true })
          .eq("linkedin_shared", true);
        if (shareErr) throw shareErr;

        const total = regCount ?? 0;
        const attended = attCount ?? 0;
        setStats({
          totalRegistered: total,
          totalAttended: attended,
          attendanceRate: total > 0 ? Math.round((attended / total) * 100) : 0,
          linkedinShares: shareCount ?? 0,
        });

        const { data: rows, error: rowsErr } = await supabase
          .from("registrants")
          .select("registration_id, full_name, university, city, created_at")
          .order("created_at", { ascending: false })
          .limit(1000);
        if (rowsErr) throw rowsErr;

        const all = rows ?? [];
        const { universityData: uni, cityData: city } = aggregate(all);
        setUniversityData(uni);
        setCityData(city);
        setRecentRegistrations(
          all.slice(0, 10).map((r) => ({
            id: r.registration_id,
            name: r.full_name,
            university: r.university,
            createdAt: r.created_at,
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Dashboard stats fetch failed:", err);
        setError("stats_failed");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [reloadKey]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-stats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attendance" },
        () => {
          setStats((prev) => {
            const attended = prev.totalAttended + 1;
            const rate =
              prev.totalRegistered > 0
                ? Math.round((attended / prev.totalRegistered) * 100)
                : 0;
            return { ...prev, totalAttended: attended, attendanceRate: rate };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    async function loadCMS() {
      setCmsLoading(true);
      setCmsError(null);
      try {
        const res = await fetch("/api/cms", { cache: "no-store" });
        const payload = (await res.json().catch(() => null)) as {
          cms?: FullCmsData;
          error?: string;
        } | null;

        if (!res.ok || !payload?.cms) {
          throw new Error(
            payload?.error || `Failed to load CMS from Supabase (HTTP ${res.status}).`
          );
        }

        setCmsData(payload.cms);
      } catch (err: unknown) {
        console.error("CMS load error:", err);
        setCmsError(
          (err as Error)?.message ||
            (lang === "ar"
              ? "تعذّر تحميل بيانات المحتوى من قاعدة البيانات."
              : "Failed to load CMS content from Supabase.")
        );
      } finally {
        setCmsLoading(false);
      }
    }

    loadCMS();
  }, [lang]);

  const handleImageUpload = async (
    key: string,
    file: File,
    applyUrl: (url: string) => void
  ) => {
    setUploadingKey(key);
    setCmsError(null);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `cms-${key}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      applyUrl(publicUrlData.publicUrl);
      setCmsSuccess(
        lang === "ar"
          ? `تم رفع صورة "${key}" بنجاح. اضغط حفظ ونشر التعديلات لاعتمادها.`
          : `Image for "${key}" uploaded cleanly. Click Save & Publish Changes to persist.`
      );
      setTimeout(() => setCmsSuccess(null), 4000);
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      setCmsError((err as Error)?.message || t.upload.uploadFailed);
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveCMS = async () => {
    setCmsSaving(true);
    setCmsSuccess(null);
    setCmsError(null);

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ cms: cmsData }),
      });

      const payload = (await res.json().catch(() => null)) as {
        ok?: boolean;
        updatedCount?: number;
        cms?: FullCmsData;
        error?: string;
      } | null;

      if (!res.ok || !payload?.ok) {
        throw new Error(
          payload?.error || `Supabase CMS save failed (HTTP ${res.status}).`
        );
      }

      if (payload.cms) {
        setCmsData(payload.cms);
      }

      router.refresh();
      setCmsSuccess(t.admin.cmsSavedBanner);
      setTimeout(() => setCmsSuccess(null), 5000);
    } catch (err: unknown) {
      console.error("CMS save error:", err);
      setCmsError(
        (err as Error)?.message ||
          (lang === "ar"
            ? "تعذّر حفظ المحتوى. تأكد من صلاحيات قاعدة البيانات."
            : "Failed to save CMS content. Check database permissions.")
      );
    } finally {
      setCmsSaving(false);
    }
  };

  const handleResetCMS = () => {
    const confirmMsg =
      lang === "ar"
        ? "هل تريد استعادة جميع النصوص والإعدادات الافتراضية (بالعربية والإنجليزية)؟"
        : "Reset all CMS fields back to defaults?";
    if (confirm(confirmMsg)) {
      setCmsData(DEFAULT_FULL_CMS);
      setCmsSuccess(
        lang === "ar"
          ? "تمت استعادة الإعدادات الافتراضية. اضغط حفظ ونشر لاعتمادها."
          : "Reset to default EN/AR CMS values. Click 'Save & Publish' to apply."
      );
    }
  };

  const localizedCityPieData = cityData.map((c) => ({
    name: localizeCity(c.name, lang),
    value: c.count,
  }));

  return (
    <div className="space-y-6 text-start">
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.admin.dashboardHeader}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{t.admin.dashboardSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0F243A] border border-[#D97706]/20">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "metrics"
                ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-[#15304B]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> {t.admin.tabAnalytics}
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cms"
                ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-[#15304B]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> {t.admin.tabCms}
          </button>
        </div>
      </div>

      {/* TAB 1: METRICS DASHBOARD */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-3">
              <span>
                {lang === "ar"
                  ? "تعذّر تحميل الإحصائيات المباشرة، يُرجى إعادة المحاولة."
                  : "Could not load live statistics. Check your connection and retry."}
              </span>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setReloadKey((k) => k + 1);
                }}
                className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 font-semibold hover:bg-red-500/30 cursor-pointer"
              >
                {t.common.retry}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t.admin.totalRegistrants}
                </span>
                <Users className="w-4 h-4 text-[#D97706]" />
              </div>
              <div dir="ltr" className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.totalRegistered}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {lang === "ar" ? "إجمالي طلبات التسجيل" : "Registered attendees"}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t.admin.checkedInToday}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
              <div dir="ltr" className="text-3xl font-extrabold text-[#10B981] font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.totalAttended}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {lang === "ar" ? "توثيق الدخول عند البوابة" : "Verified on-site gate admission"}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t.admin.attendanceRate}
                </span>
                <Percent className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div dir="ltr" className="text-3xl font-extrabold text-[#F59E0B] font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : `${stats.attendanceRate}%`}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-full transition-all duration-500"
                  style={{ width: `${stats.attendanceRate}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t.admin.sharedLinkedinCount}
                </span>
                <Share2 className="w-4 h-4 text-[#0077B5]" />
              </div>
              <div dir="ltr" className="text-3xl font-extrabold text-[#0077B5] font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.linkedinShares}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {lang === "ar" ? "عمليات مشاركة بطاقة الحضور" : "Self-reported share actions"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.admin.topUniversities}
                </h2>
                <Activity className="w-4 h-4 text-[#D97706]" />
              </div>

              <div className="h-64 w-full" dir="ltr">
                {universityData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    {loading ? t.common.loading : lang === "ar" ? "لا توجد بيانات بعد" : "No registration data yet."}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={universityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F243A",
                          borderColor: "#D97706",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t.admin.topCities}
                </h2>
              </div>

              <div className="h-52 w-full flex items-center justify-center" dir="ltr">
                {localizedCityPieData.length === 0 ? (
                  <div className="text-xs text-slate-500">
                    {loading ? t.common.loading : lang === "ar" ? "لا توجد بيانات" : "No data yet."}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={localizedCityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {localizedCityPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0F243A",
                          borderColor: "#D97706",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mt-2">
                {cityData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="truncate">
                      {localizeCity(c.name, lang)}: {c.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {lang === "ar" ? "أحدث المسجلين" : "Recent Registration Pipeline"}
              </h2>
              <span className="text-xs text-[#F59E0B]">{t.admin.liveRealtime}</span>
            </div>

            {recentRegistrations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                {loading ? t.common.loading : lang === "ar" ? "لا يوجد مسجلون بعد." : "No registrations yet."}
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentRegistrations.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div dir="ltr" className="font-mono text-xs font-bold text-[#F59E0B] px-2 py-0.5 rounded bg-[#F59E0B]/10">
                        {item.id}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.university}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      {relativeTime(item.createdAt, lang)}{" "}
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 rtl:-scale-x-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TOTAL SITE & FORM CMS */}
      {activeTab === "cms" && (
        <CmsEditor
          cms={cmsData}
          loading={cmsLoading}
          saving={cmsSaving}
          successMessage={cmsSuccess}
          errorMessage={cmsError}
          uploadingKey={uploadingKey}
          onChange={setCmsData}
          onUploadImage={handleImageUpload}
          onSave={handleSaveCMS}
          onReset={handleResetCMS}
        />
      )}
    </div>
  );
}
