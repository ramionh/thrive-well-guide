
import { useState, useEffect } from "react";
import { AffirmationItem, UseAffirmationsFormResult } from "./types";
import { useAffirmationsData } from "./useAffirmationsData";
import { useSaveAffirmations } from "./useSaveAffirmations";

export const useAffirmationsForm = (
  onComplete?: () => void
): UseAffirmationsFormResult => {
  // Grab rowId + loaded data
  const {
    recordId,
    affirmations: initial,
    setAffirmations: setRemote,
    isLoading,
  } = useAffirmationsData();

  // Local copy for editing
  const [affirmations, setLocal] = useState<AffirmationItem[]>(initial);

  // When server data arrives, overwrite local
  useEffect(() => {
    if (!isLoading) {
      setLocal(initial);
    }
  }, [isLoading, initial]);

  // Hook to persist changes
  const { isSaving, saveAffirmations: _save } = useSaveAffirmations(
    affirmations,
    recordId,
    onComplete
  );

  const updateAffirmation = (
    index: number,
    field: keyof AffirmationItem,
    value: string
  ) => {
    const copy = [...affirmations];
    copy[index] = { ...copy[index], [field]: value };
    setLocal(copy);
    setRemote(copy);
  };

  const saveAffirmations = async () => {
    await _save();
  };

  return {
    affirmations: isLoading ? initial : affirmations,
    isLoading,
    isSaving,
    updateAffirmation,
    saveAffirmations,
  };
};
