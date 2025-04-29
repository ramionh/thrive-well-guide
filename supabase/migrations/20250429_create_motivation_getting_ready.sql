
CREATE TABLE IF NOT EXISTS public.motivation_getting_ready (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  self_persuasion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Set up RLS policies
ALTER TABLE public.motivation_getting_ready ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to select their own entries only
CREATE POLICY "Users can view their own getting ready data" 
  ON public.motivation_getting_ready 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own entries only
CREATE POLICY "Users can insert their own getting ready data" 
  ON public.motivation_getting_ready 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own entries only
CREATE POLICY "Users can update their own getting ready data" 
  ON public.motivation_getting_ready 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own entries only
CREATE POLICY "Users can delete their own getting ready data" 
  ON public.motivation_getting_ready 
  FOR DELETE 
  USING (auth.uid() = user_id);
