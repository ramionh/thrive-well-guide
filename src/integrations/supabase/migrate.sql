
-- Create a function that can be called from the client to manually create a goal
-- This provides a fallback if the trigger fails
CREATE OR REPLACE FUNCTION public.manually_create_body_type_goal(
  user_id_param UUID,
  body_type_id_param UUID,
  selected_date_param DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update any existing active goals for this user
  UPDATE goals
  SET updated_at = now()
  WHERE user_id = user_id_param
  AND target_date > CURRENT_DATE;

  -- Create a new goal with the next better body type as the target
  INSERT INTO goals (
      user_id,
      current_body_type_id,
      goal_body_type_id,
      started_date,
      target_date
  ) VALUES (
      user_id_param,
      body_type_id_param,
      get_next_better_body_type(body_type_id_param),
      selected_date_param,
      selected_date_param + INTERVAL '100 days'
  );
END;
$$;

-- Make sure we have RLS policies for the user_body_types table as well
-- (in case they're missing)
ALTER TABLE public.user_body_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can insert their own body types"
ON public.user_body_types
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view their own body types"
ON public.user_body_types
FOR SELECT
USING (auth.uid() = user_id);
