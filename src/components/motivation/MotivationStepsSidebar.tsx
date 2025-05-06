
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type { Step } from "@/hooks/useMotivationSteps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Filter out steps with hideFromNavigation flag
  const visibleSteps = steps.filter(step => !step.hideFromNavigation);
  
  // Define step ranges for each section based on visible steps
  const startingPointSteps = visibleSteps.filter(step => step.id < 18);
  const chartingPathSteps = visibleSteps.filter(step => step.id >= 18 && step.id < 62);
  const activeChangeSteps = visibleSteps.filter(step => step.id >= 62 && step.id <= 91);
  
  // Find the highest completed step ID to determine navigation permissions
  const highestCompletedStepId = steps
    .filter(step => step.completed)
    .reduce((max, step) => Math.max(max, step.id), 0);
  
  // Helper function to check if a step should be enabled
  const isStepEnabled = (step: Step) => {
    return (
      step.completed || // Step is completed
      step.id === highestCompletedStepId + 1 || // Next step after highest completed
      step.available === true // Step is marked as explicitly available
    );
  };
  
  // Check if the final step (91) is completed
  const isFinalStepCompleted = steps.some(step => step.id === 91 && step.completed);

  // Make sure activeChangeSteps are sorted by ID
  const sortedActiveChangeSteps = [...activeChangeSteps].sort((a, b) => a.id - b.id);

  // Define the expected steps that should appear after "Rewards From People Who Matter" (ID 69)
  const expectedStepsAfterRewards = [
    { id: 70, title: "Dealing With Setbacks: Stress Check" },
    { id: 71, title: "Dealing With Setbacks: Self-Care" },
    { id: 72, title: "Dealing With Setbacks: Recommit" },
    { id: 73, title: "Taking Another Step Toward Change" },
    { id: 74, title: "Be Consistent" },
    { id: 75, title: "Get Organized" },
    { id: 76, title: "Seek Positive Information" },
    { id: 77, title: "Small Steps" },
    { id: 78, title: "Setting Ceiling & Floor" },
    { id: 79, title: "Thinking Assertively" },
    { id: 80, title: "Helpful Ideas" },
    { id: 81, title: "Exceptions to Rule" },
    { id: 82, title: "Monitoring Your Progress" },
    { id: 83, title: "Affirmations" },
    { id: 84, title: "Revisit Values" },
    { id: 85, title: "Assessing Importance: Steps Forward" },
    { id: 86, title: "Identifying Steps to Goal" },
    { id: 87, title: "Change Your Plan" },
    { id: 88, title: "Prioritizing Change" },
    { id: 89, title: "Making Your Goal Measurable" },
    { id: 90, title: "Focused Habits Selector" },
    { id: 91, title: "A Final Word: Your Fitness Journey Begins Now!" }
  ];
  
  // Check if we're missing any expected steps
  const missingStepIds = expectedStepsAfterRewards
    .filter(expected => !sortedActiveChangeSteps.some(step => step.id === expected.id))
    .map(step => step.id);
  
  if (missingStepIds.length > 0) {
    console.log("Missing steps in sidebar:", missingStepIds);
  }
  
  return (
    <div className="md:w-1/4 mb-6 md:mb-0">
      <Card className="bg-white shadow-md border border-purple-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">
            {isFinalStepCompleted ? (
              <span className="flex items-center">
                Your Progress <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
              </span>
            ) : (
              "Your Progress"
            )}
          </h3>
          <Accordion type="single" collapsible defaultValue="active-change">
            <AccordionItem value="starting-point">
              <AccordionTrigger className="text-left text-purple-700 hover:text-purple-900">
                Starting Point
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-[250px] pr-4">
                  <ul className="space-y-3">
                    {startingPointSteps.map((step) => {
                      const isActive = step.id === currentStepId;
                      const isDisabled = !isStepEnabled(step);
                      
                      return (
                        <li key={step.id}>
                          <button
                            onClick={() => onStepClick(step.id)}
                            disabled={isDisabled}
                            className={`flex items-center p-3 w-full rounded-lg transition-colors text-left
                              ${isActive ? 'bg-purple-100 text-purple-800 font-medium' : ''}
                              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}
                            `}
                          >
                            <div className="mr-3 flex-shrink-0">
                              {step.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs
                                  ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
                                `}>
                                  {step.id}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-purple-900">{step.title}</div>
                              <div className="text-sm text-purple-600">{step.description}</div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="charting-path">
              <AccordionTrigger className="text-left text-purple-700 hover:text-purple-900">
                Charting Your Path
              </AccordionTrigger>
              <AccordionContent>
                {startingPointSteps.some(step => step.completed) ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <ul className="space-y-3">
                      {chartingPathSteps.map((step) => {
                        const isActive = step.id === currentStepId;
                        const isDisabled = !isStepEnabled(step);
                        
                        return (
                          <li key={step.id}>
                            <button
                              onClick={() => onStepClick(step.id)}
                              disabled={isDisabled}
                              className={`flex items-center p-3 w-full rounded-lg transition-colors text-left
                                ${isActive ? 'bg-purple-100 text-purple-800 font-medium' : ''}
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}
                              `}
                            >
                              <div className="mr-3 flex-shrink-0">
                                {step.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs
                                    ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
                                  `}>
                                    {step.id}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-purple-900">{step.title}</div>
                                <div className="text-sm text-purple-600">{step.description}</div>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-purple-600 italic text-sm p-4">
                    Complete the starting point steps to unlock this section
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="active-change">
              <AccordionTrigger className="text-left text-purple-700 hover:text-purple-900">
                Active Change {isFinalStepCompleted && <CheckCircle className="ml-1 h-4 w-4 text-green-500 inline" />}
              </AccordionTrigger>
              <AccordionContent>
                {chartingPathSteps.some(step => step.completed) ? (
                  <ScrollArea className="h-[350px] pr-4">
                    <ul className="space-y-3">
                      {sortedActiveChangeSteps.length > 0 ? (
                        sortedActiveChangeSteps.map((step) => {
                          const isActive = step.id === currentStepId;
                          const isDisabled = !isStepEnabled(step);
                          const isFinalStep = step.id === 91;
                          
                          return (
                            <li key={step.id}>
                              <button
                                onClick={() => onStepClick(step.id)}
                                disabled={isDisabled}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors text-left
                                  ${isActive ? 'bg-purple-100 text-purple-800 font-medium' : ''}
                                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}
                                  ${isFinalStep && step.completed ? 'border-2 border-green-300' : ''}
                                `}
                              >
                                <div className="mr-3 flex-shrink-0">
                                  {step.completed ? (
                                    <CheckCircle className={`h-5 w-5 ${isFinalStep ? 'text-green-600' : 'text-green-500'}`} />
                                  ) : (
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs
                                      ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
                                      ${isFinalStep ? 'ring-2 ring-purple-300' : ''}
                                    `}>
                                      {step.id}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className={`font-medium ${isFinalStep ? 'text-purple-900' : 'text-purple-900'}`}>
                                    {step.title}
                                  </div>
                                  <div className="text-sm text-purple-600">{step.description}</div>
                                </div>
                              </button>
                            </li>
                          );
                        })
                      ) : (
                        // If our sortedActiveChangeSteps is empty for some reason, fallback to expected steps
                        expectedStepsAfterRewards.map((expectedStep) => {
                          const matchingStep = steps.find(s => s.id === expectedStep.id);
                          const isActive = expectedStep.id === currentStepId;
                          const isCompleted = matchingStep?.completed || false;
                          const isDisabled = !isStepEnabled(matchingStep || {
                            id: expectedStep.id,
                            title: expectedStep.title,
                            description: "",
                            component: null,
                            completed: false
                          });
                          const isFinalStep = expectedStep.id === 91;
                          
                          return (
                            <li key={expectedStep.id}>
                              <button
                                onClick={() => onStepClick(expectedStep.id)}
                                disabled={isDisabled}
                                className={`flex items-center p-3 w-full rounded-lg transition-colors text-left
                                  ${isActive ? 'bg-purple-100 text-purple-800 font-medium' : ''}
                                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'}
                                  ${isFinalStep && isCompleted ? 'border-2 border-green-300' : ''}
                                `}
                              >
                                <div className="mr-3 flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle className={`h-5 w-5 ${isFinalStep ? 'text-green-600' : 'text-green-500'}`} />
                                  ) : (
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs
                                      ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'}
                                      ${isFinalStep ? 'ring-2 ring-purple-300' : ''}
                                    `}>
                                      {expectedStep.id}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className={`font-medium ${isFinalStep ? 'text-purple-900' : 'text-purple-900'}`}>
                                    {expectedStep.title}
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-purple-600 italic text-sm p-4">
                    Complete the previous sections to unlock this section
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationStepsSidebar;
