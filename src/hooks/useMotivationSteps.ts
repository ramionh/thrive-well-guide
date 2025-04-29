
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
  hideFromNavigation?: boolean;
};

export const useMotivationSteps = (initialSteps: Step[]) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepId, setCurrentStepId] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchStepProgress = async () => {
      // Get steps that are marked as completed by default
      const defaultCompletedSteps = initialSteps
        .filter(step => (step as any).defaultCompleted)
        .map(step => step.id);

      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('step_number, completed')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching step progress:', error);
        return;
      }

      if (data) {
        // Update steps with completion data and default completed steps
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: data.some(p => p.step_number === step.id && p.completed) || 
                       defaultCompletedSteps.includes(step.id)
          }))
        );
        
        // Mark default completed steps in the database if they're not already marked
        for (const stepId of defaultCompletedSteps) {
          const isAlreadyCompleted = data.some(p => p.step_number === stepId && p.completed);
          if (!isAlreadyCompleted) {
            await saveStepProgress(user.id, stepId, initialSteps);
          }
        }
        
        // Find the last completed step or the first incomplete one
        if (data.length > 0) {
          const completedSteps = [
            ...data.filter(p => p.completed).map(p => p.step_number),
            ...defaultCompletedSteps
          ];
          
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
  }, [user, steps, initialSteps]);

  const handleStepClick = (stepId: number) => {
    // Modified logic to allow clicking on any completed step or the next available step
    const isCompleted = steps.find(step => step.id === stepId)?.completed;
    const highestCompletedStepId = steps
      .filter(step => step.completed)
      .reduce((max, step) => Math.max(max, step.id), 0);
    
    // Allow navigation if:
    // 1. The step has been completed, OR
    // 2. It's the next step after the highest completed step
    if (isCompleted || stepId === highestCompletedStepId + 1) {
      setCurrentStepId(stepId);
    }
  };

  const markStepComplete = async (stepId: number) => {
    if (!user) return;

    try {
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
    } catch (error: any) {
      // If we get a duplicate key error, it means the step was already marked as completed
      // In this case, we should just update the completed status
      if (error.code === '23505') {
        try {
          const { error: updateError } = await supabase
            .from('motivation_steps_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('step_number', stepId);
          
          if (updateError) throw updateError;
          
          // Still update the local state and move to next step
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
        } catch (updateError) {
          console.error('Error updating step progress:', updateError);
          toast({
            title: "Error",
            description: "Failed to save progress",
            variant: "destructive"
          });
        }
      } else {
        console.error('Error saving step progress:', error);
        toast({
          title: "Error",
          description: "Failed to save progress",
          variant: "destructive"
        });
      }
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
