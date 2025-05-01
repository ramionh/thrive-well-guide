
import { useState, useEffect } from "react";
import { AffirmationItem, UseAffirmationsFormResult } from "./types";
import { useAffirmationsData } from "./useAffirmationsData";
import { useSaveAffirmations } from "./useSaveAffirmations";

export const useAffirmationsForm = (onComplete?: () => void): UseAffirmationsFormResult => {
  const { affirmations: initialAffirmations, setAffirmations, isLoading } = useAffirmationsData();
  const [localAffirmations, setLocalAffirmations] = useState<AffirmationItem[]>(initialAffirmations);
  const { isSaving, saveAffirmations: saveToDb } = useSaveAffirmations(localAffirmations, onComplete);

  useEffect(() => {
    // Synchronize local state with initial data when it changes (and is not loading)
    if (!isLoading && initialAffirmations !== localAffirmations) {
      setLocalAffirmations(initialAffirmations);
    }
  }, [isLoading, initialAffirmations]);

  const updateAffirmation = (index: number, field: keyof AffirmationItem, value: string) => {
    const updatedAffirmations = [...localAffirmations];
    updatedAffirmations[index] = {
      ...updatedAffirmations[index],
      [field]: value,
    };
    setLocalAffirmations(updatedAffirmations);
    setAffirmations(updatedAffirmations);
  };

  const saveAffirmations = async () => {
    await saveToDb();
  };

  return {
    affirmations: isLoading ? initialAffirmations : localAffirmations,
    isLoading,
    isSaving,
    updateAffirmation,
    saveAffirmations,
  };
};
