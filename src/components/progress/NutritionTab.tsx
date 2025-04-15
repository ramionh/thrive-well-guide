
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ProgressTabLayout from "./ProgressTabLayout";

interface NutritionTabProps {
  calories: string;
  setCalories: (value: string) => void;
  protein: string;
  setProtein: (value: string) => void;
  water: string;
  setWater: (value: string) => void;
  nutritionAdherence: "red" | "yellow" | "green";
  setNutritionAdherence: (value: "red" | "yellow" | "green") => void;
}

const NutritionTab: React.FC<NutritionTabProps> = ({
  calories,
  setCalories,
  protein,
  setProtein,
  water,
  setWater,
  nutritionAdherence,
  setNutritionAdherence,
}) => {
  return (
    <ProgressTabLayout
      title="Nutrition Tracking"
      description="Track your daily nutrition"
      adherenceValue={nutritionAdherence}
      onAdherenceChange={setNutritionAdherence}
      adherenceLabel="Nutrition Goal Adherence"
    >
      <div className="space-y-2">
        <Label htmlFor="calories">Calories Consumed</Label>
        <div className="flex space-x-2">
          <Input 
            id="calories"
            type="number"
            min="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
          <span className="flex items-center">kcal</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="protein">Protein Consumed</Label>
        <div className="flex space-x-2">
          <Input 
            id="protein"
            type="number"
            min="0"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <span className="flex items-center">grams</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="water">Water Intake</Label>
        <div className="flex space-x-2">
          <Input 
            id="water"
            type="number"
            min="0"
            value={water}
            onChange={(e) => setWater(e.target.value)}
          />
          <span className="flex items-center">glasses</span>
        </div>
      </div>
    </ProgressTabLayout>
  );
};

export default NutritionTab;

