
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { useAuthCheck } from "@/hooks/useAuthCheck";
import DashboardHeader from "./DashboardHeader";
import HealthOverview from "./HealthOverview";
import MetricsGrid from "./MetricsGrid";
import ActivityTracker from "./ActivityTracker";
import RecentProgress from "./RecentProgress";
import MotivationProgress from "./MotivationProgress";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuthCheck();
  const navigate = useNavigate();

  console.log("Dashboard rendering - User:", user?.id, "isLoading:", isLoading);

  // Get the first name or default to "User"
  const firstName = user?.name?.split(' ')[0] || "User";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 max-w-7xl">
        <DashboardHeader firstName={firstName} />
        
        <div className="flex gap-3 mb-8">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate("/add-progress")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Progress
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => navigate("/progress")}
          >
            View History
          </Button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Health Overview - Large card on left */}
          <div className="lg:col-span-8">
            <HealthOverview />
          </div>
          
          {/* Motivation Progress - Right sidebar */}
          <div className="lg:col-span-4">
            <MotivationProgress />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsGrid />
        </div>

        {/* Activity and Progress Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
          <div className="lg:col-span-5">
            <ActivityTracker />
          </div>
          <div className="lg:col-span-3">
            <RecentProgress />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
