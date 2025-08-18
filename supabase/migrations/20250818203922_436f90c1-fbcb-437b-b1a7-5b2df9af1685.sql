-- Create table for habit implementation step data
CREATE TABLE public.habit_implementation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 7),
  step_content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id, week_number)
);

-- Enable RLS
ALTER TABLE public.habit_implementation_steps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own implementation steps" 
ON public.habit_implementation_steps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own implementation steps" 
ON public.habit_implementation_steps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own implementation steps" 
ON public.habit_implementation_steps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own implementation steps" 
ON public.habit_implementation_steps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_habit_implementation_steps_updated_at
BEFORE UPDATE ON public.habit_implementation_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();