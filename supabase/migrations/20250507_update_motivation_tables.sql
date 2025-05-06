
-- Add ON CONFLICT handling for motivation_measurable_goal table
ALTER TABLE public.motivation_measurable_goal 
ADD CONSTRAINT motivation_measurable_goal_user_id_key UNIQUE (user_id);

-- Add ON CONFLICT handling for motivation_getting_ready table
ALTER TABLE public.motivation_getting_ready
ADD CONSTRAINT motivation_getting_ready_user_id_key UNIQUE (user_id);
