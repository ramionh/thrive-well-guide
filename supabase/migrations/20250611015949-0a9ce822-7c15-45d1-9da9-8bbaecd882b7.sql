
-- Create a table for habit repurpose goal values
CREATE TABLE public.habit_repurpose_goal_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_values_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own goal values
ALTER TABLE public.habit_repurpose_goal_values ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own goal values
CREATE POLICY "Users can view their own habit repurpose goal values" 
  ON public.habit_repurpose_goal_values 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own goal values
CREATE POLICY "Users can create their own habit repurpose goal values" 
  ON public.habit_repurpose_goal_values 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own goal values
CREATE POLICY "Users can update their own habit repurpose goal values" 
  ON public.habit_repurpose_goal_values 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own goal values
CREATE POLICY "Users can delete their own habit repurpose goal values" 
  ON public.habit_repurpose_goal_values 
  FOR DELETE 
  USING (auth.uid() = user_id);
