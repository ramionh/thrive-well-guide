
import React, { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, PlusCircle } from "lucide-react";

import SleepMetrics from "./SleepMetrics";
import NutritionMetrics from "./NutritionMetrics";
import ExerciseMetrics from "./ExerciseMetrics";
import GoalProgress from "./GoalProgress";
import HistoryButton from "./HistoryButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  // Make sure we have a user or redirect back to auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.log("No session found, redirecting to auth");
        navigate('/auth');
        return;
      }
      
      if (!isLoading && !user) {
        console.log("User not loaded but session exists, waiting...");
        // Wait for user to load
      }
    };
    
    checkAuth();
  }, [user, isLoading, navigate]);

  // Get the first name or default to "User"
  const firstName = user?.name?.split(' ')[0] || "User";

  // Fetch focused habits with their details
  const { data: focusedHabits } = useQuery({
    queryKey: ['focused-habits', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('focused_habits')
        .select('habit_id(id, name, description, category)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.habit_id) || [];
    },
    enabled: !!user
  });

  // Add this query for core values
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

  // Show loading state if we're still loading user data
  if (isLoading || (!user && supabase.auth.getSession())) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
      <div className="flex items-center mb-6">
        <div className="flex items-center pointer-events-none">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span className="ml-3 text-lg font-medium text-muted-foreground">
            {firstName}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}</h1>
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

      {coreValues && (
        <Card className="shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Core Values</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <span className="text-purple-800">{coreValues.selected_value_1}</span>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <span className="text-purple-800">{coreValues.selected_value_2}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {focusedHabits && focusedHabits.length > 0 && (
        <div className="mb-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Your Focused Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {focusedHabits.map((habit: any) => (
                  <div key={habit.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold">{habit.name}</h3>
                    <p className="text-sm text-gray-600">{habit.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
