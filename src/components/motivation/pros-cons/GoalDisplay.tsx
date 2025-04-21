
import React from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface GoalInfo {
  current_body_type: { name: string };
  goal_body_type: { name: string };
  target_date: string;
}

const GoalDisplay = () => {
  const { user } = useUser();

  const { data: goalInfo, isLoading } = useQuery({
    queryKey: ['goalInfo', user?.id],
    queryFn: async (): Promise<GoalInfo | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('goals')
        .select(`
          current_body_type:current_body_type_id(body_types!current_body_type_id(name)),
          goal_body_type:goal_body_type_id(body_types!goal_body_type_id(name)),
          target_date
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching goal:', error);
        return null;
      }

      // Transform the data to match the GoalInfo interface
      return {
        current_body_type: { 
          name: data.current_body_type.name 
        },
        goal_body_type: { 
          name: data.goal_body_type.name 
        },
        target_date: data.target_date
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-gray-500">Loading goal information...</p>
      </div>
    );
  }

  if (!goalInfo) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-gray-500">No goal information available</p>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">Your Fitness Goal</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Body Type:</span>
          <span className="font-medium text-gray-800">{goalInfo.current_body_type.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Goal Body Type:</span>
          <span className="font-medium text-gray-800">{goalInfo.goal_body_type.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Target Date:</span>
          <span className="font-medium text-gray-800">
            {format(new Date(goalInfo.target_date), 'PP')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalDisplay;
