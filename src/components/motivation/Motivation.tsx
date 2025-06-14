
import React, { useState, useEffect } from "react";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import MotivationStepContent from "./MotivationStepContent";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";
import { motivationSteps } from "./config/motivationSteps";
import LoadingState from "./shared/LoadingState";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showComponentsWhenComplete, setShowComponentsWhenComplete] = useState(false);
  
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

  // Check if user has completed any steps and whether to show splash screen
  useEffect(() => {
    const hideMotivationSplash = localStorage.getItem('hideMotivationSplash');
    const hasCompletedAnyStep = steps.some(step => step.completed);
    
    // Don't show splash if user has chosen to hide it OR if they've completed any step
    if (hideMotivationSplash === 'true' || hasCompletedAnyStep) {
      setShowSplash(false);
    }
  }, [steps]);

  // Check if final step is completed (step 94)
  const isFinalStepCompleted = steps.some(step => step.id === 94 && step.completed);
  
  // Check if ALL steps are completed
  const allStepsCompleted = steps.length > 0 && steps.every(step => step.completed);

  if (showSplash) {
    return <MotivationSplash onContinue={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  // Show congratulations view if all steps are completed
  if (allStepsCompleted) {
    return (
      <ErrorBoundary>
        <div className="flex flex-col md:flex-row gap-6">
          <MotivationStepsSidebar
            steps={steps}
            currentStepId={currentStepId}
            onStepClick={handleStepClick}
          />
          
          <div className="md:w-3/4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-lg text-green-700 mb-4">
                You've successfully completed your entire motivation journey! 
                You now have all the tools and insights needed to maintain lasting change.
              </p>
              <p className="text-green-600">
                You can continue to review any step using the navigation on the left, 
                or return to your dashboard to track your ongoing progress.
              </p>
              
              <div className="flex items-center justify-center gap-2 mt-6 p-4 bg-white rounded-md border">
                <Checkbox 
                  id="show-components"
                  checked={showComponentsWhenComplete}
                  onCheckedChange={setShowComponentsWhenComplete}
                />
                <label 
                  htmlFor="show-components" 
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Show step content when clicking navigation
                </label>
              </div>
            </div>
            
            {showComponentsWhenComplete && currentStep && (
              <MotivationStepContent currentStep={currentStep} />
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
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
