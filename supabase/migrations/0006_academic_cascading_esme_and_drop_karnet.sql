-- Migration 0006: Add cascading academic department + ESME Chapter membership fields,
-- make karnet_photo_url optional/deprecated, and configure OG highlights + updated LinkedIn caption.

ALTER TABLE public.registrants
  ADD COLUMN IF NOT EXISTS department VARCHAR(255),
  ADD COLUMN IF NOT EXISTS is_esme_member BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS committee VARCHAR(100),
  ADD COLUMN IF NOT EXISTS role VARCHAR(100);

ALTER TABLE public.registrants
  ALTER COLUMN karnet_photo_url DROP NOT NULL;

-- Backfill existing legacy rows that stored department inside faculty where department is null
UPDATE public.registrants
SET department = faculty
WHERE department IS NULL AND faculty IS NOT NULL;

-- Seed editable 2x3 OG highlights grid for LinkedIn Social Share Card (/api/og)
INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  (
    'og_highlights',
    E'500+ | ATTENDEES\n15+ | SPEAKERS\n10+ | WORKSHOPS\n12+ | PARTNERS\n3 | TRACKS\n1 | CONFERENCE',
    'LinkedIn Card 2x3 Highlights (6 lines: Value | Label)',
    'social',
    'textarea'
  )
ON CONFLICT (key) DO NOTHING;

-- Update default LinkedIn Share Caption to match the new official copy
UPDATE public.site_content
SET value = E'I''m attending *ESME METRIX*!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity',
    updated_at = now()
WHERE key = 'linkedin_caption';

NOTIFY pgrst, 'reload schema';
