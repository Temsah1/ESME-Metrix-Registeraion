-- ═══════════════════════════════════════════════════════════════════
-- ESME METRIX — PRODUCTION DATABASE SETUP SCRIPT
-- Organization: ESME Cairo University Student Chapter
-- Version: 1.1 (November 2026)
--   1.1 — registrants now includes national_id, graduation_year and
--         avatar_url (previously only added by migrations 0003/0005), with
--         format checks and a unique National ID (migration 0006).
--
-- FRESH PROJECT: run this whole file once.
-- EXISTING PROJECT: do not re-run this file; run the files in
--   supabase/migrations/ in order (0003 → 0006) instead.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Table: registrants
CREATE TABLE IF NOT EXISTS public.registrants (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        VARCHAR(255) NOT NULL,
  phone            VARCHAR(20)  NOT NULL UNIQUE,
  email            VARCHAR(255) NOT NULL UNIQUE,
  national_id      VARCHAR(20),               -- 14-digit Egyptian National ID (unique, see index below)
  graduation_year  VARCHAR(10),               -- 4-digit year, e.g. '2026'
  university       VARCHAR(255) NOT NULL,
  faculty          VARCHAR(255) NOT NULL,
  academic_year    VARCHAR(50)  NOT NULL,
  city             VARCHAR(100) NOT NULL,
  job_title        VARCHAR(255) NOT NULL,
  company          VARCHAR(255),
  id_photo_url     TEXT         NOT NULL,
  karnet_photo_url TEXT         NOT NULL,
  avatar_url       TEXT,
  qr_code          TEXT         NOT NULL,
  registration_id  VARCHAR(20)  NOT NULL UNIQUE,
  linkedin_shared  BOOLEAN      DEFAULT false,
  created_at       TIMESTAMPTZ  DEFAULT now(),

  CONSTRAINT registrants_national_id_format_chk
    CHECK (national_id IS NULL OR national_id ~ '^[23][0-9]{13}$'),
  CONSTRAINT registrants_graduation_year_format_chk
    CHECK (graduation_year IS NULL OR graduation_year ~ '^(19|20)[0-9]{2}$')
);

-- One registration per National ID (NULLs allowed for legacy rows)
CREATE UNIQUE INDEX IF NOT EXISTS uq_registrants_national_id
  ON public.registrants (national_id)
  WHERE national_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_registrants_graduation_year
  ON public.registrants (graduation_year);

COMMENT ON COLUMN public.registrants.national_id IS
  'Egyptian National ID (14 digits, starts with 2 or 3). Unique. Sensitive: admin-only, never exposed on public/share/OG endpoints.';
COMMENT ON COLUMN public.registrants.graduation_year IS
  'Expected or actual graduation year, 4 digits (e.g. 2026).';

-- 2. Table: attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registrant_id  UUID REFERENCES public.registrants(id) ON DELETE CASCADE UNIQUE,
  scanned_by     VARCHAR(100) NOT NULL,
  scanned_at     TIMESTAMPTZ  DEFAULT now(),
  notes          TEXT
);

-- 3. Enable Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.registrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance  ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public can submit registration applications
DROP POLICY IF EXISTS "Public insert registrants" ON public.registrants;
CREATE POLICY "Public insert registrants" ON public.registrants FOR INSERT WITH CHECK (true);

-- Authenticated admins have full read/write access
DROP POLICY IF EXISTS "Admin read registrants" ON public.registrants;
CREATE POLICY "Admin read registrants" ON public.registrants FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update registrants" ON public.registrants;
CREATE POLICY "Admin update registrants" ON public.registrants FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all attendance" ON public.attendance;
CREATE POLICY "Admin all attendance" ON public.attendance USING (auth.role() = 'authenticated');

-- 6. Storage Bucket for Document Uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policy
CREATE POLICY "Public Access Photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Public Insert Photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');


-- 7. Table: site_content (CMS)
CREATE TABLE IF NOT EXISTS public.site_content (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  label VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'general',
  field_type VARCHAR(50) NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write site_content" ON public.site_content;
CREATE POLICY "Admin write site_content" ON public.site_content FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  ('hero_headline', 'ESME METRIX 2026', 'Hero Headline', 'hero', 'text'),
  ('hero_subtitle', 'Materials Engineering Event — ESME Cairo University Student Chapter', 'Hero Subtitle', 'hero', 'text'),
  ('event_date', '12 December 2026', 'Event Date', 'event', 'text'),
  ('event_venue', 'Cairo University', 'Event Venue', 'event', 'text'),
  ('event_time', 'Saturday 12 / 12 / 2026', 'Event Time Display', 'event', 'text'),
  ('linkedin_caption', E'I''m attending ESME METRIX!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity', 'LinkedIn Share Caption', 'social', 'textarea'),
  ('hero_logo_url', '/esme_logo.png', 'Hero / Navbar Logo', 'media', 'image'),
  ('ticket_bg_url', '/images/ticket-bg.jpg', 'Ticket Background Image', 'media', 'image')
ON CONFLICT (key) DO NOTHING;


-- 8. Refresh the Supabase API (PostgREST) schema cache so new columns are visible
NOTIFY pgrst, 'reload schema';
