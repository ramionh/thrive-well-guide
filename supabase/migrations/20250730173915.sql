-- Drop the existing view
DROP VIEW IF EXISTS public.client_daily_update_data;

-- Create updated view with unique records per phone number
CREATE VIEW public.client_daily_update_data AS
WITH latest_goal AS (
  SELECT DISTINCT ON (g.user_id) 
    g.user_id,
    g.id as goal_id,
    g.started_date,
    g.target_date,
    current_bt.name as current_body_type_name,
    current_bt.bodyfat_range as current_bodyfat_range,
    goal_bt.name as goal_body_type_name,
    goal_bt.bodyfat_range as goal_bodyfat_range
  FROM goals g
  LEFT JOIN body_types current_bt ON g.current_body_type_id = current_bt.id
  LEFT JOIN body_types goal_bt ON g.goal_body_type_id = goal_bt.id
  ORDER BY g.user_id, g.created_at DESC
),
latest_checkin AS (
  SELECT DISTINCT ON (wc.user_id)
    wc.user_id,
    wc.weight_lbs,
    wc.body_fat_percentage,
    wc.estimated_bodyfat_percentage,
    wc.front_photo_url,
    wc.back_photo_url,
    wc.notes as checkin_notes,
    wc.created_at as checkin_date
  FROM weekly_checkins wc
  ORDER BY wc.user_id, wc.created_at DESC
),
progress_summary AS (
  SELECT 
    dht.user_id,
    COUNT(*) as total_tracking_days,
    AVG(dht.mood) as avg_mood,
    AVG(dht.sleep_hours) as avg_sleep_hours,
    AVG(dht.exercise_minutes) as avg_exercise_minutes,
    AVG(dht.calories) as avg_calories,
    AVG(dht.protein) as avg_protein,
    AVG(dht.water) as avg_water,
    AVG(dht.steps) as avg_steps
  FROM daily_health_tracking dht
  WHERE dht.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY dht.user_id
),
habit_plan AS (
  SELECT 
    hrg.user_id,
    json_build_object(
      'goals', json_agg(json_build_object('goal_text', hrg.goal_text, 'is_learning_goal', hrg.is_learning_goal)),
      'unwanted_habits', (
        SELECT json_agg(json_build_object('habit_description', hruh.habit_description, 'habit_trigger', hruh.habit_trigger, 'habit_feeling', hruh.habit_feeling))
        FROM habit_repurpose_unwanted_habits hruh 
        WHERE hruh.user_id = hrg.user_id
      ),
      'replacements', (
        SELECT json_agg(json_build_object('trigger_routine', hrr.trigger_routine, 'action_routine', hrr.action_routine, 'replacement_habit', hrr.replacement_habit))
        FROM habit_repurpose_replacements hrr 
        WHERE hrr.user_id = hrg.user_id
      ),
      'if_then_plans', (
        SELECT json_agg(json_build_object('trigger_text', hritp.trigger_text, 'good_habit_text', hritp.good_habit_text))
        FROM habit_repurpose_if_then_plans hritp 
        WHERE hritp.user_id = hrg.user_id
      ),
      'environment', (
        SELECT json_build_object('make_good_habit_easier', hre.make_good_habit_easier, 'make_bad_habit_harder', hre.make_bad_habit_harder)
        FROM habit_repurpose_environment hre 
        WHERE hre.user_id = hrg.user_id
        LIMIT 1
      )
    ) as habit_plan_data
  FROM habit_repurpose_goals hrg
  GROUP BY hrg.user_id
),
focused_habits_data AS (
  SELECT 
    fh.user_id,
    json_agg(json_build_object('name', h.name, 'description', h.description, 'category', h.category)) as focused_habits
  FROM focused_habits fh
  LEFT JOIN habits h ON fh.habit_id = h.id
  GROUP BY fh.user_id
),
latest_motivation AS (
  SELECT DISTINCT ON (table_name, user_id)
    user_id,
    table_name,
    data,
    created_at
  FROM (
    SELECT user_id, 'motivation_affirmations' as table_name, 
           json_build_object('affirmations', affirmations) as data, created_at
    FROM motivation_affirmations
    UNION ALL
    SELECT user_id, 'motivation_clarifying_values' as table_name,
           json_build_object('selected_value_1', selected_value_1, 'selected_value_2', selected_value_2, 
                           'reasons_alignment', reasons_alignment, 'goal_value_alignment', goal_value_alignment) as data, created_at
    FROM motivation_clarifying_values
    UNION ALL
    SELECT user_id, 'motivation_confidence_score' as table_name,
           json_build_object('score', score, 'descriptor', descriptor, 'explanation', explanation) as data, created_at
    FROM motivation_confidence_score
    UNION ALL
    SELECT user_id, 'motivation_change_plan' as table_name,
           json_build_object('vision_statement', vision_statement, 'goals', goals, 'action_steps', action_steps,
                           'obstacles_plan', obstacles_plan, 'support_resources', support_resources, 
                           'rewards', rewards, 'monitoring_progress', monitoring_progress) as data, created_at
    FROM motivation_change_plan
  ) motivation_data
  ORDER BY table_name, user_id, created_at DESC
),
latest_motivation_by_user AS (
  SELECT DISTINCT ON (user_id)
    user_id,
    json_build_object('module_name', table_name, 'data', data, 'completed_at', created_at) as latest_motivation_module
  FROM latest_motivation
  ORDER BY user_id, created_at DESC
),
coaching_info AS (
  SELECT 
    p.id as user_id,
    json_build_object(
      'assigned_coach_id', p.assigned_coach_id,
      'coach_name', coach_profile.full_name
    ) as coaching_info
  FROM profiles p
  LEFT JOIN profiles coach_profile ON p.assigned_coach_id = coach_profile.id
)
SELECT 
  p.id as user_id,
  p.phone_number,
  json_build_object(
    'full_name', p.full_name,
    'email', p.email,
    'gender', p.gender,
    'date_of_birth', p.date_of_birth,
    'height_feet', p.height_feet,
    'height_inches', p.height_inches,
    'weight_lbs', p.weight_lbs,
    'preferred_name', p.preferred_name
  ) as demographics,
  json_build_object(
    'current_body_type', lg.current_body_type_name,
    'current_bodyfat_range', lg.current_bodyfat_range,
    'goal_body_type', lg.goal_body_type_name,
    'goal_bodyfat_range', lg.goal_bodyfat_range,
    'started_date', lg.started_date,
    'target_date', lg.target_date
  ) as goals_and_body_types,
  json_build_object(
    'weight_lbs', lc.weight_lbs,
    'body_fat_percentage', lc.body_fat_percentage,
    'estimated_bodyfat_percentage', lc.estimated_bodyfat_percentage,
    'front_photo_url', lc.front_photo_url,
    'back_photo_url', lc.back_photo_url,
    'notes', lc.checkin_notes,
    'date', lc.checkin_date
  ) as latest_checkin,
  json_build_object(
    'total_tracking_days', ps.total_tracking_days,
    'averages', json_build_object(
      'mood', ps.avg_mood,
      'sleep_hours', ps.avg_sleep_hours,
      'exercise_minutes', ps.avg_exercise_minutes,
      'calories', ps.avg_calories,
      'protein', ps.avg_protein,
      'water', ps.avg_water,
      'steps', ps.avg_steps
    )
  ) as progress_summary,
  hp.habit_plan_data as habit_plan,
  fhd.focused_habits,
  lmu.latest_motivation_module,
  ci.coaching_info,
  NOW() as view_generated_at
FROM profiles p
LEFT JOIN latest_goal lg ON p.id = lg.user_id
LEFT JOIN latest_checkin lc ON p.id = lc.user_id
LEFT JOIN progress_summary ps ON p.id = ps.user_id
LEFT JOIN habit_plan hp ON p.id = hp.user_id
LEFT JOIN focused_habits_data fhd ON p.id = fhd.user_id
LEFT JOIN latest_motivation_by_user lmu ON p.id = lmu.user_id
LEFT JOIN coaching_info ci ON p.id = ci.user_id
WHERE p.phone_number IS NOT NULL;