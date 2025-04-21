
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Ambivalence from "./Ambivalence";
import FocusedHabitsSelector from "./FocusedHabitsSelector";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  const { steps, currentStepId, currentStep, handleStepClick, markStepComplete } = useMotivationSteps([
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
  ]);

  if (showSplash) {
    return <MotivationSplash onContinue={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <MotivationStepsSidebar
        steps={steps}
        currentStepId={currentStepId}
        onStepClick={handleStepClick}
      />
      
      <div className="md:w-3/4">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">{currentStep?.title}</h2>
            {currentStep?.component}
            
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
