import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Habit } from '@/types/habit';

interface FocusedHabitsFromAssessmentProps {
  onComplete?: () => void;
}

const FocusedHabitsFromAssessment = ({ onComplete }: FocusedHabitsFromAssessmentProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch habits that scored poorly (not green) in assessment
  const { data: poorScoringHabits, isLoading } = useQuery({
    queryKey: ['poor-scoring-habits', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get user's habit responses (poor responses indicate areas for improvement)
      const { data: scores, error: scoresError } = await supabase
        .from('user_habit_scoring')
        .select('habit_id, response')
        .eq('user_id', user.id)
        .in('response', ['poor', 'needs-work', 'red', 'yellow']); // Only poor scoring habits

      if (scoresError) throw scoresError;

      if (!scores || scores.length === 0) return [];

      // Get the actual habit details for poor scoring habits
      const habitIds = scores.map(s => s.habit_id);
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .in('id', habitIds)
        .order('habit_number');

      if (habitsError) throw habitsError;

      return habits || [];
    },
    enabled: !!user
  });

  // Get currently focused habits
  const { data: focusedHabits } = useQuery({
    queryKey: ['focused-habits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('focused_habits')
        .select('habit_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(item => item.habit_id) || [];
    },
    enabled: !!user
  });

  // Toggle focused habit
  const toggleFocusedHabit = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) return;

      const isCurrentlyFocused = focusedHabits?.includes(habitId);

      if (isCurrentlyFocused) {
        const { error } = await supabase
          .from('focused_habits')
          .delete()
          .eq('user_id', user.id)
          .eq('habit_id', habitId);
        
        if (error) throw error;
      } else {
        if (focusedHabits && focusedHabits.length >= 2) {
          toast({
            title: "Limit Reached",
            description: "You can only focus on 2 habits at a time.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase
          .from('focused_habits')
          .insert({
            user_id: user.id,
            habit_id: habitId
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focused-habits'] });
      toast({
        title: "Focused Habits Updated",
        description: "Your focused habits have been updated."
      });
    },
    onError: (error) => {
      console.error('Error updating focused habits:', error);
      toast({
        title: "Error",
        description: "Failed to update focused habits.",
        variant: "destructive"
      });
    }
  });

  const handleComplete = () => {
    if (focusedHabits && focusedHabits.length > 0) {
      toast({
        title: "Focused Habits Selected",
        description: `You've selected ${focusedHabits.length} habit(s) to focus on.`
      });
      onComplete?.();
    } else {
      toast({
        title: "No Habits Selected",
        description: "Please select at least one habit to focus on.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading your assessment results...</div>
      </div>
    );
  }

  if (!poorScoringHabits || poorScoringHabits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Great Job!</h3>
          <p className="text-muted-foreground">
            You scored well on all your core habits. Keep up the great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Focused Habits</CardTitle>
        <p className="text-muted-foreground">
          Based on your Core Habits Assessment, these are areas where you can improve. 
          Select up to 2 habits to focus on for better results.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {poorScoringHabits.map((habit: Habit) => {
            const isFocused = focusedHabits?.includes(habit.id);
            
            return (
              <div
                key={habit.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                  isFocused 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
                onClick={() => toggleFocusedHabit.mutate(habit.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{habit.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {habit.description}
                    </p>
                    <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
                      {habit.category_description}
                    </span>
                  </div>
                  {isFocused && (
                    <CheckCircle2 className="h-5 w-5 text-primary ml-3 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-3">
            Selected: {focusedHabits?.length || 0}/2 habits
          </div>
          <Button 
            onClick={handleComplete}
            className="w-full"
            disabled={!focusedHabits || focusedHabits.length === 0}
          >
            Continue with Selected Habits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusedHabitsFromAssessment;