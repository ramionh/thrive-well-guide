-- Add coach assignment and user status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS assigned_coach_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS height_feet INTEGER,
ADD COLUMN IF NOT EXISTS height_inches INTEGER,
ADD COLUMN IF NOT EXISTS weight_lbs NUMERIC;

-- Create index for coach assignments
CREATE INDEX IF NOT EXISTS idx_profiles_assigned_coach_id ON public.profiles(assigned_coach_id);

-- Create RLS policies for admin user management
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coaches can view their assigned clients" 
ON public.profiles 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'coach'::app_role) 
  AND assigned_coach_id = auth.uid()
);

-- Create admin-only policies for user_roles
CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'::app_role));