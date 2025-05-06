
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import LoadingState from "./shared/LoadingState";
import GoalDisplay from "./pros-cons/GoalDisplay";

interface MakingYourGoalMeasurableProps {
  onComplete?: () => void;
}

const MakingYourGoalMeasurable: React.FC<MakingYourGoalMeasurableProps> = ({ onComplete }) => {
  const [measurableGoal, setMeasurableGoal] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<string>("");
  const [goalBodyfat, setGoalBodyfat] = useState<string>("");
  const { user } = useUser();
  
  // Fetch the user's current weight and bodyfat from the most recent body type entry
  const { data: currentMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['current-body-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_body_types')
        .select('weight_lbs, bodyfat_percentage')
        .eq('user_id', user.id)
        .order('selected_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching current metrics:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    fetchData,
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_measurable_goal",
    initialState: {
      measurable_goal: "",
      goal_weight_lbs: null,
      goal_bodyfat_percentage: null
    },
    parseData: (data) => {
      console.log("Raw data from Measurable Goal:", data);
      return {
        measurable_goal: data.measurable_goal || "",
        goal_weight_lbs: data.goal_weight_lbs,
        goal_bodyfat_percentage: data.goal_bodyfat_percentage
      };
    },
    transformData: (formData) => {
      return {
        measurable_goal: measurableGoal,
        goal_weight_lbs: goalWeight ? parseFloat(goalWeight) : null,
        goal_bodyfat_percentage: goalBodyfat ? parseFloat(goalBodyfat) : null
      };
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData) {
      setMeasurableGoal(formData.measurable_goal || "");
      setGoalWeight(formData.goal_weight_lbs ? String(formData.goal_weight_lbs) : "");
      setGoalBodyfat(formData.goal_bodyfat_percentage ? String(formData.goal_bodyfat_percentage) : "");
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateForm("measurable_goal", measurableGoal);
    updateForm("goal_weight_lbs", goalWeight ? parseFloat(goalWeight) : null);
    updateForm("goal_bodyfat_percentage", goalBodyfat ? parseFloat(goalBodyfat) : null);
    
    submitForm();
  };
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading || isLoadingMetrics ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Making Your Goal Measurable</h2>
              
              <GoalDisplay />
              
              <div className="mt-6 mb-4">
                <p className="text-gray-600">
                  Vague goals like "get in shape" or "eat better" make it difficult to know if you're making 
                  progress. Specific, measurable goals create clarity and allow you to track your success.
                </p>
                
                <p className="text-gray-600 mt-4">
                  A good measurable goal includes:
                  <br/>• A specific, quantifiable outcome (what exactly will change?)
                  <br/>• A timeframe (by when?)
                  <br/>• A way to measure progress (how will you know you're succeeding?)
                </p>
                
                <div className="bg-purple-50 p-4 rounded-md my-4 text-gray-700">
                  <p className="font-medium mb-2">Examples of measurable goals:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"I want to lose 10 pounds in 8 weeks."</li>
                    <li>"I want to increase my deadlift from 150 to 200 pounds in 3 months."</li>
                    <li>"I want to run a 5K in under 30 minutes by June 1st."</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="font-semibold mb-2">Your Current Metrics</h3>
                <p>Current Weight: {currentMetrics?.weight_lbs ? `${currentMetrics.weight_lbs} lbs` : "Not recorded"}</p>
                <p>Current Body Fat: {currentMetrics?.bodyfat_percentage ? `${currentMetrics.bodyfat_percentage}%` : "Not recorded"}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="measurableGoal" className="text-purple-700 font-medium">
                    Write your specific, measurable goal:
                  </Label>
                  <Input
                    id="measurableGoal"
                    value={measurableGoal}
                    onChange={(e) => setMeasurableGoal(e.target.value)}
                    placeholder="I want to..."
                    className="w-full mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalWeight" className="text-purple-700 font-medium">
                      Goal Weight (lbs):
                    </Label>
                    <Input
                      id="goalWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      value={goalWeight}
                      onChange={(e) => setGoalWeight(e.target.value)}
                      placeholder="Target weight in pounds"
                      className="w-full mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goalBodyfat" className="text-purple-700 font-medium">
                      Goal Body Fat (%):
                    </Label>
                    <Input
                      id="goalBodyfat"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={goalBodyfat}
                      onChange={(e) => setGoalBodyfat(e.target.value)}
                      placeholder="Target body fat percentage"
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default MakingYourGoalMeasurable;
