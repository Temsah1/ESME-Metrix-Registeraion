-- Add avatar_url column to registrants for personalized badge and social share cards
ALTER TABLE public.registrants ADD COLUMN IF NOT EXISTS avatar_url TEXT;
