
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Moon } from "lucide-react";

interface SleepSectionProps {
  sleepHours: number;
  sleepAdherence: "red" | "yellow" | "green";
  onSleepHoursChange: (value: number[]) => void;
  onAdherenceChange: (value: "red" | "yellow" | "green") => void;
}

const SleepSection: React.FC<SleepSectionProps> = ({
  sleepHours,
  sleepAdherence,
  onSleepHoursChange,
  onAdherenceChange,
}) => {
  return (
    <div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Moon className="h-5 w-5 text-thrive-blue" />
          <Label>Sleep Hours</Label>
        </div>
        <Slider
          defaultValue={[7]}
          max={12}
          step={0.5}
          value={[sleepHours]}
          onValueChange={onSleepHoursChange}
        />
        <div className="text-sm text-muted-foreground mt-1 text-center">
          {sleepHours} hours
        </div>
      </div>

      <StoplightControl
        value={sleepAdherence}
        onValueChange={onAdherenceChange}
        label="Sleep Goal Adherence"
      />
    </div>
  );
};

export default SleepSection;
