-- Update RLS policies to allow coaches to view their assigned clients' data

-- Weekly check-ins: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients weekly checkins"
ON public.weekly_checkins
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = weekly_checkins.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Daily health tracking: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients daily health data"
ON public.daily_health_tracking
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = daily_health_tracking.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Goals: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients goals"
ON public.goals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = goals.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Existing habits assessment: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients habits assessments"
ON public.existing_habits_assessment
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = existing_habits_assessment.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Focused habits: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients focused habits"
ON public.focused_habits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = focused_habits.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);

-- Motivation affirmations: Allow coaches to view data for their assigned clients
CREATE POLICY "Coaches can view their assigned clients motivation data"
ON public.motivation_affirmations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = motivation_affirmations.user_id
    AND profiles.assigned_coach_id = auth.uid()
  )
);