
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
      
      // Also make the "People Who Matter" step (ID=69) available after completing "Rewards Create an Incentive" (ID=67)
      if (stepNumber === 67) {
        console.log('Completed Rewards Create an Incentive, making Rewards from People Who Matter (69) available');
        const peopleWhoMatterStep = stepsData.find(s => s.id === 69);
        
        if (peopleWhoMatterStep) {
          const { error: peopleStepError } = await supabase
            .from('motivation_steps_progress')
            .upsert(
              {
                user_id: userId,
                step_number: 69,
                step_name: peopleWhoMatterStep.title || 'Rewards from People Who Matter',
                completed: false,
                available: true, // Explicitly mark this step as available
                completed_at: null
              },
              { onConflict: "user_id,step_number" }
            );
            
          if (peopleStepError) {
            console.error('Error making Rewards from People Who Matter step available:', peopleStepError);
          } else {
            console.log('Successfully made Rewards from People Who Matter step available');
          }
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error saving step progress:', error);
      return { error };
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
