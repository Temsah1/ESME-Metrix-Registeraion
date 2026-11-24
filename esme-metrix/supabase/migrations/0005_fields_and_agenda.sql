-- Migration 0005: Add national_id and graduation_year to registrants, and add agenda_items to site_content
ALTER TABLE public.registrants 
  ADD COLUMN IF NOT EXISTS national_id VARCHAR(20),
  ADD COLUMN IF NOT EXISTS graduation_year VARCHAR(10);

-- Insert default event agenda into site_content CMS
INSERT INTO public.site_content (key, value, label, category, field_type) VALUES
  ('event_agenda', 
   E'09:00 AM | Gates Open & Registration Desk | 🚪\n10:00 AM | Opening Ceremony & Keynote Address | 🎤\n12:00 PM | Materials & Petroleum Workshops | ⚡\n02:00 PM | Mechatronics & Industry Exhibition | 🏢\n04:00 PM | Engineering Competitions & Awards | 🏆\n06:00 PM | Certificate Distribution & Gala | 🎓',
   'Event Agenda / Schedule (Time | Title | Icon per line)', 
   'Home Page', 
   'textarea')
ON CONFLICT (key) DO NOTHING;
