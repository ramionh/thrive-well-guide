
import React from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SleepMetrics from "./SleepMetrics";
import NutritionMetrics from "./NutritionMetrics";
import ExerciseMetrics from "./ExerciseMetrics";
import GoalProgress from "./GoalProgress";
import HistoryButton from "./HistoryButton";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  if (!user?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to 40+Ripped</h2>
          <p className="text-muted-foreground mb-6">
            Let's get started with a quick onboarding process to personalize your experience.
          </p>
          <Button 
            className="bg-thrive-blue" 
            onClick={() => navigate("/onboarding")}
          >
            Start Onboarding
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name || "Friend"}</h1>
          <p className="text-muted-foreground">Here's an overview of your wellness journey</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <HistoryButton />
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate("/add-progress")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Progress
          </Button>
        </div>
      </div>
      
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
      
      <div className="mb-6">
        <Tabs defaultValue="goals">
          <TabsList className="bg-background">
            <TabsTrigger value="goals">Goals Progress</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="goals" className="mt-4">
            <GoalProgress />
          </TabsContent>
          <TabsContent value="insights" className="mt-4">
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                As you continue to track your progress, personalized insights will appear here.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
