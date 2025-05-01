
import { useState } from "react";
import { AffirmationItem, UseAffirmationsFormResult } from "./types";
import { useAffirmationsData } from "./useAffirmationsData";
import { useSaveAffirmations } from "./useSaveAffirmations";

export const useAffirmationsForm = (onComplete?: () => void): UseAffirmationsFormResult => {
  const { affirmations: initialAffirmations, setAffirmations, isLoading } = useAffirmationsData();
  const [affirmations, setLocalAffirmations] = useState<AffirmationItem[]>(initialAffirmations);
  const { isSaving, saveAffirmations: saveToDb } = useSaveAffirmations(affirmations, onComplete);
  
  const updateAffirmation = (index: number, field: keyof AffirmationItem, value: string) => {
    const updatedAffirmations = [...affirmations];
    updatedAffirmations[index] = {
      ...updatedAffirmations[index],
      [field]: value
    };
    setLocalAffirmations(updatedAffirmations);
    setAffirmations(updatedAffirmations);
  };

  // Make sure the local state updates when the data is loaded
  if (isLoading === false && initialAffirmations !== affirmations) {
    setLocalAffirmations(initialAffirmations);
  }

  const saveAffirmations = async () => {
    await saveToDb();
  };

  return {
    affirmations: isLoading ? initialAffirmations : affirmations,
    isLoading,
    isSaving,
    updateAffirmation,
    saveAffirmations
  };
};
