
import { useState } from 'react';
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TimeManagementFormData {
  currentSchedule: string;
  timeSlots: string;
  quickActivities: string;
  impact: string;
}

interface UseTimeManagementSubmitProps {
  onComplete?: () => void;
}

export const useTimeManagementSubmit = ({ onComplete }: UseTimeManagementSubmitProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const submitForm = async (formData: TimeManagementFormData) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database
      const dataToSubmit = {
        user_id: user.id,
        current_schedule: formData.currentSchedule,
        time_slots: formData.timeSlots,
        quick_activities: formData.quickActivities,
        impact: formData.impact,
        updated_at: new Date().toISOString()
      };

      // Check if record already exists
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_time_management")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      if (existingData && 'id' in existingData) {
        // Update existing record
        result = await supabase
          .from("motivation_time_management")
          .update(dataToSubmit)
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        const insertData = {
          ...dataToSubmit,
          created_at: new Date().toISOString()
        };
        result = await supabase
          .from("motivation_time_management")
          .insert(insertData);
      }

      if (result.error) throw result.error;

      // Update step progress
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 63,
            step_name: "Time Management and Personal Structure",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );

      if (progressError) throw progressError;
      
      // Make next step available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 64,
            step_name: "Where Are You Now",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your time management information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving time management data:", error);
      toast({
        title: "Error",
        description: "Failed to save your time management information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    submitForm,
    isSaving
  };
};
