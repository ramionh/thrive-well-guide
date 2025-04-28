
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export type Step = {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  completed: boolean;
};

export const useMotivationSteps = (initialSteps: Step[]) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepId, setCurrentStepId] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchStepProgress = async () => {
      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('step_number, completed')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching step progress:', error);
        return;
      }

      if (data) {
        // Update steps with completion data
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: data.some(p => p.step_number === step.id && p.completed)
          }))
        );
        
        // Find the last completed step or the first incomplete one
        if (data.length > 0) {
          const completedSteps = data.filter(p => p.completed).map(p => p.step_number);
          
          // If Build on Your Strengths (42) is completed, check if we need to skip to Identifying Your Type of Stress (44)
          if (completedSteps.includes(42)) {
            const stressTypeStepCompleted = completedSteps.includes(44);
            if (!stressTypeStepCompleted) {
              setCurrentStepId(44);  // Set to Identifying Your Type of Stress
              return;
            }
          }
          
          // Normal progression logic - set to last completed + 1 or first step
          if (completedSteps.length > 0) {
            const maxCompletedStep = Math.max(...completedSteps);
            const nextStepId = maxCompletedStep + 1;
            if (steps.some(s => s.id === nextStepId)) {
              setCurrentStepId(nextStepId);
            } else {
              // If next step doesn't exist, stay at the highest completed step
              setCurrentStepId(maxCompletedStep);
            }
          } else {
            setCurrentStepId(1);  // Start at the beginning
          }
        }
      }
    };

    fetchStepProgress();
  }, [user, steps]);

  const handleStepClick = (stepId: number) => {
    const maxAllowedStep = steps.filter((s) => s.completed).reduce(
      (max, step) => Math.max(max, step.id + 1),
      1
    );
    
    if (stepId <= maxAllowedStep) {
      setCurrentStepId(stepId);
    }
  };

  const markStepComplete = async (stepId: number) => {
    if (!user) return;

    try {
      // Special handling for Build on Your Strengths (step 42)
      if (stepId === 42) {
        // First mark step 42 as complete
        await saveStepProgress(user.id, stepId, steps);
        
        // Then mark step 43 (Managing Stress) as complete as we're skipping it
        await saveStepProgress(user.id, 43, steps);
        
        // Set the current step to 44 (Identifying Your Type of Stress)
        setCurrentStepId(44);
        
        toast({
          title: "Step completed",
          description: "Your progress has been saved"
        });
        
        return;
      }
      
      // Normal completion handling for other steps
      await saveStepProgress(user.id, stepId, steps);
      
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId 
            ? { ...step, completed: true } 
            : step
        )
      );
      
      const nextStepId = stepId + 1;
      if (steps.some(step => step.id === nextStepId)) {
        setCurrentStepId(nextStepId);
      }

      toast({
        title: "Step completed",
        description: "Your progress has been saved"
      });
    } catch (error) {
      console.error('Error saving step progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };
  
  // Helper function to save step progress to the database
  const saveStepProgress = async (userId: string, stepNumber: number, stepsData: Step[]) => {
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
  };

  return {
    steps,
    currentStepId,
    handleStepClick,
    markStepComplete,
    currentStep: steps.find((step) => step.id === currentStepId)
  };
};
