-- Migration 0007: Seed structured CMS keys for English Upgrade,
-- 8-photo gallery, dual-hall agenda, dynamic form builder, footer portal & links,
-- and separated post-registration WhatsApp group URL.

INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  (
    'post_registration_whatsapp_url',
    'https://chat.whatsapp.com/KOT8wY8h2lK5p0mNN7NcNW',
    'Post-Registration WhatsApp Invite URL',
    'Confirmation',
    'text'
  ),
  ('gallery_image_5', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80', 'Gallery Photo 5 URL', 'Gallery', 'image'),
  ('gallery_image_6', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80', 'Gallery Photo 6 URL', 'Gallery', 'image'),
  ('gallery_image_7', 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80', 'Gallery Photo 7 URL', 'Gallery', 'image'),
  ('gallery_image_8', '/images/materials-4.svg', 'Gallery Photo 8 URL', 'Gallery', 'image')
ON CONFLICT (key) DO NOTHING;

-- Refresh og_highlights default label for dual-hall edition if still untouched
UPDATE public.site_content
SET value = E'500+ | ATTENDEES\n15+ | SPEAKERS\n10+ | WORKSHOPS\n12+ | PARTNERS\n2 | HALLS\n1 | CONFERENCE',
    updated_at = now()
WHERE key = 'og_highlights'
  AND value = E'500+ | ATTENDEES\n15+ | SPEAKERS\n10+ | WORKSHOPS\n12+ | PARTNERS\n3 | TRACKS\n1 | CONFERENCE';
