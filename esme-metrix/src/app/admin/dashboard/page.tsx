"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Percent,
  Share2,
  Activity,
  ArrowUpRight,
  Loader2,
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

  const cityPieData = cityData.map((c) => ({ name: c.name, value: c.count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Event Metrics & Live Radar</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time telemetry for ESME METRIX 2026 check-in operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
          </span>
          <span className="text-xs font-mono text-[#10B981] uppercase font-semibold">
            Supabase Realtime Synchronized
          </span>
        </div>
      </div>

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
  );
}