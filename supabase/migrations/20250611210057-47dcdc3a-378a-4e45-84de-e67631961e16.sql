
-- Create a table to store user habit scoring responses
CREATE TABLE public.user_habit_scoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  habit_id UUID REFERENCES habits NOT NULL,
  response TEXT NOT NULL CHECK (response IN ('red', 'yellow', 'green')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_habit_scoring ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own habit scoring
CREATE POLICY "Users can view their own habit scoring" 
  ON public.user_habit_scoring 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own habit scoring
CREATE POLICY "Users can create their own habit scoring" 
  ON public.user_habit_scoring 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own habit scoring
CREATE POLICY "Users can update their own habit scoring" 
  ON public.user_habit_scoring 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own habit scoring
CREATE POLICY "Users can delete their own habit scoring" 
  ON public.user_habit_scoring 
  FOR DELETE 
  USING (auth.uid() = user_id);
