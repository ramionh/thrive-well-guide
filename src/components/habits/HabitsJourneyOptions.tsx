
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, CheckCircle, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import CategoryScoresDisplay from "./CategoryScoresDisplay";
import ExistingHabitsAssessmentSummary from "./ExistingHabitsAssessmentSummary";
import HabitRepurposeSummary from "../dashboard/HabitRepurposeSummary";

interface HabitsJourneyOptionsProps {
  onSelectOption: (option: 'existing' | 'repurpose' | 'assessment') => void;
}

const HabitsJourneyOptions: React.FC<HabitsJourneyOptionsProps> = ({ onSelectOption }) => {
  const { user } = useUser();

  // Check if user has completed the habit assessment
  const { data: hasCompletedAssessment, isLoading } = useQuery({
    queryKey: ['user-habit-assessment-status', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      
      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user
  });

  const isAssessmentCompleted = !isLoading && hasCompletedAssessment;

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Habit Journey Path</h1>
        <p className="text-lg text-gray-600">
          Start with the Core Optimal Habits survey, move to Learn your existing habits and finish with Repurpose your habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Core Optimal Habit Assessment</CardTitle>
            <CardDescription>
              Rate yourself on each core habit and get a score for each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectOption('assessment')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Take Assessment
            </Button>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow ${isAssessmentCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isAssessmentCompleted ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {isAssessmentCompleted ? (
                <Brain className="h-6 w-6 text-blue-600" />
              ) : (
                <Lock className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <CardTitle className={isAssessmentCompleted ? '' : 'text-gray-500'}>
              Learn Your Existing Habits
            </CardTitle>
            <CardDescription className={isAssessmentCompleted ? '' : 'text-gray-400'}>
              {isAssessmentCompleted 
                ? "Discover and understand the habits you already have in your daily routine"
                : "Complete the assessment first to unlock this section"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => isAssessmentCompleted && onSelectOption('existing')}
              className="w-full"
              variant="outline"
              disabled={!isAssessmentCompleted}
            >
              {isAssessmentCompleted ? "Explore Existing Habits" : "Assessment Required"}
            </Button>
          </CardContent>
        </Card>

        <Card className={`hover:shadow-lg transition-shadow ${isAssessmentCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              isAssessmentCompleted ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {isAssessmentCompleted ? (
                <RefreshCw className="h-6 w-6 text-green-600" />
              ) : (
                <Lock className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <CardTitle className={isAssessmentCompleted ? '' : 'text-gray-500'}>
              Repurpose Your Habits
            </CardTitle>
            <CardDescription className={isAssessmentCompleted ? '' : 'text-gray-400'}>
              {isAssessmentCompleted 
                ? "Transform existing habits to better align with your fitness goals"
                : "Complete the assessment first to unlock this section"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => isAssessmentCompleted && onSelectOption('repurpose')}
              className="w-full"
              variant="outline"
              disabled={!isAssessmentCompleted}
            >
              {isAssessmentCompleted ? "Repurpose Habits" : "Assessment Required"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryScoresDisplay />
        <ExistingHabitsAssessmentSummary />
      </div>

      <HabitRepurposeSummary />
    </div>
  );
};

export default HabitsJourneyOptions;
