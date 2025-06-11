
-- Create table for storing existing habits assessments
CREATE TABLE public.existing_habits_assessment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sleep', 'calories', 'protein', 'training', 'lifestyle')),
  question_1_answer TEXT NOT NULL CHECK (question_1_answer IN ('a', 'b', 'c')),
  question_2_answer TEXT NOT NULL CHECK (question_2_answer IN ('a', 'b', 'c')),
  question_3_answer TEXT CHECK (question_3_answer IN ('a', 'b', 'c')),
  identified_habit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.existing_habits_assessment ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own assessments
CREATE POLICY "Users can view their own existing habits assessments" 
  ON public.existing_habits_assessment 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own assessments
CREATE POLICY "Users can create their own existing habits assessments" 
  ON public.existing_habits_assessment 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own assessments
CREATE POLICY "Users can update their own existing habits assessments" 
  ON public.existing_habits_assessment 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own assessments
CREATE POLICY "Users can delete their own existing habits assessments" 
  ON public.existing_habits_assessment 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.existing_habits_assessment
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
