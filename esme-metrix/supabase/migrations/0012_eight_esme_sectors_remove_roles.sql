-- ESME METRIX 2026 — Official 8 ESME Committees/Sectors & Remove Roles from Form Config
-- Keeps existing registrants.role column nullable for backwards compatibility while removing
-- ESME Role dropdown and old committees (IT, Marketing, Digital) from active form CMS.

UPDATE public.site_content
SET
  value = (
    jsonb_set(
      (value::jsonb) - 'esmeRoles' #- '{fields,role}',
      '{esmeCommittees}',
      '["High Board","Business & Finance Sector","IT & Digital Transformation Sector","Marketing & Media Sector","Operations & Supply Chain Sector","Quality Sector","Technical & Engineering Sector","SID Sector"]'::jsonb,
      true
    )
  )::text,
  updated_at = NOW()
WHERE key = 'cms_form_config';
