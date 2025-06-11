
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HabitScoring from "./HabitScoring";

interface CoreOptimalHabitAssessmentProps {
  onBackToOptions: () => void;
}

const CoreOptimalHabitAssessment = ({ onBackToOptions }: CoreOptimalHabitAssessmentProps) => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={onBackToOptions}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journey Options
        </Button>
      </div>

      <HabitScoring onSaveComplete={onBackToOptions} />
    </div>
  );
};

export default CoreOptimalHabitAssessment;
