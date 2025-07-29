-- Add missing body_fat_percentage column to weekly_checkins table
ALTER TABLE public.weekly_checkins 
ADD COLUMN IF NOT EXISTS body_fat_percentage NUMERIC;