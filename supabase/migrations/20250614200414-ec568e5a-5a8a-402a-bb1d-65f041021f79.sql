
-- Enable RLS on body_types table if not already enabled
ALTER TABLE public.body_types ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read body types (they are public data)
DROP POLICY IF EXISTS "Allow public read access to body types" ON public.body_types;
CREATE POLICY "Allow public read access to body types" 
ON public.body_types 
FOR SELECT 
TO public 
USING (true);

-- Also ensure gender_body_type_ranges is accessible
ALTER TABLE public.gender_body_type_ranges ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read gender-specific body type ranges
DROP POLICY IF EXISTS "Allow public read access to gender body type ranges" ON public.gender_body_type_ranges;
CREATE POLICY "Allow public read access to gender body type ranges" 
ON public.gender_body_type_ranges 
FOR SELECT 
TO public 
USING (true);
