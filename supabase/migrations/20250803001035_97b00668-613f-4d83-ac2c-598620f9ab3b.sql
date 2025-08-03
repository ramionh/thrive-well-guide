-- Create client_macros table to store macro assignments
CREATE TABLE IF NOT EXISTS public.client_macros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_lbs NUMERIC,
  goal_type TEXT,
  activity_level TEXT DEFAULT 'moderate',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_macros ENABLE ROW LEVEL SECURITY;

-- Create policies for client_macros
CREATE POLICY "Users can view their own macros" 
ON public.client_macros 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macros" 
ON public.client_macros 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macros" 
ON public.client_macros 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view their assigned clients macros" 
ON public.client_macros 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = client_macros.user_id 
  AND profiles.assigned_coach_id = auth.uid()
));

CREATE POLICY "Coaches can manage their assigned clients macros" 
ON public.client_macros 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = client_macros.user_id 
  AND profiles.assigned_coach_id = auth.uid()
));

-- Add updated_at trigger
CREATE TRIGGER update_client_macros_updated_at
  BEFORE UPDATE ON public.client_macros
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add macros feature to client_feature_toggles default features
INSERT INTO public.client_feature_toggles (user_id, feature_name, is_enabled)
SELECT id, 'macros', true
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM client_feature_toggles 
  WHERE user_id = profiles.id AND feature_name = 'macros'
);