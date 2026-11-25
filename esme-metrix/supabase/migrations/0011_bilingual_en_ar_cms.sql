-- ESME METRIX 2026 — Bilingual (English / Arabic) CMS Storage Row
-- Adds additive `cms_arabic` JSON row to public.site_content while preserving all English defaults.

INSERT INTO public.site_content (key, value, label, category, field_type, updated_at)
VALUES (
  'cms_arabic',
  '{}',
  'Arabic Bilingual Content Config (JSON)',
  'CMS JSON',
  'json',
  NOW()
)
ON CONFLICT (key) DO NOTHING;
