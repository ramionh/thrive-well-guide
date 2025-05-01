
import React, { useState } from "react";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import MotivationStepContent from "./MotivationStepContent";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";
import { motivationSteps } from "./config/motivationSteps";
import LoadingState from "./shared/LoadingState";
import ErrorBoundary from "@/components/ui/error-boundary";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  
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

  if (showSplash) {
    return <MotivationSplash onContinue={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col md:flex-row gap-6">
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
