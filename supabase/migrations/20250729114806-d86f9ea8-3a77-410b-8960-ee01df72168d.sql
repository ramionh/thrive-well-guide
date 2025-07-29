-- Create client_onboarding table for storing questionnaire responses
CREATE TABLE public.client_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  questionnaire_type TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own onboarding data" 
ON public.client_onboarding 
FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Users can create their own onboarding data" 
ON public.client_onboarding 
FOR INSERT 
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own onboarding data" 
ON public.client_onboarding 
FOR UPDATE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own onboarding data" 
ON public.client_onboarding 
FOR DELETE 
USING (profile_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_onboarding_updated_at
BEFORE UPDATE ON public.client_onboarding
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();