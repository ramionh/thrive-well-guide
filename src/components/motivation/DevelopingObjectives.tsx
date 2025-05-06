
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { differenceInWeeks } from "date-fns";
import LoadingState from "./shared/LoadingState";

interface DevelopingObjectivesProps {
  onComplete?: () => void;
}

const DevelopingObjectives: React.FC<DevelopingObjectivesProps> = ({ onComplete }) => {
  const [objectives, setObjectives] = useState<string[]>(Array(5).fill(""));
  const { user } = useUser();
  
  // Get the user's current goal data
  const { data: goalData, isLoading: isLoadingGoal } = useCurrentGoal();
  
  // Get the measurable goal details
  const { data: measurableGoal, isLoading: isLoadingMeasurable } = useQuery({
    queryKey: ['measurable-goal', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_measurable_goal')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching measurable goal:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  // Fetch current body metrics
  const { data: currentMetrics } = useQuery({
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
    submitForm, 
    updateForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_goal_objectives",
    initialState: {
      objectives: Array(5).fill("")
    },
    parseData: (data) => {
      console.log("Raw data from motivation_goal_objectives:", data);
      
      let parsedObjectives: string[];
      
      if (Array.isArray(data.objectives)) {
        parsedObjectives = data.objectives;
        // Ensure we have 5 items
        if (parsedObjectives.length < 5) {
          parsedObjectives = [...parsedObjectives, ...Array(5 - parsedObjectives.length).fill("")];
        }
      } else {
        console.log("objectives is not an array or is missing, using default empty array");
        parsedObjectives = Array(5).fill("");
      }
      
      return {
        objectives: parsedObjectives
      };
    },
    transformData: (formData) => {
      return {
        objectives: objectives
      };
    },
    onSuccess: onComplete,
    stepNumber: 65,
    nextStepNumber: 66,
    stepName: "Developing Objectives for Your Goal",
    nextStepName: "Getting Ready for Change"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && Array.isArray(formData.objectives)) {
      console.log("Setting objectives from formData:", formData.objectives);
      setObjectives(formData.objectives);
    }
  }, [formData]);
  
  // Calculate weight loss goal and timeframe
  const calculateWeightLossGoal = () => {
    if (!measurableGoal?.goal_weight_lbs || !currentMetrics?.weight_lbs || !goalData) {
      return "I'd like to lose 10 pounds over the next eight weeks.";
    }
    
    const weightToLose = Math.round((currentMetrics.weight_lbs - measurableGoal.goal_weight_lbs) * 10) / 10;
    const weeksUntilGoal = Math.max(1, differenceInWeeks(new Date(goalData.target_date), new Date()));
    
    if (weightToLose > 0) {
      return `I'd like to lose ${weightToLose} pounds in ${weeksUntilGoal} weeks.`;
    } else if (weightToLose < 0) {
      return `I'd like to gain ${Math.abs(weightToLose)} pounds in ${weeksUntilGoal} weeks.`;
    } else {
      return `I'd like to maintain my current weight for the next ${weeksUntilGoal} weeks.`;
    }
  };
  
  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index] = value;
    setObjectives(updatedObjectives);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };
  
  // Set default example objectives with correct timeframe
  const getDefaultObjectives = () => {
    const weeksText = goalData 
      ? `${Math.max(1, differenceInWeeks(new Date(goalData.target_date), new Date()))} weeks`
      : "eight weeks";
      
    return [
      `I will weigh myself every morning and track it in a fitness app for the next ${weeksText}.`,
      `I will keep a daily log of everything I eat for the next ${weeksText}.`,
      `I will limit myself to 1,800 calories a day for the next ${weeksText}.`,
      `I will take a two-mile walk four times a week for the next ${weeksText}.`,
      `I will schedule an appointment with a personal trainer in the next seven days to help me develop an exercise program.`
    ];
  };
  
  const exampleObjectives = getDefaultObjectives();
  const goalText = calculateWeightLossGoal();
  
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Developing Objectives for Your Goal</h2>
        
        {(isLoading || isLoadingGoal || isLoadingMeasurable) ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-700 mb-4">
                Now that you have identified 10 actions you would be willing to take to reach your goal, 
                the next step is to convert them into measurable objectives.
              </p>
              
              <p className="text-gray-700 mb-4">
                Objectives, like your goal, should be specific, measurable, achievable, relevant, and time-bound. 
                For example:
              </p>
              
              <div className="bg-purple-50 p-4 rounded-md mb-4 text-gray-700 border border-purple-100">
                <p className="font-medium text-purple-700">Goal: {goalText}</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Objective 1: {exampleObjectives[0]}</li>
                  <li>Objective 2: {exampleObjectives[1]}</li>
                  <li>Objective 3: {exampleObjectives[2]}</li>
                  <li>Objective 4: {exampleObjectives[3]}</li>
                  <li>Objective 5: {exampleObjectives[4]}</li>
                </ul>
              </div>
              
              <div className="space-y-6 mt-8">
                <div className="space-y-3">
                  <p className="text-purple-700 font-medium">
                    Identify five objectives or actions you feel most confident you could take to help you reach your goal. This is your Action Plan:
                  </p>
                  
                  {objectives.map((objective, index) => (
                    <div key={index} className="space-y-1">
                      <label htmlFor={`objective-${index}`} className="text-sm font-medium text-purple-700">
                        Objective {index + 1}:
                      </label>
                      <Textarea
                        id={`objective-${index}`}
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        placeholder={`Write objective ${index + 1} here`}
                        className="h-20 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default DevelopingObjectives;
