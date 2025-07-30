-- Update RLS policies to allow coaches to view their assigned clients' data

-- First, let's check if weekly_checkins table exists, if not create it
CREATE TABLE IF NOT EXISTS public.weekly_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_in_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on weekly_checkins if not already enabled
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- Add policies for weekly_checkins to allow coaches to view their assigned clients' data
DROP POLICY IF EXISTS "Users can view their own weekly checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Coaches can view their assigned clients weekly checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Users can insert their own weekly checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Users can update their own weekly checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Users can delete their own weekly checkins" ON public.weekly_checkins;

CREATE POLICY "Users can view their own weekly checkins"
ON public.weekly_checkins
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view their assigned clients weekly checkins"
ON public.weekly_checkins
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = weekly_checkins.user_id 
    AND assigned_coach_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own weekly checkins"
ON public.weekly_checkins
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly checkins"
ON public.weekly_checkins
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly checkins"
ON public.weekly_checkins
FOR DELETE
USING (auth.uid() = user_id);

-- Update daily_health_tracking policies to allow coaches to view their assigned clients' data
DROP POLICY IF EXISTS "Coaches can view their assigned clients health data" ON public.daily_health_tracking;

CREATE POLICY "Coaches can view their assigned clients health data"
ON public.daily_health_tracking
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = daily_health_tracking.user_id 
    AND assigned_coach_id = auth.uid()
  )
);

-- Also update other tables that coaches might need to access
-- Goals table
DROP POLICY IF EXISTS "Coaches can view their assigned clients goals" ON public.goals;

CREATE POLICY "Coaches can view their assigned clients goals"
ON public.goals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = goals.user_id 
    AND assigned_coach_id = auth.uid()
  )
);

-- Existing habits assessment
DROP POLICY IF EXISTS "Coaches can view their assigned clients existing habits assessments" ON public.existing_habits_assessment;

CREATE POLICY "Coaches can view their assigned clients existing habits assessments"
ON public.existing_habits_assessment
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = existing_habits_assessment.user_id 
    AND assigned_coach_id = auth.uid()
  )
);

-- Focused habits
DROP POLICY IF EXISTS "Coaches can view their assigned clients focused habits" ON public.focused_habits;

CREATE POLICY "Coaches can view their assigned clients focused habits"
ON public.focused_habits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = focused_habits.user_id 
    AND assigned_coach_id = auth.uid()
  )
);

-- All motivation tables - adding coach access policies
DROP POLICY IF EXISTS "Coaches can view their assigned clients motivation data" ON public.motivation_affirmations;
CREATE POLICY "Coaches can view their assigned clients motivation data"
ON public.motivation_affirmations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = motivation_affirmations.user_id 
    AND assigned_coach_id = auth.uid()
  )
);