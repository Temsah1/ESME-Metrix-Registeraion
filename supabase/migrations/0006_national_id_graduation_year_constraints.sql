-- ═══════════════════════════════════════════════════════════════════
-- Migration 0006: National ID & Graduation Year — database connections
-- ═══════════════════════════════════════════════════════════════════
-- Migration 0005 added `national_id` and `graduation_year` as plain
-- nullable columns. Nothing in the database enforced them, so:
--   * two people could register with the same National ID,
--   * malformed values could be written by any client that bypassed the
--     form (the anon "Public insert registrants" policy still allows it),
--   * PostgREST could keep a stale schema cache and reject inserts with
--     "Could not find the 'national_id' column of 'registrants'".
--
-- This migration is idempotent: it is safe to run more than once, and safe
-- to run on a database that already has registrations.
-- Run AFTER 0005_fields_and_agenda.sql.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Make sure the columns exist (no-op if 0005 already ran) ──────
ALTER TABLE public.registrants
  ADD COLUMN IF NOT EXISTS national_id     VARCHAR(20),
  ADD COLUMN IF NOT EXISTS graduation_year VARCHAR(10);

-- ── 2. Clean existing values before adding constraints ─────────────
UPDATE public.registrants
   SET national_id = NULLIF(btrim(national_id), '')
 WHERE national_id IS DISTINCT FROM NULLIF(btrim(national_id), '');

UPDATE public.registrants
   SET graduation_year = NULLIF(btrim(graduation_year), '')
 WHERE graduation_year IS DISTINCT FROM NULLIF(btrim(graduation_year), '');

-- ── 3. Format checks (match src/lib/validations/registration.ts) ───
-- NOT VALID = enforced for every new INSERT/UPDATE, without failing on
-- older rows. Section 6 shows how to validate old rows afterwards.
ALTER TABLE public.registrants
  DROP CONSTRAINT IF EXISTS registrants_national_id_format_chk;
ALTER TABLE public.registrants
  ADD CONSTRAINT registrants_national_id_format_chk
  CHECK (national_id IS NULL OR national_id ~ '^[23][0-9]{13}$') NOT VALID;

ALTER TABLE public.registrants
  DROP CONSTRAINT IF EXISTS registrants_graduation_year_format_chk;
ALTER TABLE public.registrants
  ADD CONSTRAINT registrants_graduation_year_format_chk
  CHECK (graduation_year IS NULL OR graduation_year ~ '^(19|20)[0-9]{2}$') NOT VALID;

-- ── 4. One registration per National ID ────────────────────────────
-- Partial unique index: legacy rows without a National ID (NULL) are
-- allowed, but no two rows may share the same non-NULL value.
-- The app's /api/register route maps a violation of this index
-- (error 23505, name contains "national_id") to a friendly 409 message.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM public.registrants
     WHERE national_id IS NOT NULL
     GROUP BY national_id
    HAVING COUNT(*) > 1
  ) THEN
    RAISE WARNING
      'uq_registrants_national_id NOT created: duplicate National IDs exist. '
      'Resolve them with the query in section 6, then run this migration again.';
  ELSE
    CREATE UNIQUE INDEX IF NOT EXISTS uq_registrants_national_id
      ON public.registrants (national_id)
      WHERE national_id IS NOT NULL;
  END IF;
END $$;

-- ── 5. Index for admin filtering / reporting by graduation year ────
CREATE INDEX IF NOT EXISTS idx_registrants_graduation_year
  ON public.registrants (graduation_year);

-- Column documentation (visible in Supabase Table Editor)
COMMENT ON COLUMN public.registrants.national_id IS
  'Egyptian National ID (14 digits, starts with 2 or 3). Unique. Sensitive: admin-only, never exposed on public/share/OG endpoints.';
COMMENT ON COLUMN public.registrants.graduation_year IS
  'Expected or actual graduation year, 4 digits (e.g. 2026).';

-- ── 6. Refresh the Supabase API (PostgREST) schema cache ───────────
-- Without this, the API may not "see" the new columns/constraints until
-- the cache refreshes on its own.
NOTIFY pgrst, 'reload schema';

-- ── 7. Optional maintenance queries (run manually) ─────────────────
-- Find duplicate National IDs that block the unique index:
--   SELECT national_id, array_agg(registration_id ORDER BY created_at)
--     FROM public.registrants
--    WHERE national_id IS NOT NULL
--    GROUP BY national_id HAVING COUNT(*) > 1;
--
-- Find old rows that break the format checks:
--   SELECT registration_id, national_id, graduation_year
--     FROM public.registrants
--    WHERE (national_id IS NOT NULL AND national_id !~ '^[23][0-9]{13}$')
--       OR (graduation_year IS NOT NULL AND graduation_year !~ '^(19|20)[0-9]{2}$');
--
-- Once those are fixed, validate the constraints for ALL rows:
--   ALTER TABLE public.registrants VALIDATE CONSTRAINT registrants_national_id_format_chk;
--   ALTER TABLE public.registrants VALIDATE CONSTRAINT registrants_graduation_year_format_chk;
--
-- Once every registrant has both values, you may make them mandatory:
--   ALTER TABLE public.registrants ALTER COLUMN national_id     SET NOT NULL;
--   ALTER TABLE public.registrants ALTER COLUMN graduation_year SET NOT NULL;
