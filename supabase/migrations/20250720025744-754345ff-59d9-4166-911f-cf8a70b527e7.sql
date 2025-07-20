-- Add gender column to body_types table
ALTER TABLE public.body_types ADD COLUMN gender text NOT NULL DEFAULT 'male';

-- Create duplicate records for female body types
INSERT INTO public.body_types (name, bodyfat_range, population_percentage, image_url, gender)
SELECT 
  name,
  CASE 
    WHEN name = 'Ripped' THEN '10-13%'
    WHEN name = 'Elite' THEN '14-17%'
    WHEN name = 'Fit' THEN '18-21%'
    WHEN name = 'Average' THEN '22-25%'
    WHEN name = 'Overweight' THEN '26-30%'
    WHEN name = 'Obese' THEN '31%+'
  END as bodyfat_range,
  population_percentage,
  image_url,
  'female' as gender
FROM public.body_types
WHERE gender = 'male';

-- Update the existing records to be explicitly male
UPDATE public.body_types SET gender = 'male' WHERE gender = 'male';