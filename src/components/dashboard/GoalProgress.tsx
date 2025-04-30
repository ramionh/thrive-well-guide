
import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Moon, Apple, Target } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GoalProgress: React.FC = () => {
  const { user } = useUser();
  
  // Fetch the user's measurable goals
  const { data: measurableGoals } = useQuery({
    queryKey: ['measurable-goals', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_measurable_goal')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching measurable goals:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  // Fetch current body metrics
  const { data: currentMetrics } = useQuery({
    queryKey: ['current-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_body_types')
        .select('weight_lbs, bodyfat_percentage')
        .eq('user_id', user.id)
        .order('selected_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching current metrics:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sleep":
        return <Moon className="h-4 w-4 text-thrive-blue" />;
      case "nutrition":
        return <Apple className="h-4 w-4 text-thrive-orange" />;
      case "exercise":
        return <Dumbbell className="h-4 w-4 text-thrive-teal" />;
      default:
        return <Target className="h-4 w-4 text-thrive-teal" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep":
        return "bg-thrive-blue";
      case "nutrition":
        return "bg-thrive-orange";
      case "exercise":
        return "bg-thrive-teal";
      default:
        return "bg-blue-500";
    }
  };
  
  // If no goals, show empty state
  if (!user?.goals || user.goals.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          You don't have any transformation goals set yet.
        </p>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {user.goals.map((goal) => {
        // Calculate progress as percentage of time passed
        const totalDays = differenceInDays(new Date(goal.targetDate), new Date(goal.startedDate));
        const daysPassed = differenceInDays(new Date(), new Date(goal.startedDate));
        const progressPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
        const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
        
        return (
          <Card key={goal.id} className="overflow-hidden card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full bg-blue-500/10`}>
                  {getCategoryIcon(goal.category || "other")}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">Body Transformation Goal</h3>
                  <div className="mt-2">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>
                      Started: {format(new Date(goal.startedDate), 'PP')}
                    </span>
                    <span>{daysRemaining} days remaining</span>
                  </div>
                  
                  {/* Display goal metrics */}
                  {(measurableGoals?.goal_weight_lbs || measurableGoals?.goal_bodyfat_percentage) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium mb-2">Measurable Targets</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {measurableGoals.goal_weight_lbs && (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <div className="font-medium text-blue-900">Weight Goal</div>
                            <div className="flex justify-between text-blue-800">
                              <span>Current:</span>
                              <span>{currentMetrics?.weight_lbs || '—'} lbs</span>
                            </div>
                            <div className="flex justify-between text-blue-800">
                              <span>Target:</span>
                              <span>{measurableGoals.goal_weight_lbs} lbs</span>
                            </div>
                          </div>
                        )}
                        
                        {measurableGoals.goal_bodyfat_percentage && (
                          <div className="bg-green-50 p-2 rounded text-sm">
                            <div className="font-medium text-green-900">Body Fat Goal</div>
                            <div className="flex justify-between text-green-800">
                              <span>Current:</span>
                              <span>{currentMetrics?.bodyfat_percentage || '—'}%</span>
                            </div>
                            <div className="flex justify-between text-green-800">
                              <span>Target:</span>
                              <span>{measurableGoals.goal_bodyfat_percentage}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalProgress;
