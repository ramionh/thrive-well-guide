-- Clean up duplicate body types while preserving referential integrity

-- Step 1: Create a temporary table with canonical body type mappings
CREATE TEMP TABLE canonical_mapping AS
SELECT DISTINCT ON (name)
    id as canonical_id,
    name
FROM body_types 
ORDER BY name, created_at ASC;

-- Step 2: Update gender_body_type_ranges to use canonical body type IDs
UPDATE gender_body_type_ranges
SET body_type_id = (
    SELECT cm.canonical_id
    FROM canonical_mapping cm
    JOIN body_types bt ON bt.name = cm.name
    WHERE bt.id = gender_body_type_ranges.body_type_id
)
WHERE body_type_id NOT IN (SELECT canonical_id FROM canonical_mapping);

-- Step 3: Update user_body_types to use canonical body type IDs
UPDATE user_body_types
SET body_type_id = (
    SELECT cm.canonical_id
    FROM canonical_mapping cm
    JOIN body_types bt ON bt.name = cm.name
    WHERE bt.id = user_body_types.body_type_id
)
WHERE body_type_id NOT IN (SELECT canonical_id FROM canonical_mapping);

-- Step 4: Update goals table current_body_type_id references
UPDATE goals
SET current_body_type_id = (
    SELECT cm.canonical_id
    FROM canonical_mapping cm
    JOIN body_types bt ON bt.name = cm.name
    WHERE bt.id = goals.current_body_type_id
)
WHERE current_body_type_id NOT IN (SELECT canonical_id FROM canonical_mapping);

-- Step 5: Update goals table goal_body_type_id references
UPDATE goals
SET goal_body_type_id = (
    SELECT cm.canonical_id
    FROM canonical_mapping cm
    JOIN body_types bt ON bt.name = cm.name
    WHERE bt.id = goals.goal_body_type_id
)
WHERE goal_body_type_id NOT IN (SELECT canonical_id FROM canonical_mapping);

-- Step 6: Delete duplicate body type records
DELETE FROM body_types 
WHERE id NOT IN (SELECT canonical_id FROM canonical_mapping);

-- Step 7: Update the remaining body types to have consistent data
UPDATE body_types SET 
    gender = 'unisex',
    bodyfat_range = CASE 
        WHEN name = 'Ripped' THEN '6-10% (M) / 10-13% (F)'
        WHEN name = 'Elite' THEN '10-13% (M) / 14-17% (F)'
        WHEN name = 'Fit' THEN '14-17% (M) / 18-21% (F)'
        WHEN name = 'Average' THEN '18-24% (M) / 22-25% (F)'
        WHEN name = 'Overweight' THEN '25-29% (M) / 26-30% (F)'
        WHEN name = 'Obese' THEN '30%+ (M) / 31%+ (F)'
    END,
    population_percentage = CASE 
        WHEN name = 'Ripped' THEN '1-3%'
        WHEN name = 'Elite' THEN '3-5%'
        WHEN name = 'Fit' THEN '10-15%'
        WHEN name = 'Average' THEN '35-40%'
        WHEN name = 'Overweight' THEN '25-30%'
        WHEN name = 'Obese' THEN '13-15%'
    END;