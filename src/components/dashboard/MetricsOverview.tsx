
import React from "react";
import { Card } from "@/components/ui/card";
import SleepMetrics from "./SleepMetrics";
import NutritionMetrics from "./NutritionMetrics";
import ExerciseMetrics from "./ExerciseMetrics";

const MetricsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sleep Quality</h2>
          <SleepMetrics />
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Nutrition</h2>
          <NutritionMetrics />
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Exercise</h2>
          <ExerciseMetrics />
        </div>
      </Card>
    </div>
  );
};

export default MetricsOverview;
