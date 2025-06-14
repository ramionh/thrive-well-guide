
-- Instead of deleting, let's update existing body types and insert missing ones
-- First, let's see what we have and update accordingly

-- Update existing body types or insert new ones
INSERT INTO public.body_types (name, bodyfat_range, population_percentage, image_url) VALUES
('Ripped', '3-6%', '2%', ''),
('Elite', '7-10%', '5%', ''),
('Fit', '11-14%', '15%', ''),
('Average', '15-19%', '35%', ''),
('Overweight', '20-24%', '30%', ''),
('Obese', '25%+', '13%', '')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bodyfat_range = EXCLUDED.bodyfat_range,
  population_percentage = EXCLUDED.population_percentage,
  image_url = EXCLUDED.image_url;

-- Clear and rebuild gender-specific ranges
DELETE FROM public.gender_body_type_ranges;

-- Insert gender-specific body fat ranges for males
INSERT INTO public.gender_body_type_ranges (body_type_id, gender, bodyfat_range, image_name) 
SELECT 
  bt.id,
  'male',
  bt.bodyfat_range,
  bt.name || '.png'
FROM body_types bt;

-- Insert gender-specific body fat ranges for females
INSERT INTO public.gender_body_type_ranges (body_type_id, gender, bodyfat_range, image_name)
SELECT 
  bt.id,
  'female',
  CASE 
    WHEN bt.name = 'Ripped' THEN '10-13%'
    WHEN bt.name = 'Elite' THEN '14-17%'
    WHEN bt.name = 'Fit' THEN '18-21%'
    WHEN bt.name = 'Average' THEN '22-25%'
    WHEN bt.name = 'Overweight' THEN '26-30%'
    WHEN bt.name = 'Obese' THEN '31%+'
  END,
  'woman_' || LOWER(bt.name) || '.png'
FROM body_types bt;
