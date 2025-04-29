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
  const activeChangeSteps = visibleSteps.filter(step => step.id >= 62);
  
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
  
  return (
    <div className="md:w-1/4 mb-6 md:mb-0">
      <Card className="bg-white shadow-md border border-purple-100">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Your Progress</h3>
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
                      // Updated logic to include available flag
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
                        // Updated logic to include available flag
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
                Active Change
              </AccordionTrigger>
              <AccordionContent>
                {chartingPathSteps.some(step => step.completed) ? (
                  <ScrollArea className="h-[250px] pr-4">
                    <ul className="space-y-3">
                      {activeChangeSteps.map((step) => {
                        const isActive = step.id === currentStepId;
                        // Updated logic to include available flag
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
