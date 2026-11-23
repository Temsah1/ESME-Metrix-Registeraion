-- Migration 0002: Site Content CMS Table
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

-- Default values
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
