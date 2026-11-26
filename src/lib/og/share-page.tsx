import type { Metadata } from "next";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingColumnError } from "@/lib/supabase/registrant-compat";
import { formatRoleOrMajor } from "@/lib/og/card-data";
import ShareBadgeClient from "@/components/ShareBadgeClient";

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
          "full_name, university, faculty, department, job_title, is_esme_member, committee, avatar_url"
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
  if (!attendee.foundInDb) {
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
    <ShareBadgeClient
      attendeeName={attendee.name}
      attendeeUniversity={attendee.university}
      ticketId={ticketId}
      ogSrc={ogSrc}
    />
  );
}
