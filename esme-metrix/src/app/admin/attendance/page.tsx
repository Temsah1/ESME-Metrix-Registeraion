"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, Radio, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CheckInFeedItem {
  id: string;
  name: string;
  university: string;
  scanned_by: string;
  scanned_at: string;
  registration_id: string;
}

export default function AttendanceFeedPage() {
  const [items, setItems] = useState<CheckInFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadInitial() {
      try {
        const { data, error } = await supabase
          .from("attendance")
          .select("id, scanned_by, scanned_at, registrants(full_name, university, registration_id)")
          .order("scanned_at", { ascending: false })
          .limit(100);

        if (cancelled) return;
        if (error) {
          setLoadError("Failed to load check-in history from the database.");
          return;
        }

        const rows = (data ?? []).flatMap((row) => {
          const reg = row.registrants as unknown as {
            full_name: string;
            university: string;
            registration_id: string;
          } | null;
          if (!reg) return [];
          return [
            {
              id: row.id,
              name: reg.full_name,
              university: reg.university,
              scanned_by: row.scanned_by,
              scanned_at: new Date(row.scanned_at).toLocaleTimeString(),
              registration_id: reg.registration_id,
            },
          ];
        });
        setItems(rows);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoadError("Failed to load check-in history. Check your connection.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitial();

    const channel = supabase
      .channel("live-attendance-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attendance" },
        async (payload) => {
          const newRecord = payload.new as {
            id: string;
            registrant_id: string;
            scanned_by: string;
            scanned_at: string;
          };

          const { data: reg } = await supabase
            .from("registrants")
            .select("full_name, university, registration_id")
            .eq("id", newRecord.registrant_id)
            .maybeSingle();

          if (reg && !cancelled) {
            setItems((prev) => {
              if (prev.some((p) => p.id === newRecord.id)) return prev;
              return [
                {
                  id: newRecord.id,
                  name: reg.full_name,
                  university: reg.university,
                  scanned_by: newRecord.scanned_by,
                  scanned_at: new Date(newRecord.scanned_at).toLocaleTimeString(),
                  registration_id: reg.registration_id,
                },
                ...prev,
              ];
            });
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Attendance Feed</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Live check-in stream synchronized via Supabase Realtime WebSocket.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/30 text-[#00C9A7] font-mono text-xs">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>LIVE STREAM ACTIVE ({items.length} Checked In)</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#00C9A7]/20 bg-[#111820] overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-mono text-xs font-bold text-slate-400 flex items-center justify-between">
          <span>EVENT DAY CHECK-INS</span>
          <span className="text-[#00C9A7]">AUTOMATICALLY UPDATING</span>
        </div>

        <div className="divide-y divide-slate-800">
          {loadError && (
            <div className="p-4 text-xs text-red-300 flex items-center gap-2 bg-red-500/10">
              <AlertCircle className="w-4 h-4 shrink-0" /> {loadError}
            </div>
          )}
          {loading ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin inline-block mr-2 text-[#00C9A7]" />
              Loading check-in history...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No check-ins yet. Verified gate admissions will stream here in real time.
            </div>
          ) : (
            items.map((entry, index) => (
            <div
              key={entry.id || index}
              className="p-4 flex items-center justify-between hover:bg-[#1A2435]/50 transition-all text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {entry.name}
                    <span className="text-[11px] font-mono text-[#00C9A7] font-normal px-1.5 py-0.5 rounded bg-[#00C9A7]/10">
                      {entry.registration_id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{entry.university}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {entry.scanned_at}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  By: {entry.scanned_by}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
