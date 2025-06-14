
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

export type HabitJourneyStep = 'quick-start' | 'full-assessment' | 'existing-habits' | 'repurpose' | 'completed';

interface HabitProgressStep {
  id: HabitJourneyStep;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked' | 'available';
  progress?: number;
}

export const useHabitJourneyProgress = () => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState<HabitJourneyStep>('quick-start');

  // Check completion status of various steps
  const { data: quickAssessmentComplete } = useQuery({
    queryKey: ['quick-assessment-complete', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      // Check if user has completed the priority habits (quick assessment)
      const priorityHabitNumbers = [1, 5, 10, 15, 20, 25, 30, 35];
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('habit_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Check if we have at least some priority habits scored
      return data && data.length >= 5; // At least 5 habits scored
    },
    enabled: !!user
  });

  const { data: fullAssessmentComplete } = useQuery({
    queryKey: ['full-assessment-complete', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Full assessment means scoring a significant number of habits
      return data && data.length >= 20;
    },
    enabled: !!user
  });

  const { data: existingHabitsComplete } = useQuery({
    queryKey: ['existing-habits-complete', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('existing_habits_assessment')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user
  });

  // Determine current step based on completion status
  useEffect(() => {
    if (!quickAssessmentComplete) {
      setCurrentStep('quick-start');
    } else if (!fullAssessmentComplete) {
      setCurrentStep('full-assessment');
    } else if (!existingHabitsComplete) {
      setCurrentStep('existing-habits');
    } else {
      setCurrentStep('repurpose');
    }
  }, [quickAssessmentComplete, fullAssessmentComplete, existingHabitsComplete]);

  const getProgressSteps = (): HabitProgressStep[] => {
    return [
      {
        id: 'quick-start',
        title: 'Quick Start Assessment',
        description: 'Rate your most critical habits (2 minutes)',
        status: quickAssessmentComplete ? 'completed' : 'current'
      },
      {
        id: 'full-assessment',
        title: 'Complete Assessment',
        description: 'Full evaluation of all core habits',
        status: fullAssessmentComplete 
          ? 'completed' 
          : quickAssessmentComplete 
          ? 'current' 
          : 'locked'
      },
      {
        id: 'existing-habits',
        title: 'Discover Existing Habits',
        description: 'Identify habits you already have',
        status: existingHabitsComplete 
          ? 'completed' 
          : fullAssessmentComplete 
          ? 'current' 
          : 'locked'
      },
      {
        id: 'repurpose',
        title: 'Repurpose & Optimize',
        description: 'Transform habits to align with fitness goals',
        status: existingHabitsComplete ? 'current' : 'locked'
      }
    ];
  };

  const getNextStepGuidance = (): { title: string; description: string; action: string } => {
    switch (currentStep) {
      case 'quick-start':
        return {
          title: "Let's Start Your Habit Journey!",
          description: "Begin with a quick 2-minute assessment of your most impactful habits to get immediate insights.",
          action: "Start Quick Assessment"
        };
      case 'full-assessment':
        return {
          title: "Ready for the Full Picture?",
          description: "Great start! Now let's assess all your core habits for comprehensive insights.",
          action: "Continue to Full Assessment"
        };
      case 'existing-habits':
        return {
          title: "Discover Your Current Habits",
          description: "Let's identify the positive habits you already have in place.",
          action: "Explore Existing Habits"
        };
      case 'repurpose':
        return {
          title: "Transform Your Habits",
          description: "Now let's optimize your existing habits to accelerate your fitness goals.",
          action: "Repurpose Habits"
        };
      default:
        return {
          title: "Journey Complete!",
          description: "You've completed your habit assessment journey.",
          action: "View Results"
        };
    }
  };

  return {
    currentStep,
    setCurrentStep,
    progressSteps: getProgressSteps(),
    nextStepGuidance: getNextStepGuidance(),
    isLoading: false
  };
};
