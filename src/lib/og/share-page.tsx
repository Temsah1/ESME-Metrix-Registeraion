import type { Metadata } from "next";
import Link from "next/link";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingColumnError } from "@/lib/supabase/registrant-compat";
import { ArrowRight, Calendar, Download, MapPin, Ticket } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { OFFICIAL_ESME_LINKEDIN_URL } from "@/config/registration";
import { formatRoleOrMajor } from "@/lib/og/card-data";

export interface SharePageProps {
  params: Promise<{ ticketId?: string; id?: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

function firstParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0] || "";
  return val || "";
}

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL || "https://esme-metrix-registeration.vercel.app"
  ).replace(/\/$/, "");
}

function computeOgCacheVersion(input: {
  name: string;
  university: string;
  avatarUrl?: string | null;
}): string {
  return crypto
    .createHash("sha256")
    .update(`${input.name}|${input.university}|${input.avatarUrl || ""}`)
    .digest("hex")
    .slice(0, 8);
}

interface ResolvedShareAttendee {
  foundInDb: boolean;
  name: string;
  university: string;
  major: string;
  role: string;
  avatarUrl: string | null;
}

async function resolveShareAttendee(
  ticketId: string,
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<ResolvedShareAttendee> {
  let name = firstParam(searchParams?.name) || "ESME METRIX Attendee";
  let university = firstParam(searchParams?.university) || "";
  let major = firstParam(searchParams?.major) || "";
  let role = firstParam(searchParams?.role) || "";
  let avatarUrl: string | null = null;
  let foundInDb = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && ticketId) {
      const supabase = createAdminClient();
      const { data: primaryData, error: primaryError } = await supabase
        .from("registrants")
        .select(
          "full_name, university, faculty, department, job_title, is_esme_member, committee, role, avatar_url"
        )
        .eq("registration_id", ticketId)
        .maybeSingle();

      let data = primaryData;
      if (primaryError && isMissingColumnError(primaryError)) {
        const legacyRes = await supabase
          .from("registrants")
          .select("full_name, university, faculty, job_title, avatar_url")
          .eq("registration_id", ticketId)
          .maybeSingle();
        if (!legacyRes.error && legacyRes.data) {
          data = {
            ...legacyRes.data,
            department: legacyRes.data.faculty,
            is_esme_member: false,
            committee: null,
            role: null,
          };
        }
      }

      if (data) {
        foundInDb = true;
        name = data.full_name || name;
        university = data.university || university;
        major = data.department || data.faculty || major;
        avatarUrl = data.avatar_url || null;
        role = formatRoleOrMajor({
          jobTitle: data.job_title,
          department: data.department,
          faculty: data.faculty,
          isEsmeMember: data.is_esme_member,
          committee: data.committee,
          role: data.role,
        });
      }
    }
  } catch (e) {
    console.error("OG registrant fetch failed:", e);
  }

  return { foundInDb, name, university, major, role, avatarUrl };
}

export async function buildShareMetadata(
  routePrefix: "share" | "ticket",
  ticketId: string,
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const attendee = await resolveShareAttendee(ticketId, searchParams);

  const ogQuery = new URLSearchParams();
  if (ticketId) ogQuery.set("id", ticketId);
  if (attendee.foundInDb) {
    ogQuery.set(
      "v",
      computeOgCacheVersion({
        name: attendee.name,
        university: attendee.university,
        avatarUrl: attendee.avatarUrl,
      })
    );
  } else {
    if (attendee.name && attendee.name !== "ESME METRIX Attendee") {
      ogQuery.set("name", attendee.name);
    }
    if (attendee.university) ogQuery.set("university", attendee.university);
    if (attendee.major) ogQuery.set("major", attendee.major);
    if (attendee.role) ogQuery.set("role", attendee.role);
  }

  const displayName =
    attendee.name === "ESME METRIX Attendee" ? "Attendee" : attendee.name;
  const title = `${displayName} is attending ESME METRIX!`;
  const description =
    "Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.";
  const ogImageUrl = `${baseUrl}/api/og?${ogQuery.toString()}`;
  const canonicalUrl = `${baseUrl}/${routePrefix}/${encodeURIComponent(ticketId)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ESME METRIX 2026",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 675,
          type: "image/png",
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Standalone public personalized "I'm Attending" card view — completely isolated
 * from the Member Dashboard, QR gate credentials, lookup controls, and Admin links.
 */
export async function ShareBadgeLanding({
  ticketId,
  searchParams,
}: {
  ticketId: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const attendee = await resolveShareAttendee(ticketId, searchParams);

  const ogQuery = new URLSearchParams();
  if (ticketId) ogQuery.set("id", ticketId);
  if (attendee.foundInDb) {
    ogQuery.set(
      "v",
      computeOgCacheVersion({
        name: attendee.name,
        university: attendee.university,
        avatarUrl: attendee.avatarUrl,
      })
    );
  } else {
    const nameParam = firstParam(searchParams?.name);
    const uniParam = firstParam(searchParams?.university);
    const majorParam = firstParam(searchParams?.major);
    const roleParam = firstParam(searchParams?.role);
    if (nameParam) ogQuery.set("name", nameParam);
    if (uniParam) ogQuery.set("university", uniParam);
    if (majorParam) ogQuery.set("major", majorParam);
    if (roleParam) ogQuery.set("role", roleParam);
  }

  const ogSrc = `/api/og?${ogQuery.toString()}`;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10 sm:py-14 bg-[#15304B]">
      <div className="max-w-4xl w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/40 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-4 font-semibold uppercase tracking-wider">
          <Ticket className="w-3.5 h-3.5" />
          ESME METRIX 2026 • OFFICIAL ATTENDING CARD
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          {attendee.name} is Attending <span className="text-[#F59E0B]">ESME METRIX</span>!
        </h1>
        {attendee.university ? (
          <p className="text-xs sm:text-sm font-mono text-amber-200/90 mb-3">
            {attendee.university}
          </p>
        ) : null}
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-7 leading-relaxed">
          Join us on 12 December 2026 at Cairo University for an exciting event exploring the
          world of Materials Engineering, innovation, and advanced materials.
        </p>

        {/* Standalone 16:9 Personalized Card Display */}
        <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/50 shadow-[0_0_45px_rgba(217,119,6,0.22)] bg-[#07111E] mb-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogSrc}
            alt={`${attendee.name} — ESME METRIX Attendance Card`}
            className="w-full h-auto block"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 font-mono mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
            <Calendar className="w-4 h-4 text-[#F59E0B]" /> Saturday, 12 December 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
            <MapPin className="w-4 h-4 text-[#F59E0B]" /> Cairo University
          </span>
        </div>

        {/* Focused Public Actions (Registration + Official Chapter LinkedIn + Download Card) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(217,119,6,0.35)] transition-all flex items-center gap-2"
          >
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={OFFICIAL_ESME_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,119,181,0.3)]"
          >
            <FaLinkedin className="w-4 h-4" /> Follow ESME Cairo University
          </a>
          <a
            href={ogSrc}
            download={`ESME-METRIX-Attending-${ticketId || "Card"}.png`}
            className="px-5 py-3.5 rounded-xl border border-slate-700 bg-[#0F243A] text-slate-200 hover:text-white hover:border-[#D97706] text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#F59E0B]" /> Download Card (PNG)
          </a>
        </div>

        <p className="mt-8 text-[11px] font-mono text-slate-400">
          ESME Cairo University Student Chapter • Materials Engineering Event
        </p>
      </div>
    </div>
  );
}
