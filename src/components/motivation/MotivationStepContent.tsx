
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Step } from "./types/motivation";

interface MotivationStepContentProps {
  currentStep: Step | undefined;
}

const MotivationStepContent: React.FC<MotivationStepContentProps> = ({ currentStep }) => {
  if (!currentStep) return null;

  return (
    <div className="md:w-3/4">
      <Card className="bg-white shadow-lg border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">{currentStep.title}</h2>
          {currentStep.component}
        </CardContent>
      </Card>
    </div>
  );
};

export default MotivationStepContent;
