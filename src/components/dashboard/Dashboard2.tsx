import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import SleepMetrics from "./SleepMetrics";
import NutritionMetrics from "./NutritionMetrics";
import ExerciseMetrics from "./ExerciseMetrics";
import GoalProgress from "./GoalProgress";
import HistoryButton from "./HistoryButton";
import WeeklyCheckIn from "./WeeklyCheckIn";
import MotivationProgress from "./MotivationProgress";
import CoreValues from "./CoreValues";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: coreValues } = useQuery({
    queryKey: ['core-values', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_clarifying_values')
        .select('selected_value_1, selected_value_2')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (!user?.onboardingCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle>Welcome to ThriveWell</CardTitle>
            <CardDescription>
              Let's get started with a quick onboarding process to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-thrive-blue" 
              onClick={() => navigate("/onboarding")}
            >
              Start Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name || "Friend"}</h1>
          <p className="text-muted-foreground">Here's an overview of your wellness journey</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <HistoryButton />
          <WeeklyCheckIn />
          <Button 
            className="bg-thrive-blue hover:bg-thrive-blue/90"
            onClick={() => navigate("/add-progress")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Progress
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sleep Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <SleepMetrics />
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <NutritionMetrics />
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseMetrics />
          </CardContent>
        </Card>

        <MotivationProgress />
      </div>
      
      {coreValues && <CoreValues values={coreValues} />}
      
      <div className="mb-6">
        <Tabs defaultValue="goals">
          <TabsList>
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
