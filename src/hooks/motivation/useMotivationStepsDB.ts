
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

      console.log('Fetched step progress:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in fetchStepProgress:', error);
      return { data: null, error };
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

      // Always use upsert with explicit onConflict to handle duplicate key errors
      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: userId,
            step_number: stepNumber,
            step_name: stepsData.find(s => s.id === stepNumber)?.title || '',
            completed: true,
            completed_at: new Date().toISOString(),
            available: true // Mark step as available when completed
          },
          { onConflict: 'user_id,step_number' }
        );

      if (error) {
        console.error('Error in saveStepProgress upsert:', error);
        return { error };
      }
      
      // Look for the next step number in the configuration
      const currentStepConfig = stepsData.find(s => s.id === stepNumber);
      
      // First check if there's an explicitly defined next step in the step config
      const nextStepNumber = currentStepConfig && (currentStepConfig as any).nextStepNumber 
        ? (currentStepConfig as any).nextStepNumber 
        : stepNumber + 1;
      
      console.log('Making next step available:', nextStepNumber);
      
      // Make the next step available when completing a step
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
        } else {
          console.log(`Successfully made step ${nextStepNumber} (${nextStep.title}) available`);
        }
      }
      
      // Special handling: Make step 91 (Final Word) available after completing step 69 (Rewards from People Who Matter)
      if (stepNumber === 69) {
        const finalStep = stepsData.find(s => s.id === 91);
        if (finalStep) {
          console.log('Completed Rewards from People Who Matter, making Final Word step (91) available');
          const { error: finalStepError } = await supabase
            .from('motivation_steps_progress')
            .upsert(
              {
                user_id: userId,
                step_number: 91,
                step_name: finalStep.title || 'A Final Word: Your Fitness Journey Begins Now!',
                completed: false,
                available: true,
                completed_at: null
              },
              { onConflict: "user_id,step_number" }
            );
          
          if (finalStepError) {
            console.error('Error making Final Word step available:', finalStepError);
          } else {
            console.log('Successfully made Final Word step available');
          }
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error saving step progress:', error);
      return { error };
    }
  };

  return {
    fetchStepProgress,
    saveStepProgress,
    markStepComplete
  };
};
