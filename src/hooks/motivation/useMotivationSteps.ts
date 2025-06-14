
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

  // Check if charting path section is complete
  const isChartingPathComplete = (progressData: any[]) => {
    // Charting path steps are from 18 to 65
    const chartingPathSteps = Array.from({length: 48}, (_, i) => i + 18); // 18-65
    const completedChartingSteps = progressData.filter(p => 
      chartingPathSteps.includes(p.step_number) && p.completed
    );
    
    // Consider charting path complete if at least 80% of steps are done
    return completedChartingSteps.length >= Math.floor(chartingPathSteps.length * 0.8);
  };

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

          // Check if charting path is complete
          const chartingComplete = isChartingPathComplete(data);

          // Update steps with completion data, available flags, and default completed steps
          setSteps(prevSteps => 
            prevSteps.map(step => {
              const isCompleted = data.some(p => p.step_number === step.id && p.completed) || 
                                defaultCompletedSteps.includes(step.id);
              const isAvailable = data.some(p => p.step_number === step.id && p.available === true);
              
              // Lock Active Change steps (66+) if charting path isn't complete
              const isActiveChangeStep = step.id >= 66;
              const shouldBeLocked = isActiveChangeStep && !chartingComplete && !isCompleted;
              
              return {
                ...step,
                completed: isCompleted,
                available: shouldBeLocked ? false : isAvailable
              };
            })
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
    if (!user || !stepId || typeof stepId !== 'number') {
      console.error('Invalid parameters for markStepComplete:', { userId: user?.id, stepId });
      return;
    }

    console.log('useMotivationSteps.markStepComplete called with:', stepId);
    
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
