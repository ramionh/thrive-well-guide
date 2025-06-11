
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Habit } from "@/types/habit";

type StoplightValue = "red" | "yellow" | "green";

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  grade: string;
}

const CategoryScoresDisplay = () => {
  const { user } = useUser();

  // Fetch all habits
  const { data: habits, isLoading: habitsLoading } = useQuery({
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

  // Fetch user's existing scores
  const { data: existingScores, isLoading: scoresLoading } = useQuery({
    queryKey: ['user-habit-scores', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const calculateCategoryScores = (): CategoryScore[] => {
    if (!habits || !existingScores) return [];

    const habitScores: Record<string, StoplightValue> = {};
    existingScores.forEach(score => {
      habitScores[score.habit_id] = score.response as StoplightValue;
    });

    const categories = ['SLEEP', 'CALORIE_INTAKE', 'PROTEIN_INTAKE', 'ADAPTIVE_TRAINING', 'LIFESTYLE_GUARDRAILS'];
    
    return categories.map(category => {
      const categoryHabits = habits.filter(habit => habit.category === category);
      const maxScore = categoryHabits.length * 3;
      
      const score = categoryHabits.reduce((total, habit) => {
        const userScore = habitScores[habit.id];
        return total + (userScore === 'green' ? 3 : 0);
      }, 0);

      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      let grade = 'F';
      if (percentage >= 90) grade = 'A';
      else if (percentage >= 80) grade = 'B';
      else if (percentage >= 70) grade = 'C';
      else if (percentage >= 60) grade = 'D';

      return {
        category: category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        score,
        maxScore,
        grade
      };
    });
  };

  if (habitsLoading || scoresLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryScores = calculateCategoryScores();

  // Don't show if no scores exist yet
  if (!existingScores || existingScores.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-600" />
          Your Category Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryScores.map((categoryScore) => (
            <div key={categoryScore.category} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <h4 className="font-semibold text-lg mb-2">{categoryScore.category}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <span className="font-medium">{categoryScore.score} / {categoryScore.maxScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Grade:</span>
                  <span className={`font-bold text-lg px-2 py-1 rounded ${
                    categoryScore.grade === 'A' ? 'bg-green-100 text-green-800' :
                    categoryScore.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    categoryScore.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    categoryScore.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {categoryScore.grade}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${categoryScore.maxScore > 0 ? (categoryScore.score / categoryScore.maxScore) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryScoresDisplay;
