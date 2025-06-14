
import React, { useState, useEffect } from "react";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import MotivationStepContent from "./MotivationStepContent";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";
import { motivationSteps } from "./config/motivationSteps";
import LoadingState from "./shared/LoadingState";
import ErrorBoundary from "@/components/ui/error-boundary";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if user has chosen to hide the splash screen
  useEffect(() => {
    const hideMotivationSplash = localStorage.getItem('hideMotivationSplash');
    if (hideMotivationSplash === 'true') {
      setShowSplash(false);
    }
  }, []);
  
  const { 
    steps, 
    currentStepId, 
    currentStep, 
    handleStepClick, 
    markStepComplete, 
    isLoading 
  } = useMotivationSteps(
    motivationSteps.map(step => ({
      ...step,
      // Make sure the component has access to the markStepComplete function
      component: step.component((stepId?: number) => {
        // Allow either marking the current step or a specific step complete
        const idToMark = stepId || step.id;
        console.log(`Motivation: Marking step ${idToMark} complete`);
        // Ensure we're passing a number, not an object
        markStepComplete(typeof idToMark === 'number' ? idToMark : step.id);
      }),
      completed: false
    }))
  );

  // Check if final step is completed (step 94)
  const isFinalStepCompleted = steps.some(step => step.id === 94 && step.completed);

  if (showSplash) {
    return <MotivationSplash onContinue={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row gap-6">
        {isFinalStepCompleted && currentStepId === 94 && (
          <div className="w-full mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <h2 className="text-xl font-bold text-green-800">Congratulations!</h2>
            <p className="text-green-700">
              You've completed your motivation journey! You can now continue to apply what you've learned.
            </p>
          </div>
        )}
        
        <MotivationStepsSidebar
          steps={steps}
          currentStepId={currentStepId}
          onStepClick={handleStepClick}
        />
        <MotivationStepContent currentStep={currentStep} />
      </div>
    </ErrorBoundary>
  );
};

export default Motivation;
