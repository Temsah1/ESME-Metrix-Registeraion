const MIGRATION_0006_COLUMNS = new Set([
  "department",
  "is_esme_member",
  "committee",
  "role",
]);

const OPTIONAL_MIGRATION_COLUMNS = new Set([
  ...MIGRATION_0006_COLUMNS,
  "avatar_url",
  "national_id",
  "graduation_year",
]);

export interface SupabaseErrorLike {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

/**
 * Formats a compact faculty value for pre-0006 databases where dedicated
 * `department`, `is_esme_member`, `committee`, and `role` columns do not exist yet.
 */
export function buildLegacyFacultyValue(input: {
  faculty: string;
  department: string;
  isEsmeMember: boolean;
  committee?: string | null;
  role?: string | null;
}): string {
  const parts: string[] = [];
  if (input.faculty.trim()) parts.push(input.faculty.trim());
  if (
    input.department.trim() &&
    input.department.trim().toLowerCase() !== input.faculty.trim().toLowerCase()
  ) {
    parts.push(input.department.trim());
  }

  let base = parts.join(" — ") || "General";

  if (input.isEsmeMember && (input.committee || input.role)) {
    const esmeInfo = [input.committee, input.role].filter(Boolean).join(" / ");
    base = `${base} [ESME: ${esmeInfo}]`;
  }

  return base.length > 250 ? `${base.slice(0, 247)}...` : base;
}

export function isMissingColumnError(error: SupabaseErrorLike | null | undefined): boolean {
  if (!error) return false;
  if (error.code === "PGRST204" || error.code === "42703") return true;
  const msg = error.message || "";
  return /could not find the '[^']+' column|column .* does not exist/i.test(msg);
}

export function extractMissingColumnName(error: SupabaseErrorLike | null | undefined): string | null {
  const msg = error?.message || "";
  const pgrstMatch = msg.match(/Could not find the '([^']+)' column/i);
  if (pgrstMatch?.[1]) return pgrstMatch[1];

  const qualifiedPgMatch = msg.match(/column\s+[a-z0-9_]+\.([a-z0-9_]+)\s+does not exist/i);
  if (qualifiedPgMatch?.[1]) return qualifiedPgMatch[1];

  const pgMatch = msg.match(/column\s+"?([a-z0-9_]+)"?\s+(?:of relation\s+"[^"]+"\s+)?does not exist/i);
  if (pgMatch?.[1]) return pgMatch[1];

  return null;
}

/**
 * Adapts an insert payload when PostgREST/Postgres reports unapplied migrations
 * (missing 0005/0006 columns or a legacy NOT NULL constraint on `karnet_photo_url`).
 * Returns `null` when the error is unrelated or no further adaptation applies.
 */
export function adaptInsertRowForSchemaError(
  row: Record<string, unknown>,
  error: SupabaseErrorLike | null | undefined,
  context: {
    idPhotoUrl: string;
    legacyFaculty: string;
  }
): Record<string, unknown> | null {
  if (!error) return null;
  const msg = error.message || "";

  if (error.code === "23502" && /karnet_photo_url/i.test(msg)) {
    if (row.karnet_photo_url === context.idPhotoUrl) return null;
    return {
      ...row,
      karnet_photo_url: context.idPhotoUrl,
    };
  }

  if (isMissingColumnError(error)) {
    const missingCol = extractMissingColumnName(error);
    if (!missingCol || !OPTIONAL_MIGRATION_COLUMNS.has(missingCol)) {
      return null;
    }

    const nextRow: Record<string, unknown> = { ...row };
    let changed = false;

    if (MIGRATION_0006_COLUMNS.has(missingCol)) {
      for (const col of MIGRATION_0006_COLUMNS) {
        if (col in nextRow) {
          delete nextRow[col];
          changed = true;
        }
      }
      if (nextRow.faculty !== context.legacyFaculty) {
        nextRow.faculty = context.legacyFaculty;
        changed = true;
      }
    } else if (missingCol in nextRow) {
      delete nextRow[missingCol];
      changed = true;
    }

    return changed ? nextRow : null;
  }

  return null;
}
