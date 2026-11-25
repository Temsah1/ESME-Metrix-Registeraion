-- Migration 0009: Update LinkedIn Share Caption to include the official
-- ESME Cairo University Student Chapter LinkedIn page link.

UPDATE public.site_content
SET value = E'I''m attending *ESME METRIX*!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/\nFollow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity',
    updated_at = now()
WHERE key = 'linkedin_caption';

INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  (
    'linkedin_caption',
    E'I''m attending *ESME METRIX*!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/\nFollow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity',
    'LinkedIn Share Caption',
    'Social Amplification',
    'textarea'
  )
ON CONFLICT (key) DO NOTHING;
