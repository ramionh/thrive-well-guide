
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useUserRole } from "@/hooks/useUserRole";
import DashboardSidebar from "./DashboardSidebar";
import WeeklyCheckIn from "./WeeklyCheckIn";

import MetricsGrid from "./MetricsGrid";
import InsightsTabs from "./InsightsTabs";
import MotivationProgress from "./MotivationProgress";
import AssignedCoach from "./AssignedCoach";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuthCheck();
  const { isCoach, isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  console.log("Dashboard rendering - User:", user?.id, "isLoading:", isLoading);

  // Redirect coaches and admins to admin dashboard
  useEffect(() => {
    if (!roleLoading && (isCoach || isAdmin)) {
      console.log("Dashboard - User is coach/admin, redirecting to admin dashboard");
      navigate('/admin/dashboard');
    }
  }, [isCoach, isAdmin, roleLoading, navigate]);

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


  // Show loading state if we're still loading user data or role data
  if (isLoading || roleLoading) {
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
          <h2 className="text-2xl font-bold mb-4">Welcome to Gen X Shred</h2>
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
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <div className="flex-1 ml-48">
        <div className="p-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {firstName}
                </h1>
                <p className="text-muted-foreground">
                  Here's an overview of your wellness journey
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button
                  className="bg-thrive-blue hover:bg-thrive-blue/90"
                  onClick={() => navigate("/add-progress")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Record Progress
                </Button>
                <WeeklyCheckIn />
                <Button
                  variant="outline"
                  onClick={() => navigate("/progress")}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricsGrid />
          </div>

          {/* Coach Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AssignedCoach />
          </div>

          {/* Main Content Grid */}
          <div className="mb-8">
            <MotivationProgress />
          </div>

          {/* Bottom Section */}
          <div className="mb-8">
            <InsightsTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
