
import { useState, useEffect } from "react";
import { AffirmationItem, UseAffirmationsFormResult } from "./types";
import { useAffirmationsData } from "./useAffirmationsData";
import { useSaveAffirmations } from "./useSaveAffirmations";

export const useAffirmationsForm = (onComplete?: () => void): UseAffirmationsFormResult => {
  const { affirmations: initialAffirmations, setAffirmations, isLoading, refresh } = useAffirmationsData();
  const [affirmations, setLocalAffirmations] = useState<AffirmationItem[]>(initialAffirmations);
  const { isSaving, saveAffirmations: saveToDb } = useSaveAffirmations(affirmations, onComplete);
  
  // This useEffect will update the local state whenever initialAffirmations changes
  useEffect(() => {
    if (!isLoading && initialAffirmations.length > 0) {
      console.log("Updating local affirmations from fetched data:", initialAffirmations);
      // Create a new array with deep copies of each item to avoid reference issues
      setLocalAffirmations(initialAffirmations.map(item => ({
        criticism: item.criticism || "",
        positive: item.positive || ""
      })));
    }
  }, [isLoading, initialAffirmations]);
  
  const updateAffirmation = (index: number, field: keyof AffirmationItem, value: string) => {
    const updatedAffirmations = [...affirmations];
    updatedAffirmations[index] = {
      ...updatedAffirmations[index],
      [field]: value
    };
    setLocalAffirmations(updatedAffirmations);
    setAffirmations(updatedAffirmations);
  };

  const saveAffirmations = async () => {
    await saveToDb();
    // Refresh the data after saving to ensure UI is in sync with database
    refresh();
  };

  return {
    affirmations: affirmations,
    isLoading,
    isSaving,
    updateAffirmation,
    saveAffirmations
  };
};
