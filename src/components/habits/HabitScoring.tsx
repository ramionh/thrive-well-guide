
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Habit } from "@/types/habit";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StoplightValue = "red" | "yellow" | "green";

interface HabitScoreData {
  habit_id: string;
  response: StoplightValue;
}

interface HabitScoringProps {
  onSaveComplete?: () => void;
}

const HabitScoring = ({ onSaveComplete }: HabitScoringProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [habitScores, setHabitScores] = useState<Record<string, StoplightValue>>({});

  // Fetch all habits
  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('habit_number');
      
      if (error) throw error;
      return data as Habit[];
    }
  });

  // Fetch user's existing scores
  const { data: existingScores, isLoading: scoresLoading } = useQuery({
    queryKey: ['user-habit-scores', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as HabitScoreData[];
    },
    enabled: !!user
  });

  // Initialize scores from existing data
  useEffect(() => {
    if (existingScores) {
      const scoresMap: Record<string, StoplightValue> = {};
      existingScores.forEach(score => {
        scoresMap[score.habit_id] = score.response;
      });
      setHabitScores(scoresMap);
    }
  }, [existingScores]);

  // Save scores mutation
  const saveScoresMutation = useMutation({
    mutationFn: async (scores: Record<string, StoplightValue>) => {
      if (!user) throw new Error('User not authenticated');

      const updates = Object.entries(scores).map(([habitId, response]) => ({
        user_id: user.id,
        habit_id: habitId,
        response
      }));

      // Use upsert to handle both inserts and updates
      const { error } = await supabase
        .from('user_habit_scoring')
        .upsert(updates, { 
          onConflict: 'user_id,habit_id',
          ignoreDuplicates: false 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-habit-scores', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-habit-assessment-status', user?.id] });
      toast({
        title: "Success",
        description: "Your habit assessment has been saved!"
      });
      
      // Call the callback to redirect
      if (onSaveComplete) {
        onSaveComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving scores:', error);
      toast({
        title: "Error",
        description: "Failed to save your scores. Please try again.",
        variant: "destructive"
      });
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

  if (habitsLoading || scoresLoading) {
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

  const habitsByCategory = habits?.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = [];
    }
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Core Habits Assessment
        </CardTitle>
        <p className="text-muted-foreground">
          Rate each habit with green (doing well), yellow (needs improvement), or red (needs work). 
          Green responses earn 3 points toward your category score.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {habitsByCategory && Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold text-purple-800 border-b border-purple-200 pb-2">
              {category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <div className="space-y-3">
              {categoryHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{habit.name}</h4>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
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
            </div>
          </div>
        ))}
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveScores}
            disabled={saveScoresMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saveScoresMutation.isPending ? "Saving..." : "Save Assessment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitScoring;
