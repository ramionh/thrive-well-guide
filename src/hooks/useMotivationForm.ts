
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useProgress } from "@/hooks/motivation/useProgress";

interface UseMotivationFormProps {
  tableName: string;
  initialState: Record<string, any>;
  transformData?: (data: any) => Record<string, any>;
  parseData?: (data: any) => Record<string, any>;
  onSuccess?: () => void;
  stepNumber?: number;
  nextStepNumber?: number;
  stepName?: string;
  nextStepName?: string;
}

export const useMotivationForm = ({
  tableName,
  initialState,
  transformData = (data) => data,
  parseData = (data) => data,
  onSuccess,
  stepNumber,
  nextStepNumber,
  stepName,
  nextStepName
}: UseMotivationFormProps) => {
  const { user } = useUser();
  const { markStepComplete } = useProgress();
  const [formData, setFormData] = useState<Record<string, any>>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the database
  const fetchData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Fetching data from ${tableName} for user ${user.id}`);
      
      // Use type assertion to handle the dynamic table name
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        console.log(`Data fetched successfully:`, data);
        setFormData(parseData(data));
      } else {
        console.log(`No existing data found in ${tableName}`);
        setFormData(initialState);
      }
    } catch (err: any) {
      console.error(`Error fetching data from ${tableName}:`, err);
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [user, tableName, parseData, initialState]);

  // Update a specific field in the form data
  const updateForm = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    console.log(`Updated form field "${field}" with:`, value);
  }, []);

  // Submit the form data to the database
  const submitForm = useCallback(async (directData?: Record<string, any>) => {
    if (!user) return;
    
    const dataToSubmit = directData || formData;
    const transformedData = transformData ? transformData(dataToSubmit) : dataToSubmit;
    
    console.log(`Submitting data to ${tableName}:`, transformedData);
    setIsSaving(true);
    setError(null);

    try {
      // Insert the data into the database
      // Use type assertion to handle the dynamic table name
      const { error: insertError } = await supabase
        .from(tableName as any)
        .insert({
          user_id: user.id,
          ...transformedData
        });

      if (insertError) throw insertError;

      console.log(`Data successfully saved to ${tableName}`);
      
      // Mark the step as complete in the progress tracker
      if (stepNumber && nextStepNumber && stepName && nextStepName) {
        await markStepComplete(stepNumber, nextStepNumber, stepName, nextStepName);
      } else if (stepNumber && stepName) {
        // If no next step is provided, only mark current step as complete
        await markStepComplete(stepNumber, stepNumber, stepName, stepName);
      }
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err: any) {
      console.error(`Error submitting data to ${tableName}:`, err);
      setError(err.message || "Failed to save data");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, tableName, transformData, markStepComplete, stepNumber, nextStepNumber, stepName, nextStepName, onSuccess]);

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return {
    formData,
    isLoading,
    isSaving,
    error,
    updateForm,
    submitForm,
    fetchData
  };
};
