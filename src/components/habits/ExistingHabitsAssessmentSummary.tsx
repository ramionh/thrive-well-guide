
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

  const completedCategories = [...new Set(assessments.map(a => a.category))];
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

        <div className="space-y-3">
          {assessments.slice(0, 3).map((assessment) => {
            const IconComponent = categoryIcons[assessment.category as keyof typeof categoryIcons];
            const categoryName = categoryNames[assessment.category as keyof typeof categoryNames];
            
            return (
              <div key={assessment.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <IconComponent className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{categoryName}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {assessment.identified_habit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {assessments.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{assessments.length - 3} more assessment{assessments.length - 3 > 1 ? 's' : ''}
          </p>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Last assessment: {new Date(assessments[0].created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExistingHabitsAssessmentSummary;
