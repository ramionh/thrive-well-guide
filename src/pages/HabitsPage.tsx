
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Habit } from "@/types/habit";
import HabitCategorySection from "@/components/habits/HabitCategorySection";
import HabitsSplash from "@/components/habits/HabitsSplash";
import HabitsJourneyOptions from "@/components/habits/HabitsJourneyOptions";
import HabitRepurposeWizard from "@/components/habits/HabitRepurposeWizard";
import CoreOptimalHabitAssessment from "@/components/habits/CoreOptimalHabitAssessment";
import ExistingHabitsAssessment from "@/components/habits/ExistingHabitsAssessment";
import FocusedHabits from "@/components/dashboard/FocusedHabits";

type HabitsView = 'splash' | 'options' | 'existing' | 'repurpose-wizard' | 'core' | 'assessment';

const HabitsPage = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<HabitsView>('splash');

  // Check if user has chosen to hide the splash screen
  useEffect(() => {
    const hideHabitsSplash = localStorage.getItem('hideHabitsSplash');
    if (hideHabitsSplash === 'true') {
      setCurrentView('options');
    }
  }, []);

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

  // Fetch user's focused habits
  const { data: focusedHabits } = useQuery({
    queryKey: ['focused-habits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('focused_habits')
        .select(`
          habit_id,
          habits (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Transform the data to match the FocusedHabits component interface
      return data?.map(item => ({
        id: item.habits.id,
        name: item.habits.name,
        description: item.habits.description
      })) || [];
    },
    enabled: !!user
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

  const handleSelectOption = (option: 'existing' | 'repurpose' | 'assessment') => {
    if (option === 'repurpose') {
      setCurrentView('repurpose-wizard');
    } else if (option === 'assessment') {
      setCurrentView('assessment');
    } else if (option === 'existing') {
      setCurrentView('existing');
    } else {
      // For now, we'll just set to core for existing
      // This can be implemented later with different content
      setCurrentView('core');
    }
  };


  if (currentView === 'splash') {
    return <HabitsSplash onStartJourney={handleStartJourney} />;
  }

  if (currentView === 'options') {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <HabitsJourneyOptions onSelectOption={handleSelectOption} />
      </div>
    );
  }

  if (currentView === 'assessment') {
    return <CoreOptimalHabitAssessment onBackToOptions={() => setCurrentView('options')} />;
  }

  if (currentView === 'existing') {
    return <ExistingHabitsAssessment onBackToOptions={() => setCurrentView('options')} />;
  }

  if (currentView === 'repurpose-wizard') {
    return <HabitRepurposeWizard onBackToOptions={() => setCurrentView('options')} />;
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
          onClick={() => setCurrentView('options')}
          variant="outline"
        >
          Back to Journey Options
        </Button>
      </div>

      {/* Show focused habits if user has any */}
      <FocusedHabits habits={focusedHabits || []} />

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
