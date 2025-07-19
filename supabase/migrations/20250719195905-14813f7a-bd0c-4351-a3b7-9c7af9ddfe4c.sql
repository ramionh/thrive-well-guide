-- Add auth_code field to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN auth_code TEXT;