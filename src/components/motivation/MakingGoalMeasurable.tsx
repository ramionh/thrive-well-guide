
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface MakingGoalMeasurableProps {
  onComplete: () => void;
}

const MakingGoalMeasurable: React.FC<MakingGoalMeasurableProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    measurable_goal: string;
  }>({
    tableName: "motivation_measurable_goal",
    initialState: {
      measurable_goal: ""
    },
    onSuccess: onComplete,
    parseData: (data) => {
      return {
        measurable_goal: data?.measurable_goal || ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              To make progress, your fitness goal should be measurable. How will you track your progress? 
              What specific metrics will you use to know if you're succeeding?
            </p>
            
            <p className="text-md text-purple-600 italic">
              For example: "I'll track my workouts in a fitness app, aiming for 3-4 sessions per week. 
              I'll measure success by consistently hitting this target for 4 consecutive weeks."
            </p>
            
            <div>
              <label htmlFor="measurable-goal" className="block text-sm font-medium text-purple-700 mb-2">
                Your measurable goal
              </label>
              <Textarea
                id="measurable-goal"
                rows={6}
                value={formData.measurable_goal}
                onChange={(e) => updateForm("measurable_goal", e.target.value)}
                className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="Describe how you'll make your goal measurable..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving || !formData.measurable_goal?.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MakingGoalMeasurable;
