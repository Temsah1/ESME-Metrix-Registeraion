-- ESME METRIX 2026 — Bilingual Landing Event Stats Bar (`eventStats`)
-- Stores dynamic bilingual EN/AR stats bar items in `site_content`.

INSERT INTO public.site_content (key, value, label, category, field_type)
VALUES (
  'eventStats',
  '[{"value":"400+","label":{"en":"Total Seat Capacity","ar":"إجمالي السعة الاستيعابية"}},{"value":"15+","label":{"en":"Keynote & Tech Speakers","ar":"متحدث رئيسي وتقني"}},{"value":"2","label":{"en":"Parallel Conference Halls","ar":"قاعات مؤتمرات متوازية"}},{"value":"8+","label":{"en":"Specialized Workshops","ar":"ورش عمل متخصصة"}},{"value":"15+","label":{"en":"Industry Partners","ar":"شريك صناعي"}},{"value":"100%","label":{"en":"Accredited Certificate","ar":"شهادة معتمدة"}}]',
  'Landing Event Stats Bar (Bilingual JSON)',
  'CMS JSON',
  'json'
)
ON CONFLICT (key) DO NOTHING;
