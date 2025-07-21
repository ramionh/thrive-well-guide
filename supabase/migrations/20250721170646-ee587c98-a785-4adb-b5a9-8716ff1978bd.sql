-- Clean up duplicate body types while preserving referential integrity

-- First, let's identify the body type IDs we want to keep (one per category)
-- These are the ones that have references in gender_body_type_ranges table

-- Create temporary table to map old IDs to new canonical IDs
CREATE TEMP TABLE body_type_mapping AS
SELECT DISTINCT
    name,
    MIN(id) as canonical_id
FROM body_types 
GROUP BY name;

-- Update gender_body_type_ranges to use canonical body type IDs
UPDATE gender_body_type_ranges
SET body_type_id = mapping.canonical_id
FROM body_type_mapping mapping
JOIN body_types bt ON bt.id = gender_body_type_ranges.body_type_id
WHERE bt.name = mapping.name
AND gender_body_type_ranges.body_type_id != mapping.canonical_id;

-- Update user_body_types to use canonical body type IDs (if any references exist)
UPDATE user_body_types
SET body_type_id = mapping.canonical_id
FROM body_type_mapping mapping
JOIN body_types bt ON bt.id = user_body_types.body_type_id
WHERE bt.name = mapping.name
AND user_body_types.body_type_id != mapping.canonical_id;

-- Update goals table references to use canonical body type IDs
UPDATE goals
SET current_body_type_id = mapping.canonical_id
FROM body_type_mapping mapping
JOIN body_types bt ON bt.id = goals.current_body_type_id
WHERE bt.name = mapping.name
AND goals.current_body_type_id != mapping.canonical_id;

UPDATE goals
SET goal_body_type_id = mapping.canonical_id
FROM body_type_mapping mapping
JOIN body_types bt ON bt.id = goals.goal_body_type_id
WHERE bt.name = mapping.name
AND goals.goal_body_type_id != mapping.canonical_id;

-- Now delete duplicate body type records, keeping only the canonical ones
DELETE FROM body_types 
WHERE id NOT IN (
    SELECT canonical_id FROM body_type_mapping
);

-- Update the remaining body types to have consistent data
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