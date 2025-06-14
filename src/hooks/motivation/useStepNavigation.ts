
import { useState, useCallback } from "react";
import { Step } from "@/components/motivation/types/motivation";

export const useStepNavigation = (initialSteps: Step[]) => {
  const [currentStepId, setCurrentStepId] = useState(1);
  
  /**
   * Handles clicking on a step in the navigation
   */
  const handleStepClick = useCallback((stepId: number, steps: Step[]) => {
    // Special case for step 1 - always allow clicking on it
    if (stepId === 1) {
      setCurrentStepId(stepId);
      return;
    }
    
    // Modified logic to allow clicking on any completed step or the next available step
    const isCompleted = steps.find(step => step.id === stepId)?.completed;
    const highestCompletedStepId = steps
      .filter(step => step.completed)
      .reduce((max, step) => Math.max(max, step.id), 0);
    
    // Also check for steps explicitly marked as available in progress data
    const isAvailable = steps.find(step => step.id === stepId)?.available;
    
    // Allow navigation if:
    // 1. The step has been completed, OR
    // 2. It's the next step after the highest completed step, OR
    // 3. It's explicitly marked as available
    if (isCompleted || stepId === highestCompletedStepId + 1 || isAvailable) {
      setCurrentStepId(stepId);
    }
  }, []);
  
  /**
   * Finds the appropriate step to display based on completion status
   */
  const findInitialStep = useCallback((steps: Step[], progressData: any[] | null) => {
    if (!progressData || progressData.length === 0) return 1;
    
    // Get default completed steps
    const defaultCompletedSteps = steps
      .filter(step => (step as any).defaultCompleted)
      .map(step => step.id);
    
    // Find completed steps from progress data and default completed steps
    const completedSteps = [
      ...progressData.filter(p => p.completed).map(p => p.step_number),
      ...defaultCompletedSteps
    ];
    
    // Check if the final step (94) is completed
    const isFinalStepCompleted = progressData.some(p => p.step_number === 94 && p.completed);
    
    // If final step is completed, set to that step
    if (isFinalStepCompleted) {
      return 94;
    }
    
    // Find the first incomplete step after the last completed step
    if (completedSteps.length > 0) {
      const maxCompletedStep = Math.max(...completedSteps);
      
      // Find the next incomplete step
      const nextIncompleteStep = steps.find(step => 
        step.id > maxCompletedStep && !completedSteps.includes(step.id)
      );
      
      if (nextIncompleteStep) {
        return nextIncompleteStep.id;
      } else {
        // If no incomplete step found after max completed, stay at max completed
        return maxCompletedStep;
      }
    } else {
      return 1;  // Start at the beginning if no steps completed
    }
  }, []);

  /**
   * Moves to the next step if available
   */
  const moveToNextStep = useCallback((currentId: number, steps: Step[]) => {
    // Check if current step is the final step (94)
    if (currentId === 94) {
      // No next step after final step, stay on the same step
      return false;
    }
    
    // Handle special jumps defined in step configuration
    const currentStepConfig = steps.find(step => step.id === currentId) as any;
    if (currentStepConfig && currentStepConfig.nextStepNumber) {
      setCurrentStepId(currentStepConfig.nextStepNumber);
      return true;
    }
    
    const nextStepId = currentId + 1;
    if (steps.some(step => step.id === nextStepId)) {
      setCurrentStepId(nextStepId);
      return true;
    }
    return false;
  }, []);

  return {
    currentStepId,
    setCurrentStepId,
    handleStepClick,
    findInitialStep,
    moveToNextStep
  };
};
