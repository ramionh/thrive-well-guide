
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GoalInfo {
  current_body_type: { name: string };
  goal_body_type: { name: string };
  target_date: string;
}

interface BodyTypeRange {
  body_type_id: string;
  bodyfat_range: string;
}

const GoalDisplay = () => {
  const { user } = useUser();
  const [genderSpecificRanges, setGenderSpecificRanges] = useState<Record<string, string>>({});

  // Fetch gender-specific body fat ranges
  useEffect(() => {
    const fetchGenderRanges = async () => {
      if (!user?.gender) return;
      
      try {
        const { data, error } = await supabase
          .from('gender_body_type_ranges')
          .select('body_type_id, bodyfat_range')
          .eq('gender', user.gender.toLowerCase());
          
        if (error) {
          console.error("Error fetching gender-specific ranges:", error);
          return;
        }
        
        if (data) {
          const ranges: Record<string, string> = {};
          data.forEach((item: BodyTypeRange) => {
            ranges[item.body_type_id] = item.bodyfat_range;
          });
          setGenderSpecificRanges(ranges);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    
    fetchGenderRanges();
  }, [user?.gender]);

  const { data: goalInfo } = useQuery({
    queryKey: ['goal'],
    queryFn: async (): Promise<GoalInfo | null> => {
      if (!user) return null;

      // Updated query with explicit joins to resolve the ambiguity
      const { data, error } = await supabase
        .from('goals')
        .select(`
          target_date,
          current_body_type_id,
          goal_body_type_id,
          current_body_type:body_types!current_body_type_id(id, name),
          goal_body_type:body_types!goal_body_type_id(id, name)
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error("Error fetching goal:", error);
        return null;
      }

      return data as unknown as GoalInfo;
    },
    enabled: !!user
  });

  if (!goalInfo) return null;

  const formattedDate = new Date(goalInfo.target_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Transformation Goal</h3>
          <p className="text-purple-600">
            Transform from {goalInfo.current_body_type.name} to {goalInfo.goal_body_type.name} by {formattedDate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalDisplay;
