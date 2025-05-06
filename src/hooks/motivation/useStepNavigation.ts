
import { useState, useCallback } from "react";
import { Step } from "@/components/motivation/types/motivation";

export const useStepNavigation = (initialSteps: Step[]) => {
  const [currentStepId, setCurrentStepId] = useState(1);
  
  /**
   * Handles clicking on a step in the navigation
   */
  const handleStepClick = useCallback((stepId: number, steps: Step[]) => {
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
    
    // Check if the final step (91) is completed
    const isFinalStepCompleted = progressData.some(p => p.step_number === 91 && p.completed);
    
    // If final step is completed, set to that step
    if (isFinalStepCompleted) {
      return 91;
    }
    
    // Normal progression logic - set to last completed + 1 or first step
    if (completedSteps.length > 0) {
      const maxCompletedStep = Math.max(...completedSteps);
      const nextStepId = maxCompletedStep + 1;
      
      // Check if next step is explicitly marked as available
      const availableSteps = progressData
        .filter(p => p.available === true && !p.completed)
        .map(p => p.step_number);
      
      if (availableSteps.length > 0) {
        // If there are available steps, use the lowest one
        const lowestAvailableStep = Math.min(...availableSteps);
        if (lowestAvailableStep < nextStepId) {
          return lowestAvailableStep;
        }
      }
      
      if (steps.some(s => s.id === nextStepId)) {
        return nextStepId;
      } else {
        // If next step doesn't exist, stay at the highest completed step
        return maxCompletedStep;
      }
    } else {
      return 1;  // Start at the beginning
    }
  }, []);

  /**
   * Moves to the next step if available
   */
  const moveToNextStep = useCallback((currentId: number, steps: Step[]) => {
    // Check if current step is the final step (91)
    if (currentId === 91) {
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
