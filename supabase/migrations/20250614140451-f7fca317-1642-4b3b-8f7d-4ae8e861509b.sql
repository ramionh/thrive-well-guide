
-- Add is_active column to subscribers table to track payment completion
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;
