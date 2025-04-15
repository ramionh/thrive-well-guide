
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ProgressTabLayout from "./ProgressTabLayout";

interface SleepTabProps {
  sleepHours: string;
  setSleepHours: (value: string) => void;
  sleepQuality: number[];
  setSleepQuality: (value: number[]) => void;
  sleepAdherence: "red" | "yellow" | "green";
  setSleepAdherence: (value: "red" | "yellow" | "green") => void;
}

const SleepTab: React.FC<SleepTabProps> = ({
  sleepHours,
  setSleepHours,
  sleepQuality,
  setSleepQuality,
  sleepAdherence,
  setSleepAdherence,
}) => {
  return (
    <ProgressTabLayout
      title="Sleep Tracking"
      description="How well did you sleep?"
      adherenceValue={sleepAdherence}
      onAdherenceChange={setSleepAdherence}
      adherenceLabel="Sleep Goal Adherence"
    >
      <div className="space-y-2">
        <Label htmlFor="sleepHours">Hours of Sleep</Label>
        <div className="flex space-x-2">
          <Input 
            id="sleepHours"
            type="number"
            step="0.1"
            min="0"
            max="24"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
          />
          <span className="flex items-center">hours</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Sleep Quality</Label>
          <p className="text-sm text-muted-foreground">
            How would you rate the quality of your sleep?
          </p>
        </div>
        <div className="px-2">
          <Slider
            value={sleepQuality}
            max={100}
            step={1}
            onValueChange={setSleepQuality}
          />
          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
            <span>Poor</span>
            <span>{sleepQuality}%</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </ProgressTabLayout>
  );
};

export default SleepTab;

