-- Keep public CMS data readable while making authenticated CMS writes explicit.
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content"
ON public.site_content
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admin write site_content" ON public.site_content;

CREATE POLICY "Admin insert site_content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update site_content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete site_content"
ON public.site_content
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');
