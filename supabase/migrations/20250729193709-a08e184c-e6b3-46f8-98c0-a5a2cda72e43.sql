-- Add bio field to profiles table for coaches
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;