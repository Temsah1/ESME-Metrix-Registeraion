import { createAdminClient } from "@/lib/supabase/admin";
import { REGISTRATION_ID_REGEX } from "@/lib/registration-id";
import {
  EGYPTIAN_NATIONAL_ID_REGEX,
  EGYPTIAN_PHONE_REGEX,
} from "@/lib/validations/registration";
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

export type PassLookupResult =
  | { status: "invalid" }
  | { status: "not_found" }
  | { status: "found"; pass: PublicAttendeePass };

export type MemberLoginIdentifier =
  | { kind: "phone"; value: string }
  | { kind: "email"; value: string }
  | { kind: "invalid" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SAFE_PASS_COLUMNS =
  "registration_id, full_name, email, university, faculty, department, academic_year, job_title, company, is_esme_member, committee, role, qr_code, avatar_url";

const LEGACY_PASS_COLUMNS =
  "registration_id, full_name, email, university, faculty, academic_year, job_title, company, qr_code, avatar_url";

/**
 * Extracts structured department and ESME Chapter committee/role from a legacy
 * combined `faculty` string (`"Faculty — Department [ESME: Committee / Role]"`).
 */
export function parseLegacyFacultyFallback(rawFaculty: string | null | undefined): {
  faculty: string;
  department: string;
  is_esme_member: boolean;
  committee: string | null;
  role: string | null;
} {
  let working = (rawFaculty || "").trim();
  let isEsmeMember = false;
  let committee: string | null = null;
  let role: string | null = null;

  const esmeMatch = working.match(/\[ESME:\s*([^\]]+)\]\s*$/i);
  if (esmeMatch) {
    isEsmeMember = true;
    working = working.slice(0, esmeMatch.index).trim();
    const esmeParts = esmeMatch[1].split("/").map((p) => p.trim()).filter(Boolean);
    committee = esmeParts[0] || null;
    role = esmeParts[1] || null;
  }

  const dashParts = working.split(" — ").map((p) => p.trim()).filter(Boolean);
  const faculty = dashParts[0] || working || "Engineering";
  const department = dashParts.length > 1 ? dashParts.slice(1).join(" — ") : faculty;

  return {
    faculty,
    department,
    is_esme_member: isEsmeMember,
    committee,
    role,
  };
}

/**
 * Classifies and validates an attendee login identifier (Phone Number or Email).
 */
export function parseMemberLoginIdentifier(
  raw: string | null | undefined
): MemberLoginIdentifier {
  const cleaned = (raw || "").trim();
  if (!cleaned) return { kind: "invalid" };

  if (EGYPTIAN_PHONE_REGEX.test(cleaned)) {
    return { kind: "phone", value: cleaned };
  }

  if (EMAIL_RE.test(cleaned)) {
    return { kind: "email", value: cleaned.toLowerCase() };
  }

  return { kind: "invalid" };
}

/**
 * Queries non-sensitive pass details strictly by cryptographic Ticket ID (`MX8-XXXXXX`),
 * used after registration or when restoring a saved `localStorage` session.
 */
export async function fetchPublicPassById(
  rawId: string | null | undefined
): Promise<PassLookupResult> {
  const upper = (rawId || "").trim().toUpperCase();
  if (!upper || !REGISTRATION_ID_REGEX.test(upper)) {
    return { status: "invalid" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { status: "not_found" };
  }

  const supabase = createAdminClient();
  let { data, error } = await supabase
    .from("registrants")
    .select(SAFE_PASS_COLUMNS)
    .eq("registration_id", upper)
    .maybeSingle();

  if (error && isMissingColumnError(error)) {
    const legacyRes = await supabase
      .from("registrants")
      .select(LEGACY_PASS_COLUMNS)
      .eq("registration_id", upper)
      .maybeSingle();

    if (!legacyRes.error && legacyRes.data) {
      const parsedLegacy = parseLegacyFacultyFallback(legacyRes.data.faculty);
      data = {
        ...legacyRes.data,
        ...parsedLegacy,
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

/**
 * Authenticates an attendee on `/dashboard` by verifying BOTH their registered
 * Phone Number (or Email Address) AND their 14-digit National ID against Supabase.
 */
export async function verifyMemberLogin(input: {
  identifier: string | null | undefined;
  nationalId: string | null | undefined;
}): Promise<PassLookupResult> {
  const idTarget = parseMemberLoginIdentifier(input.identifier);
  const nationalId = (input.nationalId || "").trim();

  if (idTarget.kind === "invalid" || !EGYPTIAN_NATIONAL_ID_REGEX.test(nationalId)) {
    return { status: "invalid" };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { status: "not_found" };
  }

  const column = idTarget.kind === "phone" ? "phone" : "email";
  const supabase = createAdminClient();

  let { data, error } = await supabase
    .from("registrants")
    .select(SAFE_PASS_COLUMNS)
    .eq(column, idTarget.value)
    .eq("national_id", nationalId)
    .maybeSingle();

  if (error && isMissingColumnError(error)) {
    const legacyRes = await supabase
      .from("registrants")
      .select(LEGACY_PASS_COLUMNS)
      .eq(column, idTarget.value)
      .eq("national_id", nationalId)
      .maybeSingle();

    if (!legacyRes.error && legacyRes.data) {
      const parsedLegacy = parseLegacyFacultyFallback(legacyRes.data.faculty);
      data = {
        ...legacyRes.data,
        ...parsedLegacy,
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
