
import React from "react";
import { useUser } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";
import { Apple } from "lucide-react";

const NutritionMetrics: React.FC = () => {
  // In a real app, this would be fetched from the user's data
  const caloriesConsumed = 1850;
  const caloriesTarget = 2000;
  const proteinPercentage = 75;
  const waterPercentage = 60;
  
  const caloriesPercentage = (caloriesConsumed / caloriesTarget) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="bg-thrive-orange/10 p-2 rounded-full mr-3">
          <Apple className="h-5 w-5 text-thrive-orange" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{caloriesConsumed}</h3>
          <p className="text-xs text-muted-foreground">Calories consumed</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Calories</span>
          <span className="font-medium">{caloriesPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={caloriesPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground">Target: {caloriesTarget} calories</p>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Protein</span>
          <span className="font-medium">{proteinPercentage}%</span>
        </div>
        <Progress value={proteinPercentage} className="h-2" />
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span>Water</span>
          <span className="font-medium">{waterPercentage}%</span>
        </div>
        <Progress value={waterPercentage} className="h-2" />
      </div>
    </div>
  );
};

export default NutritionMetrics;
