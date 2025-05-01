
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

/**
 * This hook provides a function to check and fix completion status for specific motivation steps
 * that have issues with completion tracking.
 */
export const useFixMotivationSteps = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isFixing, setIsFixing] = useState(false);

  /**
   * Checks if a user has data for a specific step in the corresponding table
   * and ensures the step is marked as completed in the progress tracking table
   */
  const fixStepCompletion = async (stepId: number, tableName: string) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to fix your progress",
        variant: "destructive"
      });
      return;
    }

    setIsFixing(true);
    
    try {
      console.log(`Checking completion status for step ${stepId} in table ${tableName}`);
      
      // First check if the user has data in the specified table
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      // If user has data in the table, mark the step as completed
      if (data && data.length > 0) {
        console.log(`Found data for step ${stepId}, marking as completed`);
        
        // Update the step progress
        const { error: updateError } = await supabase
          .from('motivation_steps_progress')
          .upsert({
            user_id: user.id,
            step_number: stepId,
            step_name: getStepNameById(stepId),
            completed: true,
            completed_at: new Date().toISOString(),
            available: true
          }, {
            onConflict: 'user_id,step_number'
          });
          
        if (updateError) throw updateError;
        
        toast({
          title: "Success",
          description: `Fixed completion status for ${getStepNameById(stepId)}`
        });
      } else {
        console.log(`No data found for step ${stepId}, skipping`);
      }
    } catch (error) {
      console.error(`Error fixing step ${stepId}:`, error);
      toast({
        title: "Error",
        description: `Failed to fix step completion status`,
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };

  /**
   * Fixes all known problematic steps
   */
  const fixAllProblematicSteps = async () => {
    if (!user) return;
    
    setIsFixing(true);
    
    try {
      // List of problematic steps and their corresponding tables
      const problematicSteps = [
        { stepId: 12, tableName: 'motivation_defining_importance' },
        { stepId: 23, tableName: 'motivation_step_toward_change' },
        { stepId: 14, tableName: 'motivation_values_conflict' },
        { stepId: 38, tableName: 'motivation_stress_types' },
        { stepId: 46, tableName: 'motivation_coping_mechanisms' }
      ];
      
      for (const step of problematicSteps) {
        await fixStepCompletion(step.stepId, step.tableName);
      }
      
      toast({
        title: "Success",
        description: "Fixed all problematic step completion statuses"
      });
    } catch (error) {
      console.error("Error fixing problematic steps:", error);
      toast({
        title: "Error",
        description: "Failed to fix some step completion statuses",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };

  /**
   * Helper function to get step name by ID
   */
  const getStepNameById = (stepId: number): string => {
    const stepNames: Record<number, string> = {
      12: "Defining Importance",
      23: "Taking Another Step Toward Change",
      14: "Values Conflict",
      38: "Identifying Your Type of Stress",
      46: "Coping Mechanisms"
    };
    
    return stepNames[stepId] || `Step ${stepId}`;
  };

  return {
    fixStepCompletion,
    fixAllProblematicSteps,
    isFixing
  };
};
