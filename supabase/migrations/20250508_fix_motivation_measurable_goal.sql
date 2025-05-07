
-- Add missing columns to motivation_measurable_goal table
ALTER TABLE IF EXISTS public.motivation_measurable_goal ADD COLUMN IF NOT EXISTS goal_weight_lbs DECIMAL;
ALTER TABLE IF EXISTS public.motivation_measurable_goal ADD COLUMN IF NOT EXISTS goal_bodyfat_percentage DECIMAL;

-- Add ON CONFLICT handling for motivation_measurable_goal table if not already present
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'motivation_measurable_goal_user_id_key'
    ) THEN
        ALTER TABLE public.motivation_measurable_goal 
        ADD CONSTRAINT motivation_measurable_goal_user_id_key UNIQUE (user_id);
    END IF;
END $$;
