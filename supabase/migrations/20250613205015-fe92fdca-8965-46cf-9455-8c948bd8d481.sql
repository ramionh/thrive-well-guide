
-- Create table to store application reset requests
CREATE TABLE public.application_reset_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_email TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.application_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to insert their own reset requests
CREATE POLICY "Users can create their own reset requests" 
  ON public.application_reset_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to view their own reset requests
CREATE POLICY "Users can view their own reset requests" 
  ON public.application_reset_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.application_reset_requests 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
