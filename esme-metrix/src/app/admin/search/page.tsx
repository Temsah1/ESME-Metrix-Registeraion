"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, CheckCircle2, XCircle, Clock, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Registrant } from "@/types/database";
import { REGISTRATION_ID_REGEX } from "@/lib/registration-id";

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
        setSearchError("Search failed. Check your connection and try again.");
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
      setSearchError("Search failed. Check your connection and try again.");
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
          setCheckInError("This attendee was already checked in. Showing the recorded check-in.");
        }
      } else if (data.status === "UNAUTHORIZED") {
        setCheckInError("Your admin session expired. Sign in again to record attendance.");
      } else {
        setCheckInError(data.error || "Check-in failed. Please retry.");
      }
    } catch (e) {
      console.error(e);
      setCheckInError("Network error during check-in. Please retry.");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Attendee Search & Gate Verification</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Instant manual identity verification by Egyptian phone number, attendee name, or Registration ID.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            required
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Phone (01XXXXXXXXX), Name, or MX8-XXXXXX"
            className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#111820] border border-[#00C9A7]/30 text-white placeholder-slate-500 focus:outline-none focus:border-[#00C9A7] text-xs sm:text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 h-11 rounded-xl bg-[#00C9A7] text-[#0A0F14] font-bold text-xs sm:text-sm hover:bg-[#2DD4BF] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,201,167,0.25)] shrink-0 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          SEARCH
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
            <div className="p-6 rounded-2xl bg-[#111820] border border-[#00C9A7]/30 shadow-xl space-y-6 animate-in fade-in duration-300">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#00C9A7] px-2 py-0.5 rounded bg-[#00C9A7]/10">
                    {result.registrant.registration_id}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {result.registrant.full_name}
                  </h2>
                  <div className="text-xs text-slate-400 font-mono">
                    {result.registrant.university} • {result.registrant.faculty}
                  </div>
                </div>

                {/* Attendance Status Badge */}
                <div>
                  {result.attendance ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                      <CheckCircle2 className="w-4 h-4" /> CHECKED IN
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold font-mono">
                      <Clock className="w-4 h-4" /> NOT YET SCANNED
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Contact & Academic Credentials */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0A0F14] p-4 rounded-xl border border-slate-800 text-slate-300">
                <div><span className="text-slate-500">Phone:</span> {result.registrant.phone}</div>
                <div><span className="text-slate-500">Email:</span> {result.registrant.email}</div>
                <div><span className="text-slate-500">City:</span> {result.registrant.city}</div>
                <div><span className="text-slate-500">Year:</span> {result.registrant.academic_year}</div>
                <div><span className="text-slate-500">Job Title:</span> {result.registrant.job_title}</div>
                <div><span className="text-slate-500">Company:</span> {result.registrant.company || "None"}</div>
              </div>

              {/* Verification Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">National ID Photo:</div>
                  <div className="relative w-full h-40 rounded-xl bg-[#0A0F14] border border-slate-800 overflow-hidden">
                    <Image
                      src={result.registrant.id_photo_url || "/esme_logo.png"}
                      alt="National ID"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">Student Karnet Card:</div>
                  <div className="relative w-full h-40 rounded-xl bg-[#0A0F14] border border-slate-800 overflow-hidden">
                    <Image
                      src={result.registrant.karnet_photo_url || "/esme_logo.png"}
                      alt="Karnet Card"
                      fill
                      className="object-contain"
                      unoptimized
                    />
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
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00C9A7] to-[#007A65] text-[#0A0F14] font-extrabold text-xs sm:text-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,201,167,0.3)] disabled:opacity-50"
                  >
                    {checkingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    MARK ATTENDANCE MANUALLY
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#111820] border border-slate-800 text-center text-slate-400 text-sm">
              <XCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No matching attendee registration found for &quot;<span className="text-white font-mono">{query}</span>&quot;.
            </div>
          )}
        </>
      )}
    </div>
  );
}
