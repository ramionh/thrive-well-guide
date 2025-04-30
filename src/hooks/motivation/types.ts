
import { User } from "@supabase/supabase-js";

export interface MotivationFormState<T> {
  formData: T;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

export interface MotivationFormOptions<T, U = Record<string, any>> {
  tableName: string;
  initialState: T;
  onSuccess?: () => void;
  parseData?: (data: any) => T;
  transformData?: (data: T) => U;
  stepNumber?: number;
  nextStepNumber?: number;
  stepName?: string;
  nextStepName?: string;
}

export interface MotivationStepProgress {
  user_id: string;
  step_number: number;
  step_name: string;
  completed: boolean;
  completed_at: string | null;
  available?: boolean;
}
