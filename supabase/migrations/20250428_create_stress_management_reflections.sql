
-- Create table for storing stress management reflections
CREATE TABLE IF NOT EXISTS public.stress_management_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflections TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.stress_management_reflections ENABLE ROW LEVEL SECURITY;

-- Users can view their own reflections
CREATE POLICY "Users can view their own reflections"
  ON public.stress_management_reflections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reflections
CREATE POLICY "Users can insert their own reflections"
  ON public.stress_management_reflections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reflections
CREATE POLICY "Users can update their own reflections"
  ON public.stress_management_reflections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.stress_management_reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
