
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

interface SubmitOptions {
  onSuccess?: () => void;
  stepNumber?: number;
  nextStepNumber?: number;
  stepName?: string;
  nextStepName?: string;
}

/**
 * Hook for submitting motivation form data
 */
export const useMotivationSubmit = <T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(
  tableName: string,
  transformData?: (data: T) => U,
  options: SubmitOptions = {}
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const isSubmitting = useRef(false);
  
  const { 
    onSuccess, 
    stepNumber, 
    nextStepNumber, 
    stepName,
    nextStepName
  } = options;

  /**
   * Submit form data to the database
   */
  const submitForm = async (formData: T) => {
    if (isSubmitting.current) {
      console.log(`useMotivationSubmit: Submission already in progress for ${tableName}, skipping`);
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your data",
        variant: "destructive",
      });
      return;
    }

    console.log(`useMotivationSubmit: Submitting data to ${tableName} for user ${user.id}`);
    console.log("Raw form data:", formData);
    
    setIsSaving(true);
    isSubmitting.current = true;

    try {
      // Transform data if a transformer function is provided
      const dataToSubmit: Record<string, any> = { 
        user_id: user.id,
        ...(transformData ? transformData(formData) : formData),
        step_number: stepNumber,
        step_name: stepName
      };
      
      console.log("Transformed data to submit:", dataToSubmit);
      
      // Use 'as any' to bypass TypeScript's strict table name checking
      const { error } = await supabase
        .from(tableName as any)
        .insert(dataToSubmit);
      
      if (error) throw error;
      
      // Log progress to the steps_progress table to track completion
      if (stepNumber) {
        await logStepProgress(stepNumber, stepName);
      }

      toast({
        title: "Success",
        description: nextStepName 
          ? `${stepName || 'Step'} completed! Moving on to ${nextStepName}.` 
          : "Your progress has been saved.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(`Error saving data to ${tableName}:`, err);
      toast({
        title: "Error",
        description: "Failed to save your data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      isSubmitting.current = false;
    }
  };

  /**
   * Log step progress in the steps_progress table
   */
  const logStepProgress = async (stepNum: number, name?: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from("motivation_steps_progress").insert({
        user_id: user.id,
        step_number: stepNum,
        step_name: name || `Step ${stepNum}`,
        completed: true
      });
      
      if (error && error.code !== '23505') { // Ignore unique constraint violations (step already logged)
        console.error("Error logging step progress:", error);
      }
    } catch (err) {
      console.error("Failed to log step progress:", err);
    }
  };

  return {
    submitForm,
    isSaving
  };
};
