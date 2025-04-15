
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ProgressTabLayout from "./ProgressTabLayout";

interface ExerciseTabProps {
  exerciseMinutes: string;
  setExerciseMinutes: (value: string) => void;
  steps: string;
  setSteps: (value: string) => void;
  exerciseAdherence: "red" | "yellow" | "green";
  setExerciseAdherence: (value: "red" | "yellow" | "green") => void;
}

const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exerciseMinutes,
  setExerciseMinutes,
  steps,
  setSteps,
  exerciseAdherence,
  setExerciseAdherence,
}) => {
  return (
    <ProgressTabLayout
      title="Exercise Tracking"
      description="Track your physical activity"
      adherenceValue={exerciseAdherence}
      onAdherenceChange={setExerciseAdherence}
      adherenceLabel="Exercise Goal Adherence"
    >
      <div className="space-y-2">
        <Label htmlFor="exerciseMinutes">Exercise Duration</Label>
        <div className="flex space-x-2">
          <Input 
            id="exerciseMinutes"
            type="number"
            min="0"
            value={exerciseMinutes}
            onChange={(e) => setExerciseMinutes(e.target.value)}
          />
          <span className="flex items-center">minutes</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="steps">Step Count</Label>
        <div className="flex space-x-2">
          <Input 
            id="steps"
            type="number"
            min="0"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
          <span className="flex items-center">steps</span>
        </div>
      </div>
    </ProgressTabLayout>
  );
};

export default ExerciseTab;

