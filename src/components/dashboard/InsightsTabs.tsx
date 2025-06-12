import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Activity, ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import GoalProgress from "./GoalProgress";
import FocusedHabits from "./FocusedHabits";
import CategoryScoresDisplay from "../habits/CategoryScoresDisplay";
import HabitRepurposeSummary from "./HabitRepurposeSummary";
import PersonalizedInsights from "./PersonalizedInsights";

const InsightsTabs: React.FC = () => {
  const { user } = useUser();

  const { data: recentProgress, isLoading } = useQuery({
    queryKey: ['recent-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('daily_health_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

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

  const getAdherenceColor = (adherence: string) => {
    switch (adherence) {
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAdherenceText = (adherence: string) => {
    switch (adherence) {
      case 'green': return 'green';
      case 'yellow': return 'yellow';
      case 'red': return 'red';
      default: return 'none';
    }
  };

  return (
    <div className="mb-6">
      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">
            <TrendingUp className="mr-2 h-4 w-4" />
            Recent Progress
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="habits">
            <ListChecks className="mr-2 h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="mt-4">
          <Card className="p-6">
            {isLoading ? (
              <div className="text-center py-4">Loading recent progress...</div>
            ) : recentProgress && recentProgress.length > 0 ? (
              <div className="space-y-3">
                {recentProgress.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="font-medium">
                      {format(new Date(entry.date), 'M/d/yyyy')}
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span>Exercise:</span>
                        <span className={getAdherenceColor(entry.exercise_adherence)}>
                          {getAdherenceText(entry.exercise_adherence)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>😴</span>
                        <span>Sleep:</span>
                        <span className={getAdherenceColor(entry.sleep_adherence)}>
                          {entry.sleep_hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No progress data recorded yet. Start tracking your daily progress to see insights here.
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <GoalProgress />
        </TabsContent>

        <TabsContent value="habits" className="mt-4">
          <div className="space-y-6">
            <CategoryScoresDisplay />
            <HabitRepurposeSummary />
            <FocusedHabits habits={focusedHabits || []} />
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <PersonalizedInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTabs;
