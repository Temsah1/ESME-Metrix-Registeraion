"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Search, Download, Eye, X, AlertCircle, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import * as XLSX from "xlsx";
import { Registrant } from "@/types/database";
import { getAdminPhotoUrl } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getDictionary } from "@/lib/i18n/dictionary";
import {
  localizeCity,
  localizeCommittee,
  localizeDepartment,
  localizeFaculty,
} from "@/lib/i18n/registrationLabels";

export default function RegistrantsPage() {
  const { lang } = useLanguage();
  const t = getDictionary(lang);
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
          setLoadError("load_failed");
          return;
        }
        setRegistrants(data ?? []);
      } catch (err) {
        console.error(err);
        setLoadError("load_failed");
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
      "LinkedIn Shared": r.linkedin_shared ? "Yes" : "No",
      "Registration Date": new Date(r.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
    XLSX.writeFile(workbook, `ESME-METRIX-Registrants-${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6 text-start">
      {/* Page Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.admin.registrantsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "ar"
              ? `إجمالي السجلات المطابقة: ${filteredRegistrants.length}`
              : `Total ${filteredRegistrants.length} filtered records`}
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)] cursor-pointer"
        >
          <Download className="w-4 h-4" /> {t.admin.exportCsv}
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0F243A] border border-[#D97706]/20">
        <div className="relative">
          <Search className="w-4 h-4 absolute start-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full h-10 ps-9 pe-3 rounded-lg bg-[#15304B] border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-[#D97706] text-xs"
          />
        </div>

        <div>
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[#15304B] border border-slate-700 text-slate-200 focus:outline-none focus:border-[#D97706] text-xs"
          >
            <option value="ALL">{lang === "ar" ? "جميع الجامعات" : "All Universities"}</option>
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
            <option value="ALL">
              {lang === "ar" ? "جميع المشاركين (أعضاء وغير أعضاء)" : "All Attendees (ESME & External)"}
            </option>
            <option value="YES">
              {lang === "ar" ? "أعضاء شابتر ESME فقط" : "ESME Chapter Members Only"}
            </option>
            <option value="NO">
              {lang === "ar" ? "غير الأعضاء فقط" : "Non-ESME Attendees Only"}
            </option>
          </select>
        </div>
      </div>

      {/* Registrants Table */}
      {loadError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {lang === "ar"
              ? "تعذّر تحميل بيانات المسجلين من قاعدة البيانات."
              : "Failed to load registrants from the database."}
          </span>
          <button
            onClick={() => {
              setLoading(true);
              setLoadError(null);
              setReloadKey((k) => k + 1);
            }}
            className="px-3 py-1.5 rounded-lg border border-red-500/40 font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            {t.common.retry}
          </button>
        </div>
      )}
      <div className="rounded-xl border border-[#D97706]/20 bg-[#0F243A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-[#15304B]/80 text-slate-400">
                <th className="p-3.5">{t.dashboard.ticketIdLabel}</th>
                <th className="p-3.5">{t.register.reviewNamesLabel}</th>
                <th className="p-3.5">{t.register.reviewNationalIdLabel}</th>
                <th className="p-3.5">{t.register.reviewPhoneLabel}</th>
                <th className="p-3.5">{t.register.reviewDepartmentLabel}</th>
                <th className="p-3.5">{t.register.reviewEsmeLabel}</th>
                <th className="p-3.5">{t.register.reviewYearLabel}</th>
                <th className="p-3.5 text-center">LinkedIn</th>
                <th className="p-3.5 text-end">{lang === "ar" ? "التفاصيل" : "ACTIONS"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin inline-block me-2 text-[#D97706]" />
                    {t.common.loading}
                  </td>
                </tr>
              ) : filteredRegistrants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400">
                    {registrants.length === 0
                      ? lang === "ar"
                        ? "لا يوجد مسجلون حتى الآن."
                        : "No registrants yet. Records will appear here after real registrations."
                      : lang === "ar"
                      ? "لا توجد نتائج مطابقة لخيارات البحث أو التصفية."
                      : "No records match the current search or filters."}
                  </td>
                </tr>
              ) : (
                filteredRegistrants.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1D3046]/60 transition-colors">
                    <td dir="ltr" className="p-3.5 font-mono font-bold text-[#F59E0B]">
                      {item.registration_id}
                    </td>
                    <td className="p-3.5 font-semibold text-white">{item.full_name}</td>
                    <td dir="ltr" className="p-3.5 font-mono text-slate-300">
                      {item.national_id || "—"}
                    </td>
                    <td dir="ltr" className="p-3.5 font-mono text-slate-400">
                      {item.phone}
                    </td>
                    <td
                      className="p-3.5 text-slate-300 max-w-[220px]"
                      title={`${item.faculty}${item.department ? ` — ${item.department}` : ""}`}
                    >
                      <div className="truncate font-medium text-white">
                        {localizeFaculty(item.faculty, lang)}
                      </div>
                      {item.department && item.department !== item.faculty && (
                        <div className="truncate text-[11px] text-slate-400">
                          {localizeDepartment(item.department, lang)}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      {item.is_esme_member ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#D97706]/15 border border-[#D97706]/30 text-[#F59E0B] text-[10px] font-bold">
                          {item.committee
                            ? lang === "ar"
                              ? `عضو ESME — ${localizeCommittee(item.committee, lang)}`
                              : `ESME Member — ${item.committee}`
                            : t.register.yesEsmeMember}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          {t.register.noEsmeMember}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono">
                      {item.academic_year} {item.graduation_year ? `(${item.graduation_year})` : ""}
                    </td>
                    <td className="p-3.5 text-center">
                      {item.linkedin_shared ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          {lang === "ar" ? "تمت المشاركة" : "Shared"}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px]">
                          {lang === "ar" ? "قيد الانتظار" : "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRegistrant(item)}
                          className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-[#D97706] transition-colors inline-flex items-center gap-1 text-[11px] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D97706]" />
                          {lang === "ar" ? "عرض" : "View"}
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
          <div className="w-full max-w-2xl rounded-2xl bg-[#0F243A] border border-[#D97706]/40 p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto text-start">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span dir="ltr" className="font-mono text-xs text-[#F59E0B] font-bold">
                  {selectedRegistrant.registration_id}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {selectedRegistrant.full_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRegistrant(null)}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 bg-[#15304B] p-4 rounded-xl border border-slate-800">
              <div>
                <strong className="text-slate-400">{t.register.reviewNationalIdLabel}:</strong>{" "}
                <span dir="ltr" className="font-mono">{selectedRegistrant.national_id || "—"}</span>
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewPhoneLabel}:</strong>{" "}
                <span dir="ltr" className="font-mono">{selectedRegistrant.phone}</span>
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewEmailLabel}:</strong>{" "}
                <span dir="ltr" className="font-mono">{selectedRegistrant.email}</span>
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewUniversityLabel}:</strong>{" "}
                {selectedRegistrant.university}
              </div>
              <div className="sm:col-span-2">
                <strong className="text-slate-400">{t.register.reviewFacultyLabel}:</strong>{" "}
                {localizeFaculty(selectedRegistrant.faculty, lang)}
              </div>
              <div className="sm:col-span-2">
                <strong className="text-slate-400">{t.register.reviewDepartmentLabel}:</strong>{" "}
                {localizeDepartment(selectedRegistrant.department || selectedRegistrant.faculty, lang)}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewYearLabel}:</strong>{" "}
                {selectedRegistrant.academic_year}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewGradYearLabel}:</strong>{" "}
                {selectedRegistrant.graduation_year || "—"}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewCityLabel}:</strong>{" "}
                {localizeCity(selectedRegistrant.city, lang)}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewRoleLabel}:</strong>{" "}
                {selectedRegistrant.job_title}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewCompanyLabel}:</strong>{" "}
                {selectedRegistrant.company || "—"}
              </div>
              <div>
                <strong className="text-slate-400">LinkedIn:</strong>{" "}
                {selectedRegistrant.linkedin_shared
                  ? lang === "ar"
                    ? "تمت المشاركة"
                    : "Shared"
                  : lang === "ar"
                  ? "قيد الانتظار"
                  : "Pending"}
              </div>
              <div>
                <strong className="text-slate-400">{t.register.reviewEsmeLabel}:</strong>{" "}
                {selectedRegistrant.is_esme_member
                  ? t.register.yesEsmeMember
                  : t.register.noEsmeMember}
              </div>
              {selectedRegistrant.is_esme_member && (
                <div>
                  <strong className="text-slate-400">{t.register.committeeLabel}:</strong>{" "}
                  {selectedRegistrant.committee
                    ? localizeCommittee(selectedRegistrant.committee, lang)
                    : "—"}
                </div>
              )}
            </div>

            {/* Verification & Badge Photos Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === "ar" ? "صورة بطاقة الرقم القومي:" : "National ID Photo:"}
                </div>
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
                <div className="text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === "ar" ? "الصورة الشخصية للبادج:" : "Badge Portrait Photo (Optional):"}
                </div>
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
                      <span>{lang === "ar" ? "لم تُرفع صورة شخصية" : "No portrait uploaded"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedRegistrant(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
