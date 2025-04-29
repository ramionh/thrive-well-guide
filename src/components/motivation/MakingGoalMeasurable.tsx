
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface MakingGoalMeasurableProps {
  onComplete?: () => void;
}

const MakingGoalMeasurable: React.FC<MakingGoalMeasurableProps> = ({ onComplete }) => {
  const [measurableGoal, setMeasurableGoal] = useState<string>("");
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_measurable_goal",
    initialState: {
      measurable_goal: ""
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    if (formData) {
      setMeasurableGoal(formData.measurable_goal || "");
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("measurable_goal", measurableGoal);
    submitForm();
  };
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Making Your Goal Measurable</h2>
              
              <p className="text-gray-600 mb-4">
                Vague goals like "get in shape" or "eat better" make it difficult to know if you're making 
                progress. Specific, measurable goals create clarity and allow you to track your success.
              </p>
              
              <p className="text-gray-600 mb-4">
                A good measurable goal includes:
                <br/>• A specific, quantifiable outcome (what exactly will change?)
                <br/>• A timeframe (by when?)
                <br/>• A way to measure progress (how will you know you're succeeding?)
              </p>
              
              <p className="text-gray-600 mb-6">
                Examples of measurable goals:
                <br/>• "I want to lose 10 pounds in 8 weeks."
                <br/>• "I want to increase my deadlift from 150 to 200 pounds in 3 months."
                <br/>• "I want to run a 5K in under 30 minutes by June 1st."
              </p>
              
              <div className="space-y-4">
                <label className="text-purple-700 font-medium">
                  Write your specific, measurable goal:
                </label>
                
                <Input
                  value={measurableGoal}
                  onChange={(e) => setMeasurableGoal(e.target.value)}
                  placeholder="I want to..."
                  className="w-full"
                />
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

export default MakingGoalMeasurable;
