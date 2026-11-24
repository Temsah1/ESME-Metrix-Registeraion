-- Migration 0004: Homepage CMS fields (About text + Gallery images)
INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  ('about_text',
   'ESME METRIX is the flagship Materials Engineering event hosted by the ESME Cairo University Student Chapter. It brings together students, professionals, researchers, and industry leaders to explore cutting-edge innovations in materials science, engineering applications, and emerging technologies.',
   'About the Event (Homepage)', 'Home Page', 'textarea'),
  ('gallery_image_1', '', 'Gallery Photo 1 (URL)', 'Home Page', 'image'),
  ('gallery_image_2', '', 'Gallery Photo 2 (URL)', 'Home Page', 'image'),
  ('gallery_image_3', '', 'Gallery Photo 3 (URL)', 'Home Page', 'image'),
  ('gallery_image_4', '', 'Gallery Photo 4 (URL)', 'Home Page', 'image')
ON CONFLICT (key) DO NOTHING;
