-- Migration 0008: Seed local 8-photo ESME METRIX event gallery paths & Google Maps venue link
INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  ('event_maps_url', 'https://maps.app.goo.gl/rZuGj1EEioQNB8K5A?g_st=ic', 'Venue Google Maps URL', 'Event Details', 'text')
ON CONFLICT (key) DO NOTHING;

-- Upgrade untouched gallery placeholder rows to local 8-photo ESME event assets
UPDATE public.site_content SET value = '/images/gallery/event-1.jpg', updated_at = now()
WHERE key = 'gallery_image_1' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-2.jpg', updated_at = now()
WHERE key = 'gallery_image_2' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-3.jpg', updated_at = now()
WHERE key = 'gallery_image_3' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-4.jpg', updated_at = now()
WHERE key = 'gallery_image_4' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-5.jpg', updated_at = now()
WHERE key = 'gallery_image_5' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-6.jpg', updated_at = now()
WHERE key = 'gallery_image_6' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-7.jpg', updated_at = now()
WHERE key = 'gallery_image_7' AND (value = '' OR value LIKE '%unsplash.com%');
UPDATE public.site_content SET value = '/images/gallery/event-8.jpg', updated_at = now()
WHERE key = 'gallery_image_8' AND (value = '' OR value LIKE '%unsplash.com%' OR value = '/images/materials-4.svg');
