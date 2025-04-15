
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Dumbbell } from "lucide-react";

interface ExerciseSectionProps {
  exerciseMinutes: number;
  exerciseAdherence: "red" | "yellow" | "green";
  onExerciseMinutesChange: (value: number[]) => void;
  onAdherenceChange: (value: "red" | "yellow" | "green") => void;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exerciseMinutes,
  exerciseAdherence,
  onExerciseMinutesChange,
  onAdherenceChange,
}) => {
  return (
    <div>
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

      <StoplightControl
        value={exerciseAdherence}
        onValueChange={onAdherenceChange}
        label="Exercise Goal Adherence"
      />
    </div>
  );
};

export default ExerciseSection;
