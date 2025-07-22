-- Create weekly check-ins table
CREATE TABLE public.weekly_checkins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    weight_lbs NUMERIC NOT NULL,
    estimated_bodyfat_percentage NUMERIC,
    front_photo_url TEXT,
    back_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own weekly check-ins" 
ON public.weekly_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly check-ins" 
ON public.weekly_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly check-ins" 
ON public.weekly_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly check-ins" 
ON public.weekly_checkins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for weekly check-in photos
INSERT INTO storage.buckets (id, name, public) VALUES ('weekly-checkins', 'weekly-checkins', false);

-- Create storage policies for weekly check-in photos
CREATE POLICY "Users can view their own weekly check-in photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'weekly-checkins' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own weekly check-in photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'weekly-checkins' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own weekly check-in photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'weekly-checkins' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own weekly check-in photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'weekly-checkins' AND auth.uid()::text = (storage.foldername(name))[1]);