
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Ambivalence from "./Ambivalence";
import FocusedHabitsSelector from "./FocusedHabitsSelector";

type Step = {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  completed: boolean;
};

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStepId, setCurrentStepId] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Ambivalence",
      description: "Understanding mixed feelings about change",
      component: <Ambivalence onComplete={() => markStepComplete(1)} />,
      completed: false,
    },
    {
      id: 2,
      title: "Focus Habits",
      description: "Select your key transformation habits",
      component: <FocusedHabitsSelector />,
      completed: false,
    },
    // Additional steps will be added here in the future
  ]);

  const currentStep = steps.find((step) => step.id === currentStepId);

  const handleStepClick = (stepId: number) => {
    // Only allow navigation to completed steps or the current step +1
    const maxAllowedStep = steps.filter((s) => s.completed).reduce(
      (max, step) => Math.max(max, step.id + 1),
      1
    );
    
    if (stepId <= maxAllowedStep) {
      setCurrentStepId(stepId);
    }
  };

  const markStepComplete = (stepId: number) => {
    // Update the completed status of the step
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { ...step, completed: true } 
          : step
      )
    );
    
    // Move to the next step if available
    const nextStepId = stepId + 1;
    if (steps.some(step => step.id === nextStepId)) {
      setCurrentStepId(nextStepId);
    }
  };

  // Simulate completion of step 1 if coming from another page directly to step 2
  useEffect(() => {
    if (currentStepId === 2 && !steps[0].completed) {
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === 1 
            ? { ...step, completed: true } 
            : step
        )
      );
    }
  }, [currentStepId, steps]);

  if (showSplash) {
    return (
      <Card className="bg-white shadow-lg border-2 border-purple-300">
        <CardContent className="p-6 md:p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Understanding Motivation</h2>
            <p className="mb-4">
              Motivation is complex. Making a change requires you to be willing, able, and
              ready. Feeling willing is the first step. Recognizing that something should
              change shows a willingness and openness to doing things differently. Next is
              confidence in your ability to make a change. Change is hard, and you have to
              feel up to the task. Being ready requires a sense of urgency and a desire to
              prioritize. This is generally the last piece to fall into place. We often say
              someone "just isn't ready." It doesn't mean they have no motivation or are in
              denial. It just may not be important enough yet.
            </p>
            
            <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">What, Why and Then How?</h3>
            <p className="mb-4">
              Our process isn't about coercing, convincing, or bribing you to
              change. It's about strengthening your own desires, abilities, reasons, and need
              for change. Our process helps you figure out
              what your health and fitness goals are, why you want to make the change, and, finally,
              how to make that change.
            </p>
            
            <p className="mb-4">
              Notice the how part comes last? Too often, we work on how first, rushing
              to fix a problem before we've even committed to the goal of solving it. But
              fully understanding your fitness goals and why you want to pursue it before taking
              any action will make you more likely to achieve it
            </p>
            
            <p className="mb-4">
              Trying to figure out how you're going to achieve a goal before
              you've fully committed to it often leads to a plan you won't stick with, steps
              that don't work the way you want them to, and general frustration and
              confusion. That's why it's so important to strengthen your desires, abilities,
              reasons, and needs for change before you begin pursuing a plan.
            </p>
            
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6"
                onClick={() => setShowSplash(false)}
              >
                Begin Your Motivation Journey
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Steps sidebar */}
      <div className="md:w-1/4 mb-6 md:mb-0">
        <Card className="bg-white shadow-md border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <ul className="space-y-3">
              {steps.map((step) => {
                const isActive = step.id === currentStepId;
                const isDisabled = step.id > currentStepId && !steps[step.id - 2]?.completed;
                
                return (
                  <li key={step.id}>
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={isDisabled}
                      className={`flex items-center p-3 w-full rounded-lg transition-colors text-left
                        ${isActive ? 'bg-purple-100 text-purple-800 font-medium' : ''}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                      `}
                    >
                      <div className="mr-3 flex-shrink-0">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs
                            ${isActive ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700'}
                          `}>
                            {step.id}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-gray-500">{step.description}</div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="md:w-3/4">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">{currentStep?.title}</h2>
            {/* Render the current step component */}
            {currentStep?.component}
            
            {/* Add a "Complete" button for the Ambivalence step */}
            {currentStepId === 1 && (
              <div className="mt-6">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => markStepComplete(1)}
                >
                  Complete This Step
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Motivation;
