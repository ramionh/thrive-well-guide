
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useClientFeatures } from '@/hooks/useClientFeatures';

const HabitRepurposeSummary = () => {
  const { user } = useUser();
  const { isFeatureEnabled } = useClientFeatures();

  const { data: habitRepurposeData, isLoading } = useQuery({
    queryKey: ['habitRepurposeSummary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const [unwantedRes, simpleIfThenRes] = await Promise.all([
        supabase.from('habit_repurpose_unwanted_habits').select('habit_description').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_simple_if_then').select('trigger_phrase, good_habit_phrase').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      // Only return data if we have at least a simple if-then plan (indicating completion)
      if (!simpleIfThenRes.data?.[0]) return null;

      return {
        unwantedHabit: unwantedRes.data?.[0] || null,
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

  if (!habitRepurposeData || !isFeatureEnabled('repurpose_habits')) {
    return null; // Don't show the card if no habit repurpose plan exists or feature is disabled
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Active Habit Repurpose Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <span className="text-sm font-medium text-gray-700">Changing:</span>
              <p className="text-gray-600 text-sm">{habitRepurposeData.unwantedHabit?.habit_description || "Your unwanted habit"}</p>
            </div>
          </div>

          <div className="flex items-center justify-center py-2">
            <ArrowRight className="h-4 w-4 text-blue-500" />
          </div>

          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="text-sm font-semibold text-blue-800 mb-1">Your If-Then Plan:</div>
            <div className="text-sm text-blue-700">
              If <span className="font-medium">"{habitRepurposeData.simpleIfThen?.trigger_phrase}"</span>, 
              then I will <span className="font-medium">"{habitRepurposeData.simpleIfThen?.good_habit_phrase}"</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Review your full plan in the Habits section
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitRepurposeSummary;
