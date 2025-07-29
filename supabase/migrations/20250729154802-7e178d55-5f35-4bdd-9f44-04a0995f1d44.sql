-- Create weekly_checkins table for storing user check-in data
CREATE TABLE IF NOT EXISTS public.weekly_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_lbs DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,1),
  front_photo_url TEXT,
  back_photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own checkins" 
ON public.weekly_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins" 
ON public.weekly_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" 
ON public.weekly_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins" 
ON public.weekly_checkins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_checkins_updated_at
BEFORE UPDATE ON public.weekly_checkins
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();