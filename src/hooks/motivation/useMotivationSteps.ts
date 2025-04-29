
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { Step } from "@/components/motivation/types/motivation";
import { useMotivationStepsDB } from "./useMotivationStepsDB";
import { useStepNavigation } from "./useStepNavigation";

export type { Step };

export const useMotivationSteps = (initialSteps: Step[]) => {
  const { user } = useUser();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  
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
    // Only fetch data if we haven't already and user is available
    if (!user || dataFetched) return;

    const loadStepProgress = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error("Error loading step progress:", error);
      } finally {
        setIsLoading(false);
        setDataFetched(true); // Mark data as fetched to prevent endless requests
      }
    };

    loadStepProgress();
  }, [user, initialSteps, dataFetched, fetchStepProgress, findInitialStep, setCurrentStepId]);

  // Wrapper for the step click handler
  const handleStepClick = useCallback((stepId: number) => {
    baseHandleStepClick(stepId, steps);
  }, [steps, baseHandleStepClick]);

  // Wrapper for the mark step complete handler
  const markStepComplete = useCallback(async (stepId: number) => {
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
  }, [user, steps, dbMarkStepComplete, moveToNextStep]);

  return {
    steps,
    currentStepId,
    isLoading,
    handleStepClick,
    markStepComplete,
    currentStep: steps.find((step) => step.id === currentStepId)
  };
};
