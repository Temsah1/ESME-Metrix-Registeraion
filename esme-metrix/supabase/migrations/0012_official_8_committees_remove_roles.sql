-- Migration 0012: Force-sync ESME Chapter Committees to the 8 official committees/sectors
-- and remove ESME Role / Position (`esmeRoles` & `fields.role`) from CMS configuration.
-- NOTE: `public.registrants.role` remains nullable/unused so legacy rows stay intact.

UPDATE public.site_content
SET value = (
      jsonb_set(
        value::jsonb,
        '{esmeCommittees}',
        '[
          "High Board",
          "Business & Finance Sector",
          "IT & Digital Transformation Sector",
          "Marketing & Media Sector",
          "Operations & Supply Chain Sector",
          "Quality Sector",
          "Technical & Engineering Sector",
          "SID Sector"
        ]'::jsonb,
        true
      ) - 'esmeRoles' #- '{fields,role}'
    )::text,
    updated_at = now()
WHERE key = 'cms_form_config';

-- Remove any legacy standalone role keys in site_content if present
DELETE FROM public.site_content
WHERE key IN ('esme_roles', 'roles');
