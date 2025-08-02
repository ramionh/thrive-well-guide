-- Create client feature toggles table
CREATE TABLE public.client_feature_toggles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Enable RLS
ALTER TABLE public.client_feature_toggles ENABLE ROW LEVEL SECURITY;

-- Coaches can view and manage their assigned clients' feature toggles
CREATE POLICY "Coaches can manage their assigned clients feature toggles"
ON public.client_feature_toggles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = client_feature_toggles.user_id 
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Users can view their own feature toggles
CREATE POLICY "Users can view their own feature toggles"
ON public.client_feature_toggles
FOR SELECT
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_client_feature_toggles_updated_at
  BEFORE UPDATE ON public.client_feature_toggles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();