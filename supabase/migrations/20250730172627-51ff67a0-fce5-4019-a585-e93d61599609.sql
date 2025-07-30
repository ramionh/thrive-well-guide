-- Create a comprehensive view for LLM daily client updates via text messaging
CREATE OR REPLACE VIEW public.client_daily_update_data AS
WITH latest_checkin AS (
  SELECT DISTINCT ON (user_id) 
    user_id,
    weight_lbs,
    body_fat_percentage,
    front_photo_url,
    back_photo_url,
    notes,
    created_at as last_checkin_date
  FROM weekly_checkins
  ORDER BY user_id, created_at DESC
),
progress_summary AS (
  SELECT 
    user_id,
    COUNT(*) as total_checkins,
    MIN(weight_lbs) as starting_weight,
    MAX(weight_lbs) as current_weight,
    (MAX(weight_lbs) - MIN(weight_lbs)) as weight_change,
    AVG(body_fat_percentage) as avg_body_fat
  FROM weekly_checkins
  GROUP BY user_id
),
habit_repurpose_data AS (
  SELECT 
    gv.user_id,
    json_build_object(
      'goals', json_agg(DISTINCT g.goal_text),
      'goal_values', gv.goal_values_text,
      'unwanted_habit', json_build_object(
        'description', uh.habit_description,
        'trigger', uh.habit_trigger,
        'feeling', uh.habit_feeling
      ),
      'replacement_habit', r.replacement_habit,
      'if_then_plan', json_build_object(
        'trigger', sift.trigger_phrase,
        'action', sift.good_habit_phrase
      ),
      'environment_changes', json_build_object(
        'make_good_easier', env.make_good_habit_easier,
        'make_bad_harder', env.make_bad_habit_harder
      )
    ) as habit_plan
  FROM habit_repurpose_goal_values gv
  LEFT JOIN habit_repurpose_goals g ON g.user_id = gv.user_id
  LEFT JOIN habit_repurpose_unwanted_habits uh ON uh.user_id = gv.user_id
  LEFT JOIN habit_repurpose_replacements r ON r.user_id = gv.user_id
  LEFT JOIN habit_repurpose_simple_if_then sift ON sift.user_id = gv.user_id
  LEFT JOIN habit_repurpose_environment env ON env.user_id = gv.user_id
  GROUP BY gv.user_id, gv.goal_values_text, uh.habit_description, uh.habit_trigger, uh.habit_feeling, 
           r.replacement_habit, sift.trigger_phrase, sift.good_habit_phrase, 
           env.make_good_habit_easier, env.make_bad_habit_harder
),
latest_motivation_data AS (
  SELECT 
    user_id,
    'clarifying_values' as module_type,
    json_build_object(
      'selected_value_1', selected_value_1,
      'selected_value_2', selected_value_2,
      'goal_value_alignment', goal_value_alignment,
      'reasons_alignment', reasons_alignment
    ) as module_data,
    created_at as completed_at
  FROM motivation_clarifying_values
  
  UNION ALL
  
  SELECT 
    user_id,
    'confidence_score' as module_type,
    json_build_object(
      'score', score,
      'descriptor', descriptor,
      'explanation', explanation
    ) as module_data,
    created_at as completed_at
  FROM motivation_confidence_score
  
  UNION ALL
  
  SELECT 
    user_id,
    'affirmations' as module_type,
    json_build_object(
      'affirmations', affirmations
    ) as module_data,
    created_at as completed_at
  FROM motivation_affirmations
),
latest_motivation AS (
  SELECT DISTINCT ON (user_id)
    user_id,
    module_type,
    module_data,
    completed_at
  FROM latest_motivation_data
  ORDER BY user_id, completed_at DESC
),
focused_habits_data AS (
  SELECT 
    fh.user_id,
    json_agg(
      json_build_object(
        'name', h.name,
        'description', h.description,
        'category', h.category
      )
    ) as focused_habits
  FROM focused_habits fh
  JOIN habits h ON h.id = fh.habit_id
  GROUP BY fh.user_id
)
SELECT 
  p.id as user_id,
  p.phone_number,
  
  -- Demographics
  json_build_object(
    'full_name', p.full_name,
    'email', p.email,
    'gender', p.gender,
    'height_feet', p.height_feet,
    'height_inches', p.height_inches,
    'date_of_birth', p.date_of_birth,
    'created_at', p.created_at
  ) as demographics,
  
  -- Current Goals and Body Types
  json_build_object(
    'current_body_type', cbt.name,
    'goal_body_type', gbt.name,
    'started_date', g.started_date,
    'target_date', g.target_date,
    'days_remaining', (g.target_date - CURRENT_DATE),
    'progress_percentage', 
      CASE 
        WHEN g.target_date > g.started_date 
        THEN ROUND(((CURRENT_DATE - g.started_date)::numeric / (g.target_date - g.started_date)::numeric * 100), 1)
        ELSE 0 
      END
  ) as goals_and_body_types,
  
  -- Latest Check-in
  json_build_object(
    'weight_lbs', lc.weight_lbs,
    'body_fat_percentage', lc.body_fat_percentage,
    'last_checkin_date', lc.last_checkin_date,
    'notes', lc.notes,
    'days_since_checkin', (CURRENT_DATE - lc.last_checkin_date::date)
  ) as latest_checkin,
  
  -- Progress Summary
  json_build_object(
    'total_checkins', ps.total_checkins,
    'starting_weight', ps.starting_weight,
    'current_weight', ps.current_weight,
    'weight_change', ps.weight_change,
    'avg_body_fat', ROUND(ps.avg_body_fat, 1)
  ) as progress_summary,
  
  -- Habit Repurpose Plan
  hrp.habit_plan,
  
  -- Focused Habits
  fhd.focused_habits,
  
  -- Latest Motivation Module
  json_build_object(
    'module_type', lm.module_type,
    'completed_at', lm.completed_at,
    'days_since_completion', (CURRENT_DATE - lm.completed_at::date),
    'data', lm.module_data
  ) as latest_motivation_module,
  
  -- Coach Assignment
  json_build_object(
    'has_coach', (p.assigned_coach_id IS NOT NULL),
    'coach_id', p.assigned_coach_id
  ) as coaching_info,
  
  -- Last Updated
  NOW() as view_generated_at

FROM profiles p
LEFT JOIN goals g ON g.user_id = p.id 
  AND g.created_at = (SELECT MAX(created_at) FROM goals WHERE user_id = p.id)
LEFT JOIN body_types cbt ON cbt.id = g.current_body_type_id
LEFT JOIN body_types gbt ON gbt.id = g.goal_body_type_id
LEFT JOIN latest_checkin lc ON lc.user_id = p.id
LEFT JOIN progress_summary ps ON ps.user_id = p.id
LEFT JOIN habit_repurpose_data hrp ON hrp.user_id = p.id
LEFT JOIN focused_habits_data fhd ON fhd.user_id = p.id
LEFT JOIN latest_motivation lm ON lm.user_id = p.id
WHERE p.phone_number IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON public.client_daily_update_data TO authenticated;
GRANT SELECT ON public.client_daily_update_data TO service_role;