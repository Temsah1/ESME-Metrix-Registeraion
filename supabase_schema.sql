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
  national_id      VARCHAR(20),
  graduation_year  VARCHAR(10),
  university       VARCHAR(255) NOT NULL,
  faculty          VARCHAR(255) NOT NULL,
  department       VARCHAR(255),
  academic_year    VARCHAR(50)  NOT NULL,
  city             VARCHAR(100) NOT NULL,
  job_title        VARCHAR(255) NOT NULL,
  company          VARCHAR(255),
  is_esme_member   BOOLEAN      NOT NULL DEFAULT false,
  committee        VARCHAR(100),
  role             VARCHAR(100),
  id_photo_url     TEXT         NOT NULL,
  karnet_photo_url TEXT,
  avatar_url       TEXT,
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
  ('event_maps_url', 'https://maps.app.goo.gl/rZuGj1EEioQNB8K5A?g_st=ic', 'Venue Google Maps URL', 'Event Details', 'text'),
  ('linkedin_caption', E'I''m attending *ESME METRIX*!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/\nFollow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity', 'LinkedIn Share Caption', 'social', 'textarea'),
  ('og_highlights', E'500+ | ATTENDEES\n15+ | SPEAKERS\n10+ | WORKSHOPS\n12+ | PARTNERS\n2 | HALLS\n1 | CONFERENCE', 'LinkedIn Card 2x3 Highlights (6 lines: Value | Label)', 'social', 'textarea'),
  ('hero_logo_url', '/esme_logo.png', 'Hero / Navbar Logo', 'media', 'image'),
  ('ticket_bg_url', '/images/ticket-bg.jpg', 'Ticket Background Image', 'media', 'image'),
  ('post_registration_whatsapp_url', 'https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW', 'Post-Registration WhatsApp Invite URL', 'Confirmation', 'text'),
  ('whatsapp_group_url', 'https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW', 'Attendee WhatsApp Group Link', 'social', 'text')
ON CONFLICT (key) DO NOTHING;
