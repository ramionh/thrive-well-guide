import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { useAuthCheck } from "@/hooks/useAuthCheck";
import WelcomeHeader from "./WelcomeHeader";
import MetricsOverview from "./MetricsOverview";
import InsightsTabs from "./InsightsTabs";
import CoreValues from "./CoreValues";
import FocusedHabits from "./FocusedHabits";
import HistoryButton from "./HistoryButton";
import MotivationProgress from "./MotivationProgress";
import HabitRepurposeSummary from "./HabitRepurposeSummary";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuthCheck();
  const navigate = useNavigate();

  console.log("Dashboard rendering - User:", user?.id, "isLoading:", isLoading);

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
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user or user hasn't completed onboarding
  if (!user) {
    console.log("Dashboard - No user found after loading, redirecting to auth");
    navigate('/auth');
    return null;
  }

  if (!user.onboardingCompleted) {
    console.log("Dashboard - User has not completed onboarding, showing onboarding card");
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
      <WelcomeHeader firstName={firstName} />
      
      <div className="flex gap-3 mb-6">
        <HistoryButton />
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => navigate("/add-progress")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Record Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MetricsOverview />
        </div>
        <div className="lg:col-span-1">
          <MotivationProgress />
        </div>
      </div>
      
      <InsightsTabs />
      {coreValues && <CoreValues values={coreValues} />}
      <HabitRepurposeSummary />
      <FocusedHabits habits={focusedHabits || []} />
    </div>
  );
};

export default Dashboard;
