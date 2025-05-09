
import React from "react";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Habit } from "@/types/habit";
import HabitCategorySection from "@/components/habits/HabitCategorySection";

const HabitsPage = () => {
  const { data: habits, isLoading } = useQuery({
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

  const habitsByCategory = habits?.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = {
        habits: [],
        description: habit.category_description
      };
    }
    acc[habit.category].habits.push(habit);
    return acc;
  }, {} as Record<string, { habits: Habit[], description: string }>);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-48 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Core Habits for Getting to 10% Body Fat</h1>
      </div>

      <div className="space-y-6">
        {habitsByCategory && Object.entries(habitsByCategory).map(([category, { habits, description }]) => (
          <HabitCategorySection
            key={category}
            category={category}
            description={description}
            habits={habits}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitsPage;
