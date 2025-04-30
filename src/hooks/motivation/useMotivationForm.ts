
import { useState } from "react";
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

  // Get data from useMotivationData hook
  const { 
    formData, 
    setFormData, 
    isLoading, 
    error, 
    fetchData 
  } = useMotivationData<T>(tableName, initialState, parseData);

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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Submit form data
   */
  const submitForm = () => {
    submitFormToDb(formData);
  };

  return {
    formData,
    isLoading,
    isSaving,
    error,
    fetchData,
    updateForm,
    submitForm
  };
};

// Export the legacy useMotivationForm from the original location
export * from "./useMotivationForm";
