import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArrowRight, Calendar, MapPin, Ticket } from "lucide-react";
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

export async function buildShareMetadata(
  routePrefix: "share" | "ticket",
  ticketId: string,
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  let name = firstParam(searchParams?.name) || "Attendee";
  let university = firstParam(searchParams?.university) || "";
  let major = firstParam(searchParams?.major) || "";
  let role = firstParam(searchParams?.role) || "";
  let foundInDb = false;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrants")
        .select(
          "full_name, university, faculty, department, job_title, is_esme_member, committee, role"
        )
        .eq("registration_id", ticketId)
        .maybeSingle();

      if (data) {
        foundInDb = true;
        name = data.full_name || name;
        university = data.university || university;
        major = data.department || data.faculty || major;
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

  const ogQuery = new URLSearchParams();
  if (ticketId) ogQuery.set("id", ticketId);
  if (!foundInDb) {
    if (name && name !== "Attendee") ogQuery.set("name", name);
    if (university) ogQuery.set("university", university);
    if (major) ogQuery.set("major", major);
    if (role) ogQuery.set("role", role);
  }

  const title = `${name} is attending ESME METRIX!`;
  const description =
    "Join us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.";
  const ogImageUrl = `${baseUrl}/api/og?${ogQuery.toString()}`;
  const canonicalUrl = `${baseUrl}/${routePrefix}/${encodeURIComponent(ticketId)}`;

  return {
    title,
    description,
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

export async function ShareBadgeLanding({
  ticketId,
  searchParams,
}: {
  ticketId: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let attendeeName = firstParam(searchParams?.name) || "ESME METRIX Attendee";

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("registrants")
        .select("full_name")
        .eq("registration_id", ticketId)
        .maybeSingle();
      if (data?.full_name) {
        attendeeName = data.full_name;
      }
    }
  } catch {
    // Fallback to query param / generic name when offline
  }

  const ogQuery = new URLSearchParams({ id: ticketId });
  const nameParam = firstParam(searchParams?.name);
  const uniParam = firstParam(searchParams?.university);
  const majorParam = firstParam(searchParams?.major);
  const roleParam = firstParam(searchParams?.role);
  if (nameParam) ogQuery.set("name", nameParam);
  if (uniParam) ogQuery.set("university", uniParam);
  if (majorParam) ogQuery.set("major", majorParam);
  if (roleParam) ogQuery.set("role", roleParam);

  const ogSrc = `/api/og?${ogQuery.toString()}`;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-10 sm:py-16 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/35 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-4 font-semibold">
        <Ticket className="w-3.5 h-3.5" />
        OFFICIAL ATTENDEE BADGE • {ticketId}
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
        {attendeeName} is Attending <span className="text-[#F59E0B]">ESME METRIX</span>!
      </h1>
      <p className="text-slate-300 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
        Join us on 12 December 2026 at Cairo University for an exciting event exploring Materials
        Engineering, innovation, and advanced materials.
      </p>

      <div className="w-full rounded-2xl overflow-hidden border-2 border-[#D97706]/40 shadow-2xl bg-[#07111E] mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogSrc}
          alt={`${attendeeName} — ESME METRIX Attendance Badge`}
          className="w-full h-auto block"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 font-mono mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
          <Calendar className="w-4 h-4 text-[#F59E0B]" /> 12 December 2026
        </span>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F243A] border border-slate-800">
          <MapPin className="w-4 h-4 text-[#F59E0B]" /> Cairo University
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register"
          className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_20px_rgba(217,119,6,0.35)] transition-all flex items-center gap-2"
        >
          Register Now for ESME METRIX <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl border border-slate-700 bg-[#0F243A] text-slate-300 hover:text-white hover:border-slate-500 text-xs sm:text-sm font-semibold transition-colors"
        >
          Explore Event Details
        </Link>
      </div>
    </div>
  );
}
