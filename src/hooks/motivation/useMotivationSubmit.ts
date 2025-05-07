
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
  const hasCompletedSubmission = useRef(false);
  
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
    if (hasCompletedSubmission.current) {
      console.log(`useMotivationSubmit: Submission already completed for ${tableName}, skipping`);
      // If the user is trying to submit again after a successful submission,
      // just trigger the onSuccess callback again
      if (onSuccess) onSuccess();
      return;
    }

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
      const baseData = { 
        user_id: user.id,
        ...(transformData ? transformData(formData) : formData),
      };
      
      console.log("Transformed data to submit:", baseData);
      
      // First, check if a record already exists for this user
      const { data: existingData, error: findError } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (findError && findError.code !== 'PGRST116') {
        console.error(`Error checking for existing data:`, findError);
        throw findError;
      }
      
      let result;
      
      if (existingData) {
        // If record exists, update it
        console.log(`Found existing record for ${tableName}, updating...`);
        result = await supabase
          .from(tableName as any)
          .update({
            ...baseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // If no record exists, insert a new one
        console.log(`No existing record found for ${tableName}, inserting...`);
        result = await supabase
          .from(tableName as any)
          .insert(baseData);
      }
      
      if (result.error) {
        console.error(`Error saving data:`, result.error);
        throw result.error;
      }
      
      console.log(`Data successfully saved to ${tableName}`);
      
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
      
      hasCompletedSubmission.current = true;
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(`Error saving data to ${tableName}:`, err);
      toast({
        title: "Error",
        description: "Failed to save your data: " + (err.message || "Unknown error"),
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
      console.log(`Marking step ${stepNum} (${name}) as completed and making next step available...`);
      
      // Mark current step as completed
      const { error } = await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: stepNum,
          step_name: name || `Step ${stepNum}`,
          completed: true,
          available: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });
      
      if (error) {
        console.error("Error marking step as completed:", error);
      } else {
        console.log(`Successfully marked step ${stepNum} (${name}) as completed`);
      }
      
      // Make next step available if specified
      if (nextStepNumber) {
        console.log(`Making next step ${nextStepNumber} available...`);
        
        const { error: nextStepError } = await supabase
          .from("motivation_steps_progress")
          .upsert({
            user_id: user.id,
            step_number: nextStepNumber,
            step_name: nextStepName || `Step ${nextStepNumber}`,
            completed: false,
            available: true,
            completed_at: null
          }, {
            onConflict: 'user_id,step_number'
          });
        
        if (nextStepError) {
          console.error(`Error making step ${nextStepNumber} available:`, nextStepError);
        } else {
          console.log(`Successfully made step ${nextStepNumber} available`);
        }
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
