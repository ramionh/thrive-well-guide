
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Step } from "@/components/motivation/types/motivation";

export const useMotivationStepsDB = () => {
  const { toast } = useToast();

  /**
   * Fetches step progress from the database for a user
   */
  const fetchStepProgress = async (userId: string, initialSteps: Step[]) => {
    try {
      // Get steps that are marked as completed by default
      const defaultCompletedSteps = initialSteps
        .filter(step => (step as any).defaultCompleted)
        .map(step => step.id);

      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('step_number, completed')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching step progress:', error);
        return { data: null, error };
      }

      // Mark default completed steps in the database if they're not already marked
      for (const stepId of defaultCompletedSteps) {
        const isAlreadyCompleted = data?.some(p => p.step_number === stepId && p.completed);
        if (!isAlreadyCompleted) {
          await saveStepProgress(userId, stepId, initialSteps);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in fetchStepProgress:', error);
      return { data: null, error };
    }
  };

  /**
   * Saves step progress to the database
   */
  const saveStepProgress = async (userId: string, stepNumber: number, stepsData: Step[]) => {
    try {
      // First check if a progress record already exists
      const { data: existingProgress } = await supabase
        .from('motivation_steps_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('step_number', stepNumber)
        .maybeSingle();

      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('motivation_steps_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('step_number', stepNumber);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('motivation_steps_progress')
          .insert({
            user_id: userId,
            step_number: stepNumber,
            step_name: stepsData.find(s => s.id === stepNumber)?.title || '',
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
      
      return { error: null };
    } catch (error: any) {
      // If we get a duplicate key error, it means the step was already marked as completed
      // This should be handled by the check above, but just in case
      if (error.code === '23505') {
        try {
          const { error: updateError } = await supabase
            .from('motivation_steps_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('step_number', stepNumber);
          
          if (updateError) throw updateError;
          return { error: null };
        } catch (updateError) {
          console.error('Error updating step progress:', updateError);
          return { error: updateError };
        }
      } else {
        console.error('Error saving step progress:', error);
        return { error };
      }
    }
  };

  /**
   * Handles step completion and shows toast notification
   */
  const markStepComplete = async (userId: string, stepId: number, steps: Step[], onSuccess?: () => void) => {
    if (!userId) return;

    try {
      const { error } = await saveStepProgress(userId, stepId, steps);
      
      if (error) throw error;
      
      toast({
        title: "Step completed",
        description: "Your progress has been saved"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error marking step complete:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  return {
    fetchStepProgress,
    saveStepProgress,
    markStepComplete
  };
};
