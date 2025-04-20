
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Moon, Apple, LineChart as LineChartIcon } from "lucide-react";
import BodyMeasurementsChart from "@/components/progress/BodyMeasurementsChart";
import SleepProgressTab from "@/components/progress/SleepProgressTab";
import NutritionProgressTab from "@/components/progress/NutritionProgressTab";
import ExerciseProgressTab from "@/components/progress/ExerciseProgressTab";

const ProgressPage: React.FC = () => {
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
      
      <Tabs defaultValue="measurements">
        <TabsList className="mb-6">
          <TabsTrigger value="measurements" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Measurements
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercise
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="measurements">
          <BodyMeasurementsChart />
        </TabsContent>
        
        <TabsContent value="sleep">
          <SleepProgressTab />
        </TabsContent>
        
        <TabsContent value="nutrition">
          <NutritionProgressTab />
        </TabsContent>
        
        <TabsContent value="exercise">
          <ExerciseProgressTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
