
import { Json } from "@/integrations/supabase/types";

export interface AffirmationItem {
  criticism: string;
  positive: string;
}

export interface AffirmationsState {
  isLoading: boolean;
  isSaving: boolean;
  affirmations: AffirmationItem[];
}

export interface UseAffirmationsFormResult {
  affirmations: AffirmationItem[];
  isLoading: boolean;
  isSaving: boolean;
  updateAffirmation: (index: number, field: keyof AffirmationItem, value: string) => void;
  saveAffirmations: () => Promise<void>;
}
