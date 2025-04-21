
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useFocusedHabits = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allHabits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      // First fetch focused habits
      const { data: focusedData, error: focusedError } = await supabase
        .from('focused_habits')
        .select('habit_id')
        .eq('user_id', user?.id);
      
      if (focusedError) throw focusedError;
      const focusedIds = focusedData?.map(item => item.habit_id) || [];
      
      // Then fetch all habits
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('habit_number');
      
      if (error) throw error;
      
      const habits = data;
      
      // Make sure focused habits are included in the selection
      const focusedHabits = habits.filter(h => focusedIds.includes(h.id));
      const otherHabits = habits.filter(h => !focusedIds.includes(h.id));
      const shuffledOthers = otherHabits.sort(() => 0.5 - Math.random());
      
      // Combine focused habits with random selection of others, up to 8 total
      return [...focusedHabits, ...shuffledOthers].slice(0, 8);
    }
  });

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

  const completionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 2,
          step_name: 'Focus Habits',
          completed: true,
          completed_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,step_number' 
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Step completed",
        description: "Your progress has been saved"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error completing step:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  });

  const focusHabitMutation = useMutation({
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

      await refetchFocusedHabits();
      await queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onSuccess: () => {
      toast({
        title: "Habits Updated",
        description: "Your focused habits have been updated."
      });
    }
  });

  return {
    allHabits,
    isLoading,
    focusedHabits,
    completionMutation,
    focusHabitMutation
  };
};
