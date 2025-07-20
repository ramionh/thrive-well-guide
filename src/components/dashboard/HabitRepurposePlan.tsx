
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

const HabitRepurposePlan = () => {
  const { user } = useUser();

  const { data: habitRepurposeData, isLoading } = useQuery({
    queryKey: ['habitRepurposeData', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const [goalsRes, valuesRes, unwantedRes, replacementRes, environmentRes, simpleIfThenRes] = await Promise.all([
        supabase.from('habit_repurpose_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_goal_values').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_unwanted_habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_replacements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_environment').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_simple_if_then').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      // Only return data if we have at least a simple if-then plan (indicating completion)
      if (!simpleIfThenRes.data?.[0]) return null;

      return {
        goal: goalsRes.data?.[0] || null,
        values: valuesRes.data?.[0] || null,
        unwantedHabit: unwantedRes.data?.[0] || null,
        replacement: replacementRes.data?.[0] || null,
        environment: environmentRes.data?.[0] || null,
        simpleIfThen: simpleIfThenRes.data?.[0] || null
      };
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Habit Repurpose Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!habitRepurposeData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Habit Repurpose Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No habit repurpose plan found. Complete the Habit Repurpose wizard to see your plan here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Your Active Habit Repurpose Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm">
          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-foreground">My Goal:</span>
            <span className="text-muted-foreground">{habitRepurposeData.goal?.goal_text || "N/A"}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-foreground">My "Why":</span>
            <span className="text-muted-foreground">{habitRepurposeData.values?.goal_values_text || "N/A"}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-foreground">Unwanted Habit:</span>
            <span className="text-muted-foreground">{habitRepurposeData.unwantedHabit?.habit_description || "N/A"}</span>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-semibold text-foreground">Replacement Habit:</span>
            <span className="text-muted-foreground">{habitRepurposeData.replacement?.replacement_habit || "N/A"}</span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-blue-800">My "If-Then" Plan:</span>
              <span className="text-blue-700 font-medium">
                If "{habitRepurposeData.simpleIfThen?.trigger_phrase}", then I will "{habitRepurposeData.simpleIfThen?.good_habit_phrase}".
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            Plan created: {habitRepurposeData.simpleIfThen?.created_at ? 
              new Date(habitRepurposeData.simpleIfThen.created_at).toLocaleDateString() : 
              'Unknown'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitRepurposePlan;
