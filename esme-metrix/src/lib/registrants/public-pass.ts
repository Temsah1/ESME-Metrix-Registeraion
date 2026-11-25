import { createAdminClient } from "@/lib/supabase/admin";
import { REGISTRATION_ID_REGEX } from "@/lib/registration-id";
import { EGYPTIAN_PHONE_REGEX } from "@/lib/validations/registration";
import { isMissingColumnError } from "@/lib/supabase/registrant-compat";

export interface PublicAttendeePass {
  success: boolean;
  registration_id: string;
  full_name: string;
  email: string;
  university: string;
  faculty?: string;
  department?: string;
  academic_year?: string;
  job_title?: string;
  company?: string | null;
  is_esme_member?: boolean;
  committee?: string | null;
  role?: string | null;
  qr_code: string;
  avatar_url?: string | null;
}

export type PassLookupTarget =
  | { kind: "id"; value: string }
  | { kind: "phone"; value: string }
  | { kind: "invalid" };

export type PassLookupResult =
  | { status: "invalid" }
  | { status: "not_found" }
  | { status: "found"; pass: PublicAttendeePass };

const SAFE_PASS_COLUMNS =
  "registration_id, full_name, email, university, faculty, department, academic_year, job_title, company, is_esme_member, committee, role, qr_code, avatar_url";

const LEGACY_PASS_COLUMNS =
  "registration_id, full_name, email, university, faculty, academic_year, job_title, company, qr_code, avatar_url";

/**
 * Classifies and normalizes a public lookup token as either a Phone Number or Ticket ID.
 */
export function parsePassLookupQuery(raw: string | null | undefined): PassLookupTarget {
  const cleaned = (raw || "").trim();
  if (!cleaned) return { kind: "invalid" };

  if (EGYPTIAN_PHONE_REGEX.test(cleaned)) {
    return { kind: "phone", value: cleaned };
  }

  const upper = cleaned.toUpperCase();
  if (REGISTRATION_ID_REGEX.test(upper)) {
    return { kind: "id", value: upper };
  }

  return { kind: "invalid" };
}

/**
 * Queries non-sensitive attendee pass details by Ticket ID or Mobile Phone.
 * Never exposes National ID numbers, phone numbers, or uploaded ID document URLs.
 */
export async function fetchPublicPass(rawLookup: string | null | undefined): Promise<PassLookupResult> {
  const target = parsePassLookupQuery(rawLookup);
  if (target.kind === "invalid") {
    return { status: "invalid" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { status: "not_found" };
  }

  const column = target.kind === "phone" ? "phone" : "registration_id";
  const supabase = createAdminClient();

  let { data, error } = await supabase
    .from("registrants")
    .select(SAFE_PASS_COLUMNS)
    .eq(column, target.value)
    .maybeSingle();

  if (error && isMissingColumnError(error)) {
    const legacyRes = await supabase
      .from("registrants")
      .select(LEGACY_PASS_COLUMNS)
      .eq(column, target.value)
      .maybeSingle();

    if (!legacyRes.error && legacyRes.data) {
      data = {
        ...legacyRes.data,
        department: legacyRes.data.faculty,
        is_esme_member: false,
        committee: null,
        role: null,
      };
      error = null;
    } else {
      error = legacyRes.error;
    }
  }

  if (error || !data) {
    return { status: "not_found" };
  }

  return {
    status: "found",
    pass: {
      success: true,
      ...data,
    },
  };
}
