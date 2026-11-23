-- ═══════════════════════════════════════════════════════════════════
-- ESME METRIX — PRODUCTION DATABASE SETUP SCRIPT
-- Organization: ESME Cairo University Student Chapter
-- Version: 1.0 (November 2026)
-- ═══════════════════════════════════════════════════════════════════

-- 1. Table: registrants
CREATE TABLE IF NOT EXISTS public.registrants (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        VARCHAR(255) NOT NULL,
  phone            VARCHAR(20)  NOT NULL UNIQUE,
  email            VARCHAR(255) NOT NULL UNIQUE,
  university       VARCHAR(255) NOT NULL,
  faculty          VARCHAR(255) NOT NULL,
  academic_year    VARCHAR(50)  NOT NULL,
  city             VARCHAR(100) NOT NULL,
  job_title        VARCHAR(255) NOT NULL,
  company          VARCHAR(255),
  id_photo_url     TEXT         NOT NULL,
  karnet_photo_url TEXT         NOT NULL,
  qr_code          TEXT         NOT NULL,
  registration_id  VARCHAR(20)  NOT NULL UNIQUE,
  linkedin_shared  BOOLEAN      DEFAULT false,
  created_at       TIMESTAMPTZ  DEFAULT now()
);

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
