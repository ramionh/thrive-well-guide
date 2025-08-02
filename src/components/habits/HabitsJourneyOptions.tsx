
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, CheckCircle, Lock, Zap, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import CategoryScoresDisplay from "./CategoryScoresDisplay";
import ExistingHabitsAssessmentSummary from "./ExistingHabitsAssessmentSummary";
import HabitRepurposeSummary from "../dashboard/HabitRepurposeSummary";
import StreamlinedHabitAssessment from "./StreamlinedHabitAssessment";
import HabitProgressTracker from "./HabitProgressTracker";
import { useHabitJourneyProgress } from "@/hooks/useHabitJourneyProgress";
import { useClientFeatures } from "@/hooks/useClientFeatures";

interface HabitsJourneyOptionsProps {
  onSelectOption: (option: 'existing' | 'repurpose' | 'assessment') => void;
}

const HabitsJourneyOptions: React.FC<HabitsJourneyOptionsProps> = ({ onSelectOption }) => {
  const { user } = useUser();
  const [showQuickAssessment, setShowQuickAssessment] = useState(false);
  const { 
    currentStep, 
    progressSteps, 
    nextStepGuidance 
  } = useHabitJourneyProgress();
  const { isFeatureEnabled } = useClientFeatures();

  // Check if user has completed any habit assessment
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

  if (showQuickAssessment) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowQuickAssessment(false)}
            className="mb-4"
          >
            ← Back to Journey Overview
          </Button>
        </div>
        <StreamlinedHabitAssessment 
          onContinueToFull={() => {
            setShowQuickAssessment(false);
            onSelectOption('assessment');
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Habit Transformation Journey</h1>
        <p className="text-lg text-gray-600">
          Follow our guided process to build lasting habits that support your fitness goals
        </p>
      </div>

      {/* Progress Tracker */}
      <HabitProgressTracker 
        steps={progressSteps} 
        currentStepId={currentStep}
      />

      {/* Next Step Guidance Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-blue-800">{nextStepGuidance.title}</CardTitle>
          <CardDescription className="text-blue-700">
            {nextStepGuidance.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => {
              if (currentStep === 'quick-start') {
                setShowQuickAssessment(true);
              } else if (currentStep === 'full-assessment') {
                onSelectOption('assessment');
              } else if (currentStep === 'existing-habits') {
                onSelectOption('existing');
              } else if (currentStep === 'repurpose') {
                onSelectOption('repurpose');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {nextStepGuidance.action}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Alternative Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Full Assessment</CardTitle>
            <CardDescription>
              Complete evaluation of all core habits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectOption('assessment')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={currentStep === 'quick-start'}
            >
              {currentStep === 'quick-start' ? 'Complete Quick Start First' : 'Full Assessment'}
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
              Existing Habits
            </CardTitle>
            <CardDescription className={isAssessmentCompleted ? '' : 'text-gray-400'}>
              {isAssessmentCompleted 
                ? "Discover habits you already have"
                : "Complete assessment first"
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

        {isFeatureEnabled('repurpose_habits') && (
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
                Repurpose Habits
              </CardTitle>
              <CardDescription className={isAssessmentCompleted ? '' : 'text-gray-400'}>
                {isAssessmentCompleted 
                  ? "Transform habits for fitness goals"
                  : "Complete assessment first"
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
        )}
      </div>

      {/* Summary cards - only show if user has some progress */}
      {isAssessmentCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryScoresDisplay />
          </div>
          <div className="lg:col-span-1">
            <ExistingHabitsAssessmentSummary />
          </div>
          {isFeatureEnabled('repurpose_habits') && (
            <div className="lg:col-span-1">
              <HabitRepurposeSummary />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitsJourneyOptions;
