
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
        .select('step_number, completed, available')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching step progress:', error);
        return { data: null, error };
      }

      // Mark default completed steps in the database if they're not already marked
      if (data) {
        for (const stepId of defaultCompletedSteps) {
          const isAlreadyCompleted = data.some(p => p.step_number === stepId && p.completed);
          if (!isAlreadyCompleted) {
            await saveStepProgress(userId, stepId, initialSteps);
          }
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
      if (!stepNumber || typeof stepNumber !== 'number') {
        console.error('Invalid step number:', stepNumber);
        return { error: new Error('Invalid step number') };
      }

      console.log('Saving step progress:', {
        userId,
        stepNumber,
        stepName: stepsData.find(s => s.id === stepNumber)?.title || ''
      });

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
      
      // Automatically make the next step available when completing a step
      const nextStepNumber = stepNumber + 1;
      const nextStep = stepsData.find(s => s.id === nextStepNumber);
      
      if (nextStep) {
        const { error: nextStepError } = await supabase
          .from('motivation_steps_progress')
          .upsert(
            {
              user_id: userId,
              step_number: nextStepNumber,
              step_name: nextStep.title || '',
              completed: false,
              available: true, // Mark the next step as available
              completed_at: null
            },
            { onConflict: "user_id,step_number" }
          );
          
        if (nextStepError) {
          console.error('Error making next step available:', nextStepError);
        }
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
    if (!userId || !stepId || typeof stepId !== 'number') {
      console.error('Invalid parameters for markStepComplete:', { userId, stepId });
      return;
    }

    try {
      console.log('Marking step complete:', {
        userId,
        stepId,
        stepName: steps.find(s => s.id === stepId)?.title || ''
      });
      
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
