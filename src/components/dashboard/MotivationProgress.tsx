
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { motivationSteps } from "@/components/motivation/config/motivationSteps";

const MotivationProgress = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: motivationStepsProgress } = useQuery({
    queryKey: ['motivation-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Check if Step 94 (Final step) has been completed
  const finalStepCompleted = motivationStepsProgress?.some(step => step.step_number === 94 && step.completed);

  // Set the total number of steps to 94 as there are 94 total steps in the journey
  const totalSteps = 94;
  const completedSteps = motivationStepsProgress?.filter(step => step.completed)?.length || 0;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  // Journey is complete when the final step (94) is completed
  const isJourneyComplete = finalStepCompleted;

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Motivation Journey</CardTitle>
        {isJourneyComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Star className="h-4 w-4 text-purple-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isJourneyComplete && (
            <div className="bg-green-50 border border-green-100 rounded-md p-3 text-sm text-green-700 mb-2">
              <p>Congratulations on completing your motivation journey! 🎉</p>
            </div>
          )}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{completedSteps} of {totalSteps} steps completed</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <Button 
            className={`w-full ${isJourneyComplete ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"}`}
            onClick={() => navigate('/motivation')}
          >
            {isJourneyComplete ? "Review Journey" : "Continue Journey"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationProgress;
