-- ═══════════════════════════════════════════════════════════════════
-- ESME METRIX — SECURITY HARDENING MIGRATION (PREPARED, NOT APPLIED)
-- ═══════════════════════════════════════════════════════════════════
-- STATUS: REQUIRES EXPLICIT AUTHORIZATION before running against any
--         Supabase project. Do NOT execute against production without
--         approval and the companion code changes noted below.
--
-- Addresses QA findings:
--   STO-01  National ID / Karnet documents stored in a PUBLIC bucket.
--   SEC-02  Over-permissive "Public insert registrants" RLS policy lets
--           anyone with the anon key insert arbitrary rows directly,
--           bypassing server-side validation. The app registers via the
--           service-role API, so this policy is unnecessary.
--
-- IMPORTANT COMPANION CODE CHANGE (must ship together with this migration):
--   PhotoUpload currently stores a getPublicUrl() string. With a private
--   bucket those URLs stop resolving. Switch to storing the object PATH
--   (e.g. "uploads/<file>") and generate short-lived signed URLs server-
--   side (service role) for admin document preview. Until that change is
--   deployed, do NOT apply section 1.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Make the photos bucket private + restrict access ────────────
UPDATE storage.buckets SET public = false WHERE id = 'photos';

DROP POLICY IF EXISTS "Public Access Photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Photos" ON storage.objects;

-- Admins may read documents (for signed-URL preview via service role).
DROP POLICY IF EXISTS "Admin read photos" ON storage.objects;
CREATE POLICY "Admin read photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos' AND auth.role() = 'authenticated'
  );

-- Registration uploads happen from the browser anon client. Restrict by
-- bucket, size (5MB) and MIME type. NOTE: ideally move uploads behind a
-- server action / signed upload URL so the public cannot write at all.
DROP POLICY IF EXISTS "Restricted insert photos" ON storage.objects;
CREATE POLICY "Restricted insert photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos'
    AND (storage.extension(name)) IN ('jpg', 'jpeg', 'png')
  );

-- ── 2. Remove the over-permissive public insert policy ─────────────
-- Registration is performed server-side with the service role (bypasses
-- RLS), so no public INSERT policy is required.
DROP POLICY IF EXISTS "Public insert registrants" ON public.registrants;

-- ── 3. (Optional) email delivery tracking ──────────────────────────
-- Uncomment only if the email-status feature is implemented in code.
-- CREATE TABLE IF NOT EXISTS public.email_logs (
--   id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   registrant_id UUID REFERENCES public.registrants(id) ON DELETE CASCADE,
--   status        TEXT NOT NULL DEFAULT 'pending',
--   resend_id     TEXT,
--   error         TEXT,
--   retry_count   INT NOT NULL DEFAULT 0,
--   created_at    TIMESTAMPTZ DEFAULT now(),
--   updated_at    TIMESTAMPTZ DEFAULT now()
-- );
-- ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admin read email_logs" ON public.email_logs
--   FOR SELECT USING (auth.role() = 'authenticated');