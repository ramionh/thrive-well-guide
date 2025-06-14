
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Habit } from "@/types/habit";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type StoplightValue = "red" | "yellow" | "green";

interface StreamlinedHabitAssessmentProps {
  onComplete?: (scores: Record<string, StoplightValue>) => void;
  onContinueToFull?: () => void;
}

const StreamlinedHabitAssessment = ({ onComplete, onContinueToFull }: StreamlinedHabitAssessmentProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [habitScores, setHabitScores] = useState<Record<string, StoplightValue>>({});
  const [showResults, setShowResults] = useState(false);

  // Most impactful habits (1-2 per category)
  const priorityHabitNumbers = [1, 5, 10, 15, 20, 25, 30, 35]; // Top habits from each category

  // Fetch priority habits
  const { data: habits, isLoading } = useQuery({
    queryKey: ['priority-habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .in('habit_number', priorityHabitNumbers)
        .order('habit_number');
      
      if (error) throw error;
      return data as Habit[];
    }
  });

  // Fetch existing scores for these habits
  const { data: existingScores } = useQuery({
    queryKey: ['priority-habit-scores', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('*')
        .eq('user_id', user.id)
        .in('habit_id', habits?.map(h => h.id) || []);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!habits
  });

  // Initialize scores from existing data
  useEffect(() => {
    if (existingScores && habits) {
      const scoresMap: Record<string, StoplightValue> = {};
      existingScores.forEach(score => {
        scoresMap[score.habit_id] = score.response as StoplightValue;
      });
      setHabitScores(scoresMap);
    }
  }, [existingScores, habits]);

  // Save scores mutation
  const saveScoresMutation = useMutation({
    mutationFn: async (scores: Record<string, StoplightValue>) => {
      if (!user) throw new Error('User not authenticated');

      const updates = Object.entries(scores).map(([habitId, response]) => ({
        user_id: user.id,
        habit_id: habitId,
        response
      }));

      const { error } = await supabase
        .from('user_habit_scoring')
        .upsert(updates, { 
          onConflict: 'user_id,habit_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priority-habit-scores', user?.id] });
      toast({
        title: "Quick Assessment Complete!",
        description: "Your priority habits have been assessed."
      });
      setShowResults(true);
      if (onComplete) {
        onComplete(habitScores);
      }
    }
  });

  const handleScoreChange = (habitId: string, value: StoplightValue) => {
    setHabitScores(prev => ({
      ...prev,
      [habitId]: value
    }));
  };

  const handleSaveScores = () => {
    saveScoresMutation.mutate(habitScores);
  };

  const completedCount = Object.keys(habitScores).length;
  const totalCount = habits?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const greenCount = Object.values(habitScores).filter(score => score === 'green').length;
  const yellowCount = Object.values(habitScores).filter(score => score === 'yellow').length;
  const redCount = Object.values(habitScores).filter(score => score === 'red').length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Your Quick Habit Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{greenCount}</div>
              <div className="text-sm text-green-700">Doing Great</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{yellowCount}</div>
              <div className="text-sm text-yellow-700">Needs Improvement</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{redCount}</div>
              <div className="text-sm text-red-700">Needs Focus</div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Great start! You've assessed your most critical habits. Ready to dive deeper?
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={onContinueToFull}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Full Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-blue-600" />
          Quick Habit Assessment
        </CardTitle>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Let's start with your most impactful habits. Rate each one to get immediate insights.
          </p>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits?.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium">{habit.name}</h4>
              <p className="text-sm text-muted-foreground">{habit.description}</p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                {habit.category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            <div className="ml-4">
              <StoplightControl
                value={habitScores[habit.id]}
                onValueChange={(value) => handleScoreChange(habit.id, value)}
                label=""
              />
            </div>
          </div>
        ))}
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveScores}
            disabled={saveScoresMutation.isPending || completedCount === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saveScoresMutation.isPending ? "Saving..." : "Complete Quick Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamlinedHabitAssessment;
