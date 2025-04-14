
import React from "react";
import { useUser } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";
import { Moon } from "lucide-react";

const SleepMetrics: React.FC = () => {
  // In a real app, this would be fetched from the user's data
  const averageSleepHours = 7.2;
  const sleepQuality = 85;
  const targetSleepHours = 8;
  
  const sleepPercentage = (averageSleepHours / targetSleepHours) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="bg-thrive-blue/10 p-2 rounded-full mr-3">
          <Moon className="h-5 w-5 text-thrive-blue" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{averageSleepHours}h</h3>
          <p className="text-xs text-muted-foreground">Avg. sleep duration</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Sleep Duration</span>
          <span className="font-medium">{sleepPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={sleepPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">Target: {targetSleepHours} hours</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Sleep Quality</span>
          <span className="font-medium">{sleepQuality}%</span>
        </div>
        <Progress value={sleepQuality} className="h-2" />
      </div>
    </div>
  );
};

export default SleepMetrics;
