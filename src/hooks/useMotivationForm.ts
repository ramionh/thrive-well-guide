import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useProgress } from "@/hooks/motivation/useProgress";

interface UseMotivationFormProps {
  tableName: string;
  initialState: Record<string, any>;
  transformData: (data: any) => Record<string, any>;
  onSuccess?: () => void;
  stepNumber: number;
  nextStepNumber: number;
  stepName: string;
  nextStepName: string;
}

export const useMotivationForm = ({
  tableName,
  initialState,
  transformData,
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
      
      const { data, error } = await supabase
        .from(tableName)
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
        setFormData(transformData(data));
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
  }, [user, tableName, transformData, initialState]);

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
    
    console.log(`Submitting data to ${tableName}:`, dataToSubmit);
    setIsSaving(true);
    setError(null);

    try {
      // Insert the data into the database
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          ...dataToSubmit
        });

      if (insertError) throw insertError;

      console.log(`Data successfully saved to ${tableName}`);
      
      // Mark the step as complete in the progress tracker
      await markStepComplete(stepNumber, nextStepNumber, stepName, nextStepName);
      
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
  }, [user, formData, tableName, markStepComplete, stepNumber, nextStepNumber, stepName, nextStepName, onSuccess]);

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