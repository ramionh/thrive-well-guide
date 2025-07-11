import { useState, useEffect, useRef } from "react";
import { useMotivationData } from "./useMotivationData";
import { useMotivationSubmit } from "./useMotivationSubmit";
import { MotivationFormOptions } from "./types";

/**
 * Main hook for motivation forms that combines data fetching and submission
 */
export const useMotivationForm = <T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(
  options: MotivationFormOptions<T, U>
) => {
  const { 
    tableName, 
    initialState, 
    onSuccess, 
    parseData, 
    transformData,
    stepNumber,
    nextStepNumber,
    stepName,
    nextStepName
  } = options;

  // Keep a local copy of form data for updates
  const [localFormData, setLocalFormData] = useState<T>(initialState);
  const formDataSynced = useRef(false);

  // Get data from useMotivationData hook
  const { 
    formData: fetchedData, 
    setFormData: setFetchedData, 
    isLoading, 
    error, 
    fetchData 
  } = useMotivationData<T>(tableName, initialState, parseData);

  // Sync fetched data to local state - Fixed logic
  useEffect(() => {
    if (fetchedData && !formDataSynced.current) {
      console.log(`useMotivationForm: Syncing fetched data for ${tableName}:`, fetchedData);
      
      // Check if fetchedData has any non-empty values (not just initial state)
      const hasRealData = Object.values(fetchedData).some(value => 
        value !== "" && value !== null && value !== undefined
      );
      
      if (hasRealData) {
        console.log(`useMotivationForm: Found real data, syncing to local state`);
        setLocalFormData(fetchedData);
        formDataSynced.current = true;
      }
    }
  }, [fetchedData, tableName]);

  // Reset sync flag when data is refetched
  useEffect(() => {
    formDataSynced.current = false;
  }, [fetchedData]);

  // Get submit functionality from useMotivationSubmit hook
  const { 
    submitForm: submitFormToDb, 
    isSaving 
  } = useMotivationSubmit<T, U>(
    tableName,
    transformData,
    { 
      onSuccess, 
      stepNumber, 
      nextStepNumber, 
      stepName, 
      nextStepName 
    }
  );

  /**
   * Update a specific field in the form data
   */
  const updateForm = (field: keyof T, value: any) => {
    console.log(`useMotivationForm: Updating field ${String(field)} with value:`, value);
    
    const updatedData = {
      ...localFormData,
      [field]: value
    };
    
    setLocalFormData(updatedData);
    // Also update the fetched data to keep everything in sync
    setFetchedData(updatedData);
  };

  /**
   * Submit form data
   */
  const submitForm = async () => {
    console.log(`useMotivationForm: Submitting form data to ${tableName}:`, localFormData);
    await submitFormToDb(localFormData);
  };

  return {
    formData: localFormData,
    isLoading,
    isSaving,
    error,
    fetchData,
    updateForm,
    submitForm
  };
};
