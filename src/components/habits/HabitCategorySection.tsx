
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Habit } from '@/types/habit';
import { useUser } from "@/hooks/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HabitCategorySectionProps {
  category: string;
  description: string;
  habits: Habit[];
}

type UserHabit = {
  id: string;
  habit_id: string;
  adherence: "red" | "yellow" | "green";
  notes: string | null;
};

const HabitCategorySection = ({ category, description, habits }: HabitCategorySectionProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch user's habit adherence data
  const { data: userHabits } = useQuery({
    queryKey: ['userHabits', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return (data || []) as UserHabit[];
    },
    enabled: !!user
  });

  // Mutation for saving habit adherence
  const updateAdherenceMutation = useMutation({
    mutationFn: async ({ habitId, adherence }: { habitId: string, adherence: "red" | "yellow" | "green" }) => {
      const { data: existingHabit } = await supabase
        .from('user_habits')
        .select()
        .eq('habit_id', habitId)
        .eq('user_id', user?.id)
        .single();

      if (existingHabit) {
        const { error } = await supabase
          .from('user_habits')
          .update({ adherence })
          .eq('habit_id', habitId)
          .eq('user_id', user?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_habits')
          .insert([{
            habit_id: habitId,
            user_id: user?.id,
            adherence
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userHabits'] });
      toast.success('Habit adherence updated');
    },
    onError: (error) => {
      console.error('Error updating habit adherence:', error);
      toast.error('Failed to update habit adherence');
    }
  });

  const handleAdherenceChange = (habitId: string, value: "red" | "yellow" | "green") => {
    updateAdherenceMutation.mutate({ habitId, adherence: value });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {category.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
        </CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {habits.map((habit) => {
            const userHabit = userHabits?.find(uh => uh.habit_id === habit.id);
            return (
              <div key={habit.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-medium mb-2">
                      {habit.habit_number}. {habit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {habit.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StoplightControl
                      value={userHabit?.adherence}
                      onValueChange={(value) => handleAdherenceChange(habit.id, value)}
                      label="Adherence Level"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCategorySection;
