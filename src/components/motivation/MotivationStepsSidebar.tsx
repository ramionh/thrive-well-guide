
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type { Step } from "@/hooks/useMotivationSteps";

interface MotivationStepsSidebarProps {
  steps: Step[];
  currentStepId: number;
  onStepClick: (stepId: number) => void;
}

const MotivationStepsSidebar: React.FC<MotivationStepsSidebarProps> = ({
  steps,
  currentStepId,
  onStepClick,
}) => {
  return (
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
                    onClick={() => onStepClick(step.id)}
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
  );
};

export default MotivationStepsSidebar;
