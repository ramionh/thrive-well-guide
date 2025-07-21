-- Add height column to user_body_types table
ALTER TABLE public.user_body_types 
ADD COLUMN height_inches TEXT;