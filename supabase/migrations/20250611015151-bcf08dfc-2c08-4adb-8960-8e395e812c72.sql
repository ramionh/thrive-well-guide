
-- Create a table for habit repurpose goals
CREATE TABLE public.habit_repurpose_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_text TEXT NOT NULL,
  is_learning_goal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own goals
ALTER TABLE public.habit_repurpose_goals ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own goals
CREATE POLICY "Users can view their own habit repurpose goals" 
  ON public.habit_repurpose_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own goals
CREATE POLICY "Users can create their own habit repurpose goals" 
  ON public.habit_repurpose_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own goals
CREATE POLICY "Users can update their own habit repurpose goals" 
  ON public.habit_repurpose_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own goals
CREATE POLICY "Users can delete their own habit repurpose goals" 
  ON public.habit_repurpose_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);
