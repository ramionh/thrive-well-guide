import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const PersonalizedInsights: React.FC = () => {
  const { user } = useUser();

  // Fetch recent daily tracking data
  const { data: recentData } = useQuery({
    queryKey: ['insights-data', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('daily_health_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(14); // Last 2 weeks

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch habit assessment scores
  const { data: habitScores } = useQuery({
    queryKey: ['habit-scores', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_habit_scoring')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch existing habits assessments
  const { data: existingHabits } = useQuery({
    queryKey: ['existing-habits', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('existing_habits_assessment')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const generateInsights = () => {
    if (!recentData || recentData.length === 0) {
      return [{
        type: 'welcome',
        icon: Lightbulb,
        title: 'Welcome to Your Insights!',
        message: 'Start tracking your daily progress to receive personalized insights and recommendations.',
        color: 'text-blue-600'
      }];
    }

    const insights = [];
    
    // Sleep insights
    const sleepData = recentData.filter(d => d.sleep_hours).slice(0, 7);
    if (sleepData.length > 0) {
      const avgSleep = sleepData.reduce((acc, d) => acc + d.sleep_hours, 0) / sleepData.length;
      const poorSleepDays = sleepData.filter(d => d.sleep_adherence === 'red').length;
      
      if (avgSleep < 7) {
        insights.push({
          type: 'concern',
          icon: AlertCircle,
          title: 'Sleep Opportunity',
          message: `Your average sleep is ${avgSleep.toFixed(1)} hours. Consider aiming for 7-9 hours nightly for better recovery and energy.`,
          color: 'text-orange-600'
        });
      } else if (poorSleepDays === 0 && avgSleep >= 7.5) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Excellent Sleep Habits!',
          message: `You're averaging ${avgSleep.toFixed(1)} hours of sleep with consistent quality. Keep it up!`,
          color: 'text-green-600'
        });
      }
    }

    // Exercise insights
    const exerciseData = recentData.filter(d => d.exercise_minutes).slice(0, 7);
    if (exerciseData.length > 0) {
      const avgExercise = exerciseData.reduce((acc, d) => acc + d.exercise_minutes, 0) / exerciseData.length;
      const goodExerciseDays = exerciseData.filter(d => d.exercise_adherence === 'green').length;
      
      if (avgExercise < 30) {
        insights.push({
          type: 'concern',
          icon: AlertCircle,
          title: 'Exercise Opportunity',
          message: `You're averaging ${Math.round(avgExercise)} minutes of exercise daily. Try to gradually increase towards 30+ minutes.`,
          color: 'text-orange-600'
        });
      } else if (goodExerciseDays >= 5) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Strong Exercise Consistency!',
          message: `You've had ${goodExerciseDays} days of good exercise adherence this week. Excellent work!`,
          color: 'text-green-600'
        });
      }
    }

    // Habit scores insights
    if (habitScores && habitScores.length > 0) {
      const lowScoreCategories = habitScores.filter(score => score.score < 7);
      const highScoreCategories = habitScores.filter(score => score.score >= 8);
      
      if (lowScoreCategories.length > 0) {
        const category = lowScoreCategories[0];
        insights.push({
          type: 'improvement',
          icon: TrendingUp,
          title: 'Focus Area Identified',
          message: `Your ${category.category.toLowerCase().replace('_', ' ')} score is ${category.score}/10. This could be a great area to focus on for maximum impact.`,
          color: 'text-blue-600'
        });
      }
      
      if (highScoreCategories.length > 0) {
        insights.push({
          type: 'strength',
          icon: CheckCircle,
          title: 'Your Strength Areas',
          message: `You're doing great with ${highScoreCategories.map(h => h.category.toLowerCase().replace('_', ' ')).join(', ')}. Use these as a foundation for building other habits.`,
          color: 'text-green-600'
        });
      }
    }

    // Existing habits insights
    if (existingHabits && existingHabits.length > 0) {
      const recentAssessment = existingHabits[existingHabits.length - 1];
      insights.push({
        type: 'action',
        icon: Lightbulb,
        title: 'Latest Habit Insight',
        message: `You recently identified an opportunity in ${recentAssessment.category}: "${recentAssessment.identified_habit.substring(0, 100)}..."`,
        color: 'text-purple-600'
      });
    }

    // Consistency insights
    if (recentData.length >= 7) {
      const last7Days = recentData.slice(0, 7);
      const consistentDays = last7Days.filter(d => 
        d.exercise_adherence === 'green' && d.sleep_adherence === 'green'
      ).length;
      
      if (consistentDays >= 5) {
        insights.push({
          type: 'streak',
          icon: CheckCircle,
          title: 'Consistency Champion!',
          message: `You've had ${consistentDays} days of good adherence this week across multiple areas. Consistency is key to lasting change!`,
          color: 'text-green-600'
        });
      }
    }

    return insights.length > 0 ? insights : [{
      type: 'encourage',
      icon: Lightbulb,
      title: 'Keep Building Your Data',
      message: 'Continue tracking your progress daily to unlock more personalized insights and recommendations.',
      color: 'text-blue-600'
    }];
  };

  const insights = generateInsights();

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const IconComponent = insight.icon;
        return (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconComponent className={`h-5 w-5 ${insight.color}`} />
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
            </CardContent>
          </Card>
        );
      })}
      
      {insights.length > 1 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">
              💡 <strong>Pro tip:</strong> Focus on one area at a time for the best results. Small, consistent improvements compound over time!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedInsights;
