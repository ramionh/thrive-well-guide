
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

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
  transformData?: (formData: T) => U,
  options: SubmitOptions = {}
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { onSuccess, stepNumber, stepName } = options;

  const submitForm = useCallback(async (formData: T) => {
    if (!user) {
      console.log(`useMotivationSubmit: No user found for ${tableName}`);
      toast({
        title: "Error",
        description: "You need to be logged in to save data",
        variant: "destructive",
      });
      return;
    }

    console.log(`useMotivationSubmit: Submitting data for ${tableName}`, formData);
    setIsSaving(true);

    try {
      let dataToSubmit: Record<string, any>;

      if (transformData) {
        // Use the transform function if provided
        dataToSubmit = transformData(formData);
      } else {
        // Default transformation: just add user_id
        dataToSubmit = { ...formData };
      }

      // Ensure we have a user_id
      dataToSubmit.user_id = user.id;

      console.log(`useMotivationSubmit: Transformed data for ${tableName}:`, dataToSubmit);

      // Insert data into the table
      const { error: insertError } = await supabase
        .from(tableName as any)
        .insert(dataToSubmit);

      if (insertError) {
        console.error(`useMotivationSubmit: Error inserting data for ${tableName}:`, insertError);
        throw insertError;
      }

      // Update step progress if stepNumber is provided
      if (stepNumber) {
        console.log(`useMotivationSubmit: Updating step progress for step ${stepNumber}`);
        const { error: progressError } = await supabase
          .from('motivation_steps_progress')
          .upsert(
            {
              user_id: user.id,
              step_number: stepNumber,
              step_name: stepName || `Step ${stepNumber}`,
              completed: true,
              completed_at: new Date().toISOString()
            },
            { onConflict: 'user_id,step_number' }
          );

        if (progressError) {
          console.error(`useMotivationSubmit: Error updating step progress:`, progressError);
          throw progressError;
        }
      }

      console.log(`useMotivationSubmit: Data successfully submitted for ${tableName}`);
      toast({
        title: "Success",
        description: "Your data has been saved",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error(`useMotivationSubmit: Error in submitting ${tableName} data:`, error);
      toast({
        title: "Error",
        description: `Failed to save your data: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, tableName, transformData, toast, onSuccess, stepNumber, stepName]);

  return { submitForm, isSaving };
};
