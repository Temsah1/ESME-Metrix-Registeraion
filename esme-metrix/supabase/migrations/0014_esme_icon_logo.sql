-- ESME METRIX 2026 — Update hero_logo_url default to circular /esme-icon.jpg
UPDATE public.site_content
SET value = '/esme-icon.jpg', updated_at = NOW()
WHERE key = 'hero_logo_url' AND value = '/esme_logo.png';
