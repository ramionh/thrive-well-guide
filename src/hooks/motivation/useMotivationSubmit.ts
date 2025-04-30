
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { MotivationStepProgress } from "./types";

/**
 * Hook for submitting motivation form data
 */
export const useMotivationSubmit = <T, U = Record<string, any>>(
  tableName: string,
  transformData?: (data: T) => U,
  options?: {
    onSuccess?: () => void;
    stepNumber?: number;
    nextStepNumber?: number;
    stepName?: string;
    nextStepName?: string;
  }
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Submit form data to the database
   */
  const submitForm = async (formData: T) => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Transform the data if a transformer is provided
      let dataToSubmit: Record<string, any>;
      if (transformData) {
        dataToSubmit = transformData(formData);
      } else {
        // Default transformation: map camelCase keys to snake_case column names
        dataToSubmit = {};
        Object.keys(formData).forEach(key => {
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          dataToSubmit[snakeKey] = formData[key as keyof T];
        });
      }

      // Add user_id to the data
      dataToSubmit.user_id = user.id;

      // Check if a record already exists
      const { data: existingData, error: queryError } = await supabase
        .from(tableName as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      // Check if existingData exists and has an id property
      if (existingData && 'id' in existingData) {
        // Update existing record
        result = await supabase
          .from(tableName as any)
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        result = await supabase
          .from(tableName as any)
          .insert({
            ...dataToSubmit,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) throw result.error;

      // Update step progress if stepNumber is provided
      if (options?.stepNumber) {
        await updateStepProgress(user.id, options);
      }

      toast({
        title: "Success",
        description: "Your response has been saved"
      });

      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(`Error saving ${tableName} data:`, error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update step progress in the database
   */
  const updateStepProgress = async (
    userId: string,
    options: {
      stepNumber?: number;
      nextStepNumber?: number;
      stepName?: string;
      nextStepName?: string;
    }
  ) => {
    if (!options.stepNumber) return;

    try {
      // Mark current step as completed
      const currentStep: MotivationStepProgress = {
        user_id: userId,
        step_number: options.stepNumber,
        step_name: options.stepName || `Step ${options.stepNumber}`,
        completed: true,
        completed_at: new Date().toISOString()
      };

      const { error: progressError } = await supabase
        .from("motivation_steps_progress" as any)
        .upsert(currentStep, { onConflict: "user_id,step_number" });

      if (progressError) throw progressError;

      // Make next step available if nextStepNumber is provided
      if (options.nextStepNumber) {
        const nextStep: MotivationStepProgress = {
          user_id: userId,
          step_number: options.nextStepNumber,
          step_name: options.nextStepName || `Step ${options.nextStepNumber}`,
          completed: false,
          available: true,
          completed_at: null
        };

        const { error: nextStepError } = await supabase
          .from("motivation_steps_progress" as any)
          .upsert(nextStep, { onConflict: "user_id,step_number" });

        if (nextStepError) throw nextStepError;
      }
    } catch (error) {
      console.error("Error updating step progress:", error);
      throw error;
    }
  };

  return {
    submitForm,
    isSaving
  };
};
