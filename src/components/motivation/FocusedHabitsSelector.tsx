
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

const FocusedHabitsSelector = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch available habits
  const { data: allHabits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('habit_number');
      
      if (error) throw error;
      
      // Randomly select 8 habits
      const habits = data as Habit[];
      const shuffled = [...habits].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 8);
    }
  });

  // Fetch current focused habits
  const { data: focusedHabits, refetch: refetchFocusedHabits } = useQuery({
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

  // Mutation to add/remove focused habits
  const focusHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) return;

      // Check if habit is already focused
      const isCurrentlyFocused = focusedHabits?.includes(habitId);

      if (isCurrentlyFocused) {
        // Remove focused habit
        const { error } = await supabase
          .from('focused_habits')
          .delete()
          .eq('user_id', user.id)
          .eq('habit_id', habitId);
        
        if (error) throw error;
      } else {
        // Check if already have 2 focused habits
        if (focusedHabits && focusedHabits.length >= 2) {
          toast({
            title: "Limit Reached",
            description: "You can only focus on 2 habits at a time.",
            variant: "destructive"
          });
          return;
        }

        // Add focused habit
        const { error } = await supabase
          .from('focused_habits')
          .insert({
            user_id: user.id,
            habit_id: habitId
          });
        
        if (error) throw error;
      }

      // Refetch focused habits
      refetchFocusedHabits();
    },
    onSuccess: () => {
      toast({
        title: "Habits Updated",
        description: "Your focused habits have been updated."
      });
    }
  });

  const handleHabitSelect = (habitId: string) => {
    focusHabitMutation.mutate(habitId);
  };

  if (isLoading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-4">
        Select up to 2 habits to focus on from the randomly selected options below:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allHabits?.map((habit) => (
          <Card 
            key={habit.id} 
            className={`p-4 cursor-pointer transition-all 
              ${focusedHabits?.includes(habit.id) 
                ? 'border-2 border-green-500 bg-green-50' 
                : 'hover:bg-gray-100'
              }`}
            onClick={() => focusHabitMutation.mutate(habit.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm text-gray-500">{habit.description}</p>
              </div>
              {focusedHabits?.includes(habit.id) && (
                <CheckCircle className="text-green-500" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FocusedHabitsSelector;
