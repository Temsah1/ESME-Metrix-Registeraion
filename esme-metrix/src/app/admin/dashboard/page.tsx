"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  CheckCircle2,
  Percent,
  Share2,
  Activity,
  ArrowUpRight,
  Loader2,
  Sliders,
  Save,
  RotateCcw,
  Upload,
  AlertCircle,
  Sparkles,
  ExternalLink,
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
import { DEFAULT_OG_HIGHLIGHTS_TEXT, LINKEDIN_POST_TEXT } from "@/config/registration";

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
  time: string;
}

interface CMSItem {
  key: string;
  label: string;
  category: string;
  field_type: "text" | "textarea" | "image";
  value: string;
}

const DEFAULT_CMS_ITEMS: CMSItem[] = [
  {
    key: "hero_headline",
    label: "Hero Headline",
    category: "Hero Section",
    field_type: "text",
    value: "ESME METRIX 2026",
  },
  {
    key: "hero_subtitle",
    label: "Hero Subtitle",
    category: "Hero Section",
    field_type: "text",
    value: "Materials Engineering Event — ESME Cairo University Student Chapter",
  },
  {
    key: "event_date",
    label: "Event Date",
    category: "Event Details",
    field_type: "text",
    value: "12 December 2026",
  },
  {
    key: "event_venue",
    label: "Event Venue",
    category: "Event Details",
    field_type: "text",
    value: "Cairo University",
  },
  {
    key: "event_time",
    label: "Event Time Display",
    category: "Event Details",
    field_type: "text",
    value: "Saturday 12 / 12 / 2026",
  },
  {
    key: "linkedin_caption",
    label: "LinkedIn Share Caption",
    category: "Social Amplification",
    field_type: "textarea",
    value: LINKEDIN_POST_TEXT,
  },
  {
    key: "og_highlights",
    label: "LinkedIn Card 2x3 Highlights (6 lines: Value | Label)",
    category: "Social Amplification",
    field_type: "textarea",
    value: DEFAULT_OG_HIGHLIGHTS_TEXT,
  },
  {
    key: "whatsapp_group_url",
    label: "WhatsApp Group Invite Link",
    category: "Social Amplification",
    field_type: "text",
    value: "https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW",
  },
  {
    key: "hero_logo_url",
    label: "Hero Logo URL",
    category: "Brand Assets",
    field_type: "image",
    value: "/esme_logo.png",
  },
  {
    key: "ticket_bg_url",
    label: "Ticket Background Image URL",
    category: "Brand Assets",
    field_type: "image",
    value: "/images/ticket-bg.jpg",
  },
  // ── HOME PAGE CMS ──
  {
    key: "about_text",
    label: "About the Event (Homepage)",
    category: "Home Page",
    field_type: "textarea",
    value:
      "ESME METRIX is the flagship Materials Engineering event hosted by the ESME Cairo University Student Chapter. It brings together students, professionals, researchers, and industry leaders to explore cutting-edge innovations in materials science, engineering applications, and emerging technologies.",
  },
  {
    key: "event_agenda",
    label: "Event Agenda (Format: Time | Title | Icon per line)",
    category: "Home Page",
    field_type: "textarea",
    value: `09:00 AM | Gates Open & Registration Desk | 🚪
10:00 AM | Opening Ceremony & Keynote Address | 🎤
12:00 PM | Materials & Petroleum Workshops | ⚡
02:00 PM | Mechatronics & Industry Exhibition | 🏢
04:00 PM | Engineering Competitions & Awards | 🏆
06:00 PM | Certificate Distribution & Gala | 🎓`,
  },
  {
    key: "gallery_image_1",
    label: "Gallery Photo 1 (URL)",
    category: "Home Page",
    field_type: "image",
    value: "",
  },
  {
    key: "gallery_image_2",
    label: "Gallery Photo 2 (URL)",
    category: "Home Page",
    field_type: "image",
    value: "",
  },
  {
    key: "gallery_image_3",
    label: "Gallery Photo 3 (URL)",
    category: "Home Page",
    field_type: "image",
    value: "",
  },
  {
    key: "gallery_image_4",
    label: "Gallery Photo 4 (URL)",
    category: "Home Page",
    field_type: "image",
    value: "",
  },
];

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

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboardPage() {
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

  // CMS State
  const [cmsItems, setCmsItems] = useState<CMSItem[]>(DEFAULT_CMS_ITEMS);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSuccess, setCmsSuccess] = useState<string | null>(null);
  const [cmsError, setCmsError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  // Load Metrics
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
            time: relativeTime(r.created_at),
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Dashboard stats fetch failed:", err);
        setError("Could not load live statistics. Check your connection and retry.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [reloadKey]);

  // Realtime attendance listener
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

  // Load CMS Content
  useEffect(() => {
    async function loadCMS() {
      setCmsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("site_content")
          .select("*");

        if (error) {
          // Table may not exist yet in local or preview, fallback to defaults
          console.warn("Could not query site_content table, using defaults:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setCmsItems((prev) => {
            const map = new Map(data.map((row: CMSItem) => [row.key, row]));
            return prev.map((item) => {
              const remote = map.get(item.key);
              return remote ? { ...item, value: remote.value } : item;
            });
          });
        }
      } catch (err) {
        console.error("CMS load error:", err);
      } finally {
        setCmsLoading(false);
      }
    }

    loadCMS();
  }, []);

  // Handle CMS Field Changes
  const handleCmsChange = (key: string, value: string) => {
    setCmsItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  // Handle CMS Image Upload
  const handleImageUpload = async (key: string, file: File) => {
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

      handleCmsChange(key, publicUrlData.publicUrl);
      setCmsSuccess(`Image for "${key}" uploaded successfully.`);
      setTimeout(() => setCmsSuccess(null), 4000);
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      setCmsError((err as Error)?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  // Save CMS Content
  const handleSaveCMS = async () => {
    setCmsSaving(true);
    setCmsSuccess(null);
    setCmsError(null);

    try {
      const supabase = createClient();
      const updates = cmsItems.map((item) => ({
        key: item.key,
        value: item.value,
        label: item.label,
        category: item.category,
        field_type: item.field_type,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("site_content")
        .upsert(updates, { onConflict: "key" });

      if (error) {
        throw error;
      }

      // Trigger ISR Cache Revalidation
      await fetch("/api/admin/revalidate", { method: "POST" });

      setCmsSuccess("Site content saved successfully! Live site cache has been revalidated.");
      setTimeout(() => setCmsSuccess(null), 5000);
    } catch (err: unknown) {
      console.error("CMS save error:", err);
      setCmsError((err as Error)?.message || "Failed to save CMS content. Check database permissions.");
    } finally {
      setCmsSaving(false);
    }
  };

  // Reset CMS to defaults
  const handleResetCMS = () => {
    if (confirm("Reset all content fields to default values?")) {
      setCmsItems(DEFAULT_CMS_ITEMS);
      setCmsSuccess("Reset to defaults. Click 'Save Changes' to apply.");
    }
  };

  const cityPieData = cityData.map((c) => ({ name: c.name, value: c.count }));

  // Group CMS items by category
  const cmsCategories = Array.from(new Set(cmsItems.map((i) => i.category)));

  return (
    <div className="space-y-6">
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ESME METRIX 2026 — Operations, Analytics & Site Content Management.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0F243A] border border-[#D97706]/20">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "metrics"
                ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-[#15304B]"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Live Metrics
          </button>
          <button
            onClick={() => setActiveTab("cms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "cms"
                ? "bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                : "text-slate-400 hover:text-white hover:bg-[#15304B]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Site Content (CMS)
          </button>
        </div>
      </div>

      {/* TAB 1: METRICS DASHBOARD */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-3">
              <span>{error}</span>
              <button
                onClick={() => { setLoading(true); setError(null); setReloadKey((k) => k + 1); }}
                className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 font-semibold hover:bg-red-500/30"
              >
                Retry
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Registrants</span>
                <Users className="w-4 h-4 text-[#D97706]" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.totalRegistered}
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                Registered attendees
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Present / Checked-In</span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-3xl font-extrabold text-[#10B981] font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.totalAttended}
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                Verified on-site gate admission
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Attendance Rate</span>
                <Percent className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-3xl font-extrabold text-[#F59E0B] font-mono tracking-tight">
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
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">LinkedIn Shares</span>
                <Share2 className="w-4 h-4 text-[#0077B5]" />
              </div>
              <div className="text-3xl font-extrabold text-[#0077B5] font-mono tracking-tight">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-600" /> : stats.linkedinShares}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Self-reported share actions
              </div>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  University Distribution
                </h2>
                <Activity className="w-4 h-4 text-[#D97706]" />
              </div>

              <div className="h-64 w-full">
                {universityData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                    {loading ? "Loading…" : "No registration data yet."}
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
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  City Demographics
                </h2>
              </div>

              <div className="h-52 w-full flex items-center justify-center">
                {cityPieData.length === 0 ? (
                  <div className="text-xs text-slate-500 font-mono">
                    {loading ? "Loading…" : "No data yet."}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {cityPieData.map((entry, index) => (
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

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono mt-2">
                {cityData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span>{c.name}: {c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Registrations Feed */}
          <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Registration Pipeline
              </h2>
              <span className="text-xs text-[#F59E0B] font-mono">Live Activity</span>
            </div>

            {recentRegistrations.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 font-mono">
                {loading ? "Loading…" : "No registrations yet."}
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {recentRegistrations.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xs font-bold text-[#F59E0B] px-2 py-0.5 rounded bg-[#F59E0B]/10">
                        {item.id}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.university}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      {item.time} <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SITE CONTENT (CMS) */}
      {activeTab === "cms" && (
        <div className="space-y-6">
          {/* Status Messages */}
          {cmsSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{cmsSuccess}</span>
            </div>
          )}

          {cmsError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{cmsError}</span>
            </div>
          )}

          {/* CMS Controls Header */}
          <div className="p-5 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <h2 className="text-base font-bold text-white">Live Site Content Editor</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Edits saved here update the database and trigger automatic cache revalidation for the live site.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetCMS}
                className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleSaveCMS}
                disabled={cmsSaving || cmsLoading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] disabled:opacity-50"
              >
                {cmsSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </>
                )}
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-[#D97706] hover:border-[#D97706] transition-colors"
                title="Preview live site"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* CMS Categories Grid */}
          <div className="space-y-6">
            {cmsCategories.map((category) => {
              const categoryItems = cmsItems.filter((i) => i.category === category);

              return (
                <div
                  key={category}
                  className="p-6 rounded-2xl bg-[#0F243A] border border-[#D97706]/20 space-y-4"
                >
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    {category}
                  </h3>

                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <div key={item.key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className="font-mono text-[10px] text-slate-500 font-normal">
                            key: {item.key}
                          </span>
                        </label>

                        {/* Text input */}
                        {item.field_type === "text" && (
                          <input
                            type="text"
                            value={item.value}
                            onChange={(e) => handleCmsChange(item.key, e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none transition-colors"
                          />
                        )}

                        {/* Textarea input */}
                        {item.field_type === "textarea" && (
                          <textarea
                            rows={6}
                            value={item.value}
                            onChange={(e) => handleCmsChange(item.key, e.target.value)}
                            className="w-full p-3.5 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none transition-colors font-mono leading-relaxed"
                          />
                        )}

                        {/* Image upload + preview */}
                        {item.field_type === "image" && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="relative w-24 h-16 rounded-xl bg-[#15304B] border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1">
                              {item.value ? (
                                <Image
                                  src={item.value}
                                  alt={item.label}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              ) : (
                                <span className="text-[10px] text-slate-500">No image</span>
                              )}
                            </div>

                            <div className="flex-1 w-full flex items-center gap-2">
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) => handleCmsChange(item.key, e.target.value)}
                                placeholder="https://... or /image.png"
                                className="flex-1 h-10 px-3.5 rounded-xl bg-[#15304B] border border-slate-700 focus:border-[#D97706] text-white text-xs focus:outline-none font-mono"
                              />

                              <label className="px-3.5 h-10 rounded-xl bg-[#1D3046] hover:bg-[#D97706]/20 border border-slate-700 hover:border-[#D97706] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                                {uploadingKey === item.key ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 text-[#D97706]" /> Replace
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingKey === item.key}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(item.key, file);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
