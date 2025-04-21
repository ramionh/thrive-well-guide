
export type Habit = {
  id: string;
  category: 'SLEEP' | 'CALORIE_INTAKE' | 'PROTEIN_INTAKE' | 'ADAPTIVE_TRAINING' | 'LIFESTYLE_GUARDRAILS';
  category_description: string;
  habit_number: number;
  name: string;
  description: string;
  created_at: string;
  is_focused?: boolean; // Add this to track if habit is currently focused
};

export type FocusedHabit = {
  id: string;
  user_id: string;
  habit_id: string;
  created_at: string;
};
