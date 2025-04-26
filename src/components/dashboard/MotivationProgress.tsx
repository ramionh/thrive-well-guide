
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

const MotivationProgress = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: motivationSteps } = useQuery({
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

  const totalSteps = 12; // Total number of motivation steps
  const completedSteps = motivationSteps?.length || 0;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Motivation Journey</CardTitle>
        <Star className="h-4 w-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{completedSteps} of {totalSteps} steps completed</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <Button 
            className="w-full bg-purple-500 hover:bg-purple-600"
            onClick={() => navigate('/motivation')}
          >
            Continue Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationProgress;
