
-- Create table for Final Word step
CREATE TABLE IF NOT EXISTS public.motivation_final_word (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_adjustments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.motivation_final_word ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view their own final word data" 
  ON public.motivation_final_word 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert their own final word data" 
  ON public.motivation_final_word 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "Users can update their own final word data" 
  ON public.motivation_final_word 
  FOR UPDATE 
  USING (auth.uid() = user_id);
