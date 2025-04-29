
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Step } from "@/components/motivation/types/motivation";
import { useMotivationStepsDB } from "./useMotivationStepsDB";
import { useStepNavigation } from "./useStepNavigation";

export type { Step };

export const useMotivationSteps = (initialSteps: Step[]) => {
  const { user } = useUser();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  
  const { 
    fetchStepProgress, 
    markStepComplete: dbMarkStepComplete 
  } = useMotivationStepsDB();
  
  const { 
    currentStepId, 
    setCurrentStepId, 
    handleStepClick: baseHandleStepClick,
    findInitialStep,
    moveToNextStep
  } = useStepNavigation(initialSteps);

  // Fetch step progress from the database when component mounts
  useEffect(() => {
    if (!user) return;

    const loadStepProgress = async () => {
      const { data } = await fetchStepProgress(user.id, initialSteps);
      
      if (data) {
        // Get default completed steps
        const defaultCompletedSteps = initialSteps
          .filter(step => (step as any).defaultCompleted)
          .map(step => step.id);

        // Update steps with completion data and default completed steps
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: data.some(p => p.step_number === step.id && p.completed) || 
                      defaultCompletedSteps.includes(step.id)
          }))
        );

        // Set the current step ID based on progress data
        const initialStepId = findInitialStep(initialSteps, data);
        setCurrentStepId(initialStepId);
      }
    };

    loadStepProgress();
  }, [user, initialSteps]);

  // Wrapper for the step click handler
  const handleStepClick = (stepId: number) => {
    baseHandleStepClick(stepId, steps);
  };

  // Wrapper for the mark step complete handler
  const markStepComplete = async (stepId: number) => {
    if (!user) return;

    await dbMarkStepComplete(
      user.id, 
      stepId, 
      steps, 
      // On success callback
      () => {
        // Update the local steps state
        setSteps(prevSteps => 
          prevSteps.map(step => 
            step.id === stepId 
              ? { ...step, completed: true } 
              : step
          )
        );
        
        // Move to the next step if available
        moveToNextStep(stepId, steps);
      }
    );
  };

  return {
    steps,
    currentStepId,
    handleStepClick,
    markStepComplete,
    currentStep: steps.find((step) => step.id === currentStepId)
  };
};
