
-- Create a table for habit repurpose simple if-then plans (visual format)
CREATE TABLE public.habit_repurpose_simple_if_then (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  trigger_phrase TEXT NOT NULL,
  good_habit_phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own data
ALTER TABLE public.habit_repurpose_simple_if_then ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own data
CREATE POLICY "Users can view their own simple if-then plans" 
  ON public.habit_repurpose_simple_if_then 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own data
CREATE POLICY "Users can create their own simple if-then plans" 
  ON public.habit_repurpose_simple_if_then 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own data
CREATE POLICY "Users can update their own simple if-then plans" 
  ON public.habit_repurpose_simple_if_then 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own data
CREATE POLICY "Users can delete their own simple if-then plans" 
  ON public.habit_repurpose_simple_if_then 
  FOR DELETE 
  USING (auth.uid() = user_id);
