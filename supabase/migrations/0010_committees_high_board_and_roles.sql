-- Migration 0010: Ensure High Board is included in ESME Chapter Committees,
-- set Roles to ["Member", "Director", "Head"], and update LinkedIn post copy
-- with personalized /share/[ticketId] URL and Chapter LinkedIn follow link.

-- 1. Update cms_form_config JSON in site_content if legacy committees or roles remain
UPDATE public.site_content
SET value = jsonb_set(
      jsonb_set(
        value::jsonb,
        '{esmeCommittees}',
        '["High Board","IT","Marketing","Digital"]'::jsonb,
        true
      ),
      '{esmeRoles}',
      '["Member","Director","Head"]'::jsonb,
      true
    )::text,
    updated_at = now()
WHERE key = 'cms_form_config'
  AND (
    NOT ((value::jsonb -> 'esmeCommittees') @> '["High Board"]'::jsonb)
    OR NOT ((value::jsonb -> 'esmeRoles') @> '["Director"]'::jsonb)
  );

-- 2. Update default LinkedIn Share Caption
UPDATE public.site_content
SET value = E'I''m attending ESME METRIX!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/share/[ticketId]\nFollow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity',
    updated_at = now()
WHERE key = 'linkedin_caption';

INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  (
    'linkedin_caption',
    E'I''m attending ESME METRIX!\n\nJoin us on 12 December 2026 at Cairo University for an exciting event exploring the world of Materials Engineering, innovation, and advanced materials.\n\nDiscover, learn, and connect with fellow engineering students.\n\nRegister now: https://esme-metrix-registeration.vercel.app/share/[ticketId]\nFollow ESME Cairo University: https://www.linkedin.com/company/esme-cairo-university-student-chapter/\n\n#ESMEMetrix #MaterialsEngineering #ESMECU #CairoUniversity',
    'LinkedIn Share Caption',
    'Social Amplification',
    'textarea'
  )
ON CONFLICT (key) DO NOTHING;

-- 3. Update legacy footer LinkedIn link in cms_footer if stored
UPDATE public.site_content
SET value = replace(
      value,
      'https://www.linkedin.com/company/esme-cairo-university/',
      'https://www.linkedin.com/company/esme-cairo-university-student-chapter/'
    ),
    updated_at = now()
WHERE key = 'cms_footer'
  AND value LIKE '%https://www.linkedin.com/company/esme-cairo-university/"%';
