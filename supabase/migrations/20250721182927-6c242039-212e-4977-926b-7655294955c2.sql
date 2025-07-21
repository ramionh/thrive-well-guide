-- Insert female body types with appropriate bodyfat ranges and image URLs
INSERT INTO public.body_types (name, bodyfat_range, population_percentage, gender, image_url) VALUES
('Ripped', '16-19%', '2%', 'female', 'women_ripped.png'),
('Elite', '20-22%', '5%', 'female', 'women_elite.png'),
('Fit', '23-25%', '15%', 'female', 'women_fit.png'),
('Average', '26-28%', '35%', 'female', 'women_average.png'),
('Overweight', '29-32%', '30%', 'female', 'women_overweight.png'),
('Obese', '33%+', '13%', 'female', 'women_obese.png');

-- Update existing body types to be male instead of unisex
UPDATE public.body_types 
SET gender = 'male' 
WHERE gender = 'unisex';

-- Update gender_body_type_ranges to reference the correct body type IDs for females
UPDATE public.gender_body_type_ranges 
SET body_type_id = (
  SELECT bt.id 
  FROM public.body_types bt 
  WHERE bt.name = (
    SELECT bt2.name 
    FROM public.body_types bt2 
    WHERE bt2.id = gender_body_type_ranges.body_type_id
  ) 
  AND bt.gender = 'female'
)
WHERE gender = 'female';

-- Update gender_body_type_ranges to reference the correct body type IDs for males
UPDATE public.gender_body_type_ranges 
SET body_type_id = (
  SELECT bt.id 
  FROM public.body_types bt 
  WHERE bt.name = (
    SELECT bt2.name 
    FROM public.body_types bt2 
    WHERE bt2.id = gender_body_type_ranges.body_type_id
  ) 
  AND bt.gender = 'male'
)
WHERE gender = 'male';