
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Brain, ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import HabitRepurposePlan from "./HabitRepurposePlan";

const InsightsTabs = () => {
  const { user } = useUser();

  const { data: progressData } = useQuery({
    queryKey: ['dashboard-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('daily_health_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: goalsData } = useQuery({
    queryKey: ['dashboard-goals', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  return (
    <div className="w-full mb-6">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressData && progressData.length > 0 ? (
                <div className="space-y-2">
                  {progressData.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{new Date(log.date).toLocaleDateString()}</span>
                      <div className="flex gap-2 text-xs">
                        {log.exercise_adherence && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Exercise: {log.exercise_adherence}</span>}
                        {log.sleep_hours && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Sleep: {log.sleep_hours}h</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent progress data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {goalsData && goalsData.length > 0 ? (
                <div className="space-y-3">
                  {goalsData.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium">Body Transformation Goal</h4>
                      <p className="text-sm text-muted-foreground mt-1">Working towards your target body type</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Fitness
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Target: {new Date(goal.target_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No goals set yet. Start by creating your first goal!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="mt-4">
          <HabitRepurposePlan />
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Consistency Tip</h4>
                  <p className="text-blue-800 text-sm">
                    Based on your recent activity, try scheduling your workouts at the same time each day to build a stronger habit.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Nutrition Insight</h4>
                  <p className="text-green-800 text-sm">
                    Consider meal prepping on Sundays to maintain consistent nutrition throughout the week.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Recovery Focus</h4>
                  <p className="text-purple-800 text-sm">
                    Your sleep patterns show room for improvement. Aim for 7-8 hours of quality sleep for better recovery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTabs;
