
-- Create a table for habit environment engineering
CREATE TABLE public.habit_repurpose_environment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  make_bad_habit_harder TEXT NOT NULL,
  make_good_habit_easier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own data
ALTER TABLE public.habit_repurpose_environment ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own data
CREATE POLICY "Users can view their own habit repurpose environment" 
  ON public.habit_repurpose_environment 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own data
CREATE POLICY "Users can create their own habit repurpose environment" 
  ON public.habit_repurpose_environment 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own data
CREATE POLICY "Users can update their own habit repurpose environment" 
  ON public.habit_repurpose_environment 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own data
CREATE POLICY "Users can delete their own habit repurpose environment" 
  ON public.habit_repurpose_environment 
  FOR DELETE 
  USING (auth.uid() = user_id);
