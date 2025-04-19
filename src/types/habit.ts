
export type Habit = {
  id: string;
  category: 'SLEEP' | 'CALORIE_INTAKE' | 'PROTEIN_INTAKE' | 'ADAPTIVE_TRAINING' | 'LIFESTYLE_GUARDRAILS';
  category_description: string;
  habit_number: number;
  name: string;
  description: string;
  created_at: string;
};
