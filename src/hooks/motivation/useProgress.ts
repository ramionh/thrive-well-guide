
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";

/**
 * Hook for tracking and updating progress through motivation steps
 */
export const useProgress = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Mark a step as complete and make the next step available
   */
  const markStepComplete = useCallback(async (
    stepNumber: number, 
    nextStepNumber: number, 
    stepName: string, 
    nextStepName: string
  ) => {
    if (!user) return;
    
    try {
      console.log(`Marking step ${stepNumber} (${stepName}) as completed and making next step available...`);
      setIsLoading(true);
      
      // Mark current step as completed
      const { error } = await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: stepNumber,
          step_name: stepName || `Step ${stepNumber}`,
          completed: true,
          available: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });
      
      if (error) {
        console.error("Error marking step as completed:", error);
        throw error;
      } else {
        console.log(`Successfully marked step ${stepNumber} (${stepName}) as completed`);
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
          throw nextStepError;
        } else {
          console.log(`Successfully made step ${nextStepNumber} available`);
        }
      }
      
      return true;
    } catch (err) {
      console.error("Failed to mark step complete:", err);
      toast({
        title: "Error",
        description: "Failed to update your progress",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    markStepComplete,
    isLoading
  };
};
