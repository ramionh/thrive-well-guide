
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Dumbbell, Footprints } from "lucide-react";

interface ExerciseSectionProps {
  exerciseMinutes: number;
  exerciseAdherence: "red" | "yellow" | "green";
  steps?: number;
  onExerciseMinutesChange: (value: number[]) => void;
  onStepsChange?: (value: number) => void;
  onAdherenceChange: (value: "red" | "yellow" | "green") => void;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exerciseMinutes,
  exerciseAdherence,
  steps = 0,
  onExerciseMinutesChange,
  onStepsChange,
  onAdherenceChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="h-5 w-5 text-thrive-blue" />
          <Label>Exercise Minutes</Label>
        </div>
        <Slider
          defaultValue={[30]}
          max={180}
          step={5}
          value={[exerciseMinutes]}
          onValueChange={onExerciseMinutesChange}
        />
        <div className="text-sm text-muted-foreground mt-1 text-center">
          {exerciseMinutes} minutes
        </div>
      </div>

      {onStepsChange && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Footprints className="h-5 w-5 text-thrive-blue" />
            <Label>Steps</Label>
          </div>
          <Input
            type="number"
            min="0"
            value={steps}
            onChange={(e) => onStepsChange(parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      )}

      <StoplightControl
        value={exerciseAdherence}
        onValueChange={onAdherenceChange}
        label="Exercise Goal Adherence"
      />
    </div>
  );
};

export default ExerciseSection;
