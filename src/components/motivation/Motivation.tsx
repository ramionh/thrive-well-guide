
import React, { useState } from "react";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import MotivationStepContent from "./MotivationStepContent";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";
import { motivationSteps } from "./config/motivationSteps";
import LoadingState from "./shared/LoadingState";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  const { steps, currentStepId, currentStep, handleStepClick, markStepComplete, isLoading } = useMotivationSteps(
    motivationSteps.map(step => ({
      ...step,
      // Pass the onComplete callback to each component
      component: step.component(() => markStepComplete(step.id)),
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
    <div className="flex flex-col md:flex-row gap-6">
      <MotivationStepsSidebar
        steps={steps}
        currentStepId={currentStepId}
        onStepClick={handleStepClick}
      />
      <MotivationStepContent currentStep={currentStep} />
    </div>
  );
};

export default Motivation;
