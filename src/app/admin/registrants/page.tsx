"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Search, Download, Eye, X, AlertCircle, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import * as XLSX from "xlsx";
import { Registrant } from "@/types/database";
import { getAdminPhotoUrl } from "@/lib/utils";

export default function RegistrantsPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("ALL");
  const [selectedEsmeFilter, setSelectedEsmeFilter] = useState("ALL");
  const [selectedRegistrant, setSelectedRegistrant] = useState<Registrant | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("registrants")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          setLoadError("Failed to load registrants from the database.");
          return;
        }
        setRegistrants(data ?? []);
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load registrants. Check your connection and retry.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reloadKey]);

  const universityOptions = useMemo(() => {
    const set = new Set<string>(["Cairo University", "Ain Shams University", "Helwan University"]);
    for (const r of registrants) {
      if (r.university?.trim()) set.add(r.university.trim());
    }
    return Array.from(set).sort();
  }, [registrants]);

  const filteredRegistrants = registrants.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      r.full_name.toLowerCase().includes(q) ||
      r.phone.includes(searchTerm) ||
      (r.national_id && r.national_id.includes(searchTerm)) ||
      r.email.toLowerCase().includes(q) ||
      r.registration_id.toLowerCase().includes(q) ||
      (r.faculty && r.faculty.toLowerCase().includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q)) ||
      (r.committee && r.committee.toLowerCase().includes(q));

    const matchesUniv = selectedUniversity === "ALL" || r.university === selectedUniversity;
    const matchesEsme =
      selectedEsmeFilter === "ALL" ||
      (selectedEsmeFilter === "YES" && Boolean(r.is_esme_member)) ||
      (selectedEsmeFilter === "NO" && !r.is_esme_member);

    return matchesSearch && matchesUniv && matchesEsme;
  });

  const handleExportExcel = () => {
    const exportData = filteredRegistrants.map((r) => ({
      "Registration ID": r.registration_id,
      "Full Name": r.full_name,
      "National ID": r.national_id || "N/A",
      Phone: r.phone,
      Email: r.email,
      University: r.university,
      Faculty: r.faculty,
      "Department / Major": r.department || r.faculty,
      "Academic Year": r.academic_year,
      "Graduation Year": r.graduation_year || "N/A",
      City: r.city,
      "Job Title": r.job_title,
      Company: r.company || "N/A",
      "ESME Member": r.is_esme_member ? "Yes" : "No",
      Committee: r.is_esme_member ? r.committee || "N/A" : "N/A",
      Role: r.is_esme_member ? r.role || "N/A" : "N/A",
      "LinkedIn Shared": r.linkedin_shared ? "Yes" : "No",
      "Registration Date": new Date(r.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
    XLSX.writeFile(workbook, `ESME-METRIX-Registrants-${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registered Attendees</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Total {filteredRegistrants.length} filtered records
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]"
        >
          <Download className="w-4 h-4" /> EXPORT TO EXCEL (.XLSX)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0F243A] border border-[#D97706]/20">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, National ID, faculty, major, committee, ID..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#15304B] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#D97706] text-xs"
          />
        </div>

        <div>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[#15304B] border border-slate-700 text-slate-200 focus:outline-none focus:border-[#D97706] text-xs"
          >
            <option value="ALL">All Universities</option>
            {universityOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedEsmeFilter}
            onChange={(e) => setSelectedEsmeFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[#15304B] border border-slate-700 text-slate-200 focus:outline-none focus:border-[#D97706] text-xs"
          >
            <option value="ALL">All Attendees (ESME &amp; External)</option>
            <option value="YES">ESME Chapter Members Only</option>
            <option value="NO">Non-ESME Attendees Only</option>
          </select>
        </div>
      </div>

      {/* Registrants Table */}
      {loadError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {loadError}
          </span>
          <button
            onClick={() => { setLoading(true); setLoadError(null); setReloadKey((k) => k + 1); }}
            className="px-3 py-1.5 rounded-lg border border-red-500/40 font-semibold hover:bg-red-500/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      <div className="rounded-xl border border-[#D97706]/20 bg-[#0F243A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#15304B]/80 font-mono text-slate-400">
                <th className="p-3.5">REG ID</th>
                <th className="p-3.5">NAME</th>
                <th className="p-3.5">NATIONAL ID</th>
                <th className="p-3.5">PHONE</th>
                <th className="p-3.5">FACULTY &amp; MAJOR</th>
                <th className="p-3.5">ESME CHAPTER</th>
                <th className="p-3.5">YEAR</th>
                <th className="p-3.5 text-center">LINKEDIN</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2 text-[#D97706]" />
                    Loading registrants...
                  </td>
                </tr>
              ) : filteredRegistrants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400">
                    {registrants.length === 0
                      ? "No registrants yet. Records will appear here after real registrations."
                      : "No records match the current search or filters."}
                  </td>
                </tr>
              ) : (
                filteredRegistrants.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1D3046]/60 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#F59E0B]">
                      {item.registration_id}
                    </td>
                    <td className="p-3.5 font-semibold text-white">{item.full_name}</td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {item.national_id || "—"}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{item.phone}</td>
                    <td
                      className="p-3.5 text-slate-300 max-w-[220px]"
                      title={`${item.faculty}${item.department ? ` — ${item.department}` : ""}`}
                    >
                      <div className="truncate font-medium text-white">{item.faculty}</div>
                      {item.department && item.department !== item.faculty && (
                        <div className="truncate text-[11px] text-slate-400">{item.department}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      {item.is_esme_member ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#D97706]/15 border border-[#D97706]/30 text-[#F59E0B] text-[10px] font-bold">
                          {item.committee || "Member"}{item.role ? ` • ${item.role}` : ""}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono">
                      {item.academic_year} {item.graduation_year ? `(${item.graduation_year})` : ""}
                    </td>
                    <td className="p-3.5 text-center">
                      {item.linkedin_shared ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          Shared
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRegistrant(item)}
                          className="px-2 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-[#D97706] transition-colors inline-flex items-center gap-1 text-[11px]"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D97706]" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Drawer / Modal */}
      {selectedRegistrant && (
        <div className="fixed inset-0 z-50 bg-[#15304B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0F243A] border border-[#D97706]/40 p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-[#F59E0B] font-bold">
                  {selectedRegistrant.registration_id}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {selectedRegistrant.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRegistrant(null)}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300 bg-[#15304B] p-4 rounded-xl border border-slate-800">
              <div><strong className="text-slate-400">National ID:</strong> {selectedRegistrant.national_id || "N/A"}</div>
              <div><strong className="text-slate-400">Phone:</strong> {selectedRegistrant.phone}</div>
              <div><strong className="text-slate-400">Email:</strong> {selectedRegistrant.email}</div>
              <div><strong className="text-slate-400">University:</strong> {selectedRegistrant.university}</div>
              <div className="sm:col-span-2"><strong className="text-slate-400">Faculty:</strong> {selectedRegistrant.faculty}</div>
              <div className="sm:col-span-2"><strong className="text-slate-400">Department / Major:</strong> {selectedRegistrant.department || selectedRegistrant.faculty}</div>
              <div><strong className="text-slate-400">Year:</strong> {selectedRegistrant.academic_year}</div>
              <div><strong className="text-slate-400">Graduation Year:</strong> {selectedRegistrant.graduation_year || "N/A"}</div>
              <div><strong className="text-slate-400">City:</strong> {selectedRegistrant.city}</div>
              <div><strong className="text-slate-400">Job Title:</strong> {selectedRegistrant.job_title}</div>
              <div><strong className="text-slate-400">Company:</strong> {selectedRegistrant.company || "None"}</div>
              <div><strong className="text-slate-400">LinkedIn Status:</strong> {selectedRegistrant.linkedin_shared ? "Shared" : "Pending"}</div>
              <div><strong className="text-slate-400">ESME Member:</strong> {selectedRegistrant.is_esme_member ? "Yes" : "No"}</div>
              {selectedRegistrant.is_esme_member && (
                <>
                  <div><strong className="text-slate-400">Committee:</strong> {selectedRegistrant.committee || "N/A"}</div>
                  <div><strong className="text-slate-400">Role / Position:</strong> {selectedRegistrant.role || "N/A"}</div>
                </>
              )}
            </div>

            {/* Verification & Badge Photos Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1.5">National ID Photo:</div>
                <div className="relative w-full h-44 rounded-xl border border-slate-800 bg-[#15304B] overflow-hidden">
                  <Image
                    src={getAdminPhotoUrl(selectedRegistrant.id_photo_url)}
                    alt="National ID"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1.5">Badge Portrait Photo (Optional):</div>
                <div className="relative w-full h-44 rounded-xl border border-slate-800 bg-[#15304B] overflow-hidden flex items-center justify-center">
                  {selectedRegistrant.avatar_url ? (
                    <Image
                      src={getAdminPhotoUrl(selectedRegistrant.avatar_url)}
                      alt="Badge Portrait"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs">
                      <User className="w-7 h-7" />
                      <span>No portrait uploaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRegistrant(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
