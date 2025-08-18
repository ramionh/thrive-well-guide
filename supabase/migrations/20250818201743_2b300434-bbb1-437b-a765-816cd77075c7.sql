-- Create table for habit day plans with obstacles and contingencies
CREATE TABLE public.habit_day_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('best_day', 'worst_day')),
  description TEXT NOT NULL,
  obstacles JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id, plan_type)
);

-- Enable Row Level Security
ALTER TABLE public.habit_day_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own habit day plans" 
ON public.habit_day_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit day plans" 
ON public.habit_day_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit day plans" 
ON public.habit_day_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit day plans" 
ON public.habit_day_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create coaches policy for viewing assigned clients
CREATE POLICY "Coaches can view their assigned clients habit day plans" 
ON public.habit_day_plans 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = habit_day_plans.user_id 
  AND profiles.assigned_coach_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_habit_day_plans_updated_at
BEFORE UPDATE ON public.habit_day_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();