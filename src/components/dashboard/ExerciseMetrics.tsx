
import React from "react";
import { useUser } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";
import { Dumbbell } from "lucide-react";

const ExerciseMetrics: React.FC = () => {
  // In a real app, this would be fetched from the user's data
  const minutesExercised = 45;
  const exerciseTarget = 60;
  const stepsCount = 7500;
  const stepsTarget = 10000;
  
  const exercisePercentage = (minutesExercised / exerciseTarget) * 100;
  const stepsPercentage = (stepsCount / stepsTarget) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="bg-thrive-teal/10 p-2 rounded-full mr-3">
          <Dumbbell className="h-5 w-5 text-thrive-teal" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{minutesExercised}m</h3>
          <p className="text-xs text-muted-foreground">Active minutes today</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Exercise Duration</span>
          <span className="font-medium">{exercisePercentage.toFixed(0)}%</span>
        </div>
        <Progress value={exercisePercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">Target: {exerciseTarget} minutes</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Steps</span>
          <span className="font-medium">{stepsPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={stepsPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {stepsCount.toLocaleString()} / {stepsTarget.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ExerciseMetrics;
