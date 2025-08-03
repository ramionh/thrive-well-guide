import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calculator } from "lucide-react";

interface MacrosData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  assigned_date: string;
}

interface MacrosDisplayProps {
  macros?: MacrosData;
  isLoading?: boolean;
}

const MacrosDisplay: React.FC<MacrosDisplayProps> = ({ macros, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Your Macros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading your macros...</p>
        </CardContent>
      </Card>
    );
  }

  if (!macros) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Your Macros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No macros assigned yet. Complete a weekly check-in to get your personalized macros.
          </p>
        </CardContent>
      </Card>
    );
  }

  const proteinCals = macros.protein * 4;
  const carbsCals = macros.carbs * 4;
  const fatCals = macros.fat * 9;

  const proteinPercent = (proteinCals / macros.calories) * 100;
  const carbsPercent = (carbsCals / macros.calories) * 100;
  const fatPercent = (fatCals / macros.calories) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Your Macros
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Assigned: {new Date(macros.assigned_date).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Calories */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">{macros.calories}</div>
          <div className="text-sm text-muted-foreground">Total Calories</div>
        </div>

        {/* Macronutrients */}
        <div className="space-y-4">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Protein</span>
              <span>{macros.protein}g ({proteinPercent.toFixed(0)}%)</span>
            </div>
            <Progress value={proteinPercent} className="h-2" />
          </div>

          {/* Carbohydrates */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Carbohydrates</span>
              <span>{macros.carbs}g ({carbsPercent.toFixed(0)}%)</span>
            </div>
            <Progress value={carbsPercent} className="h-2" />
          </div>

          {/* Fats */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Fats</span>
              <span>{macros.fat}g ({fatPercent.toFixed(0)}%)</span>
            </div>
            <Progress value={fatPercent} className="h-2" />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{macros.protein}g</div>
            <div className="text-xs text-muted-foreground">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{macros.carbs}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">{macros.fat}g</div>
            <div className="text-xs text-muted-foreground">Fats</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MacrosDisplay;