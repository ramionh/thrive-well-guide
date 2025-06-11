
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Habit } from "@/types/habit";
import HabitCategorySection from "@/components/habits/HabitCategorySection";
import HabitsSplash from "@/components/habits/HabitsSplash";
import HabitsJourneyOptions from "@/components/habits/HabitsJourneyOptions";

type HabitsView = 'splash' | 'options' | 'existing' | 'repurpose' | 'core';

const HabitsPage = () => {
  const [currentView, setCurrentView] = useState<HabitsView>('splash');

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

  const handleStartJourney = () => {
    setCurrentView('options');
  };

  const handleSelectOption = (option: 'existing' | 'repurpose' | 'core') => {
    if (option === 'core') {
      setCurrentView('core');
    } else {
      // For now, we'll just set to core for existing and repurpose
      // These can be implemented later with different content
      setCurrentView('core');
    }
  };

  if (currentView === 'splash') {
    return <HabitsSplash onStartJourney={handleStartJourney} />;
  }

  if (currentView === 'options') {
    return <HabitsJourneyOptions onSelectOption={handleSelectOption} />;
  }

  // Show the core habits (existing habits list)
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Core Habits for Getting to 10% Body Fat</h1>
        </div>
        <Button 
          onClick={() => setCurrentView('splash')}
          variant="outline"
        >
          Back to Journey Options
        </Button>
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
