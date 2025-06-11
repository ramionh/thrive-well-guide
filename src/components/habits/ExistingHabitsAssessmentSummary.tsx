
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Moon, Calculator, Drumstick, Dumbbell, Shield, Brain } from "lucide-react";

const ExistingHabitsAssessmentSummary = () => {
  const { user } = useUser();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['existing-habits-assessments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('existing_habits_assessment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const categoryIcons = {
    sleep: Moon,
    calories: Calculator,
    protein: Drumstick,
    training: Dumbbell,
    lifestyle: Shield
  };

  const categoryNames = {
    sleep: 'Sleep',
    calories: 'Calorie Intake',
    protein: 'Protein Intake',
    training: 'Adaptive Training',
    lifestyle: 'Lifestyle Guardrails'
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health Habits Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health Habits Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No assessments completed yet. Visit the Health Habit Identifier to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get the most recent assessment for each category (should only be one per category)
  const categoryAssessments = Object.keys(categoryNames).reduce((acc, category) => {
    const categoryAssessment = assessments.find(a => a.category === category);
    if (categoryAssessment) {
      acc[category] = categoryAssessment;
    }
    return acc;
  }, {} as Record<string, any>);

  const completedCategories = Object.keys(categoryAssessments);
  const totalCategories = Object.keys(categoryNames).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Health Habits Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Categories Assessed:</span>
          <span className="font-medium">{completedCategories.length}/{totalCategories}</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {Object.keys(categoryNames).map((category) => {
            const assessment = categoryAssessments[category];
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            const categoryName = categoryNames[category as keyof typeof categoryNames];
            
            return (
              <div key={category} className={`flex items-start gap-3 p-2 rounded-lg ${
                assessment ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <IconComponent className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  assessment ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${assessment ? 'text-green-800' : 'text-gray-500'}`}>
                    {categoryName}
                  </div>
                  {assessment ? (
                    <p className="text-xs text-green-700 line-clamp-2">
                      {assessment.identified_habit}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">Not assessed yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {completedCategories.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Last assessment: {new Date(Math.max(...assessments.map(a => new Date(a.created_at).getTime()))).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExistingHabitsAssessmentSummary;
