-- Create table for storing habit circle system data
CREATE TABLE public.habit_systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL,
  
  -- System analysis data based on the 3 principles
  obstacles_barriers JSONB DEFAULT '[]'::jsonb,
  low_friction_strategies JSONB DEFAULT '{}'::jsonb,
  root_cause_solutions JSONB DEFAULT '{}'::jsonb,
  
  -- Implementation tracking
  current_week INTEGER DEFAULT 1,
  implementation_plan JSONB DEFAULT '[]'::jsonb,
  completed_phases JSONB DEFAULT '[]'::jsonb,
  
  -- User customizations
  custom_notes TEXT,
  system_adjustments JSONB DEFAULT '{}'::jsonb,
  
  -- Progress tracking
  is_active BOOLEAN DEFAULT true,
  success_metrics JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one system per user per habit
  UNIQUE(user_id, habit_id)
);

-- Enable RLS
ALTER TABLE public.habit_systems ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own habit systems" 
ON public.habit_systems 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit systems" 
ON public.habit_systems 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit systems" 
ON public.habit_systems 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit systems" 
ON public.habit_systems 
FOR DELETE 
USING (auth.uid() = user_id);

-- Coaches can view their assigned clients habit systems
CREATE POLICY "Coaches can view their assigned clients habit systems" 
ON public.habit_systems 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM profiles
  WHERE profiles.id = habit_systems.user_id 
  AND profiles.assigned_coach_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_habit_systems_updated_at
BEFORE UPDATE ON public.habit_systems
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();