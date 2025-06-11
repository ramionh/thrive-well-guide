
-- Create a table for habit repurpose unwanted habits
CREATE TABLE public.habit_repurpose_unwanted_habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  habit_description TEXT NOT NULL,
  habit_trigger TEXT NOT NULL,
  habit_feeling TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own data
ALTER TABLE public.habit_repurpose_unwanted_habits ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own data
CREATE POLICY "Users can view their own habit repurpose unwanted habits" 
  ON public.habit_repurpose_unwanted_habits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own data
CREATE POLICY "Users can create their own habit repurpose unwanted habits" 
  ON public.habit_repurpose_unwanted_habits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own data
CREATE POLICY "Users can update their own habit repurpose unwanted habits" 
  ON public.habit_repurpose_unwanted_habits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own data
CREATE POLICY "Users can delete their own habit repurpose unwanted habits" 
  ON public.habit_repurpose_unwanted_habits 
  FOR DELETE 
  USING (auth.uid() = user_id);
