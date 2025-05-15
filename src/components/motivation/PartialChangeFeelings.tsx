
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { HeartPulse } from "lucide-react";

interface PartialChangeFeelingsProps {
  onComplete: () => void;
}

const PartialChangeFeelings: React.FC<PartialChangeFeelingsProps> = ({ onComplete }) => {
  const initialState = {
    progressSteps: "",
    rewardIdeas: ""
  };
  
  const didInitialFetch = useRef(false);

  const {
    formData,
    isLoading,
    isSaving,
    error,
    updateForm,
    submitForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_partial_change_feelings",
    initialState,
    onSuccess: onComplete,
    stepNumber: 59,
    stepName: "Feelings Around Partial Change",
    nextStepNumber: 60,
    nextStepName: "Time Management",
    transformData: (data) => {
      return {
        progress_steps: data.progressSteps,
        reward_ideas: data.rewardIdeas
      };
    },
    parseData: (data) => {
      return {
        progressSteps: data?.progress_steps || "",
        rewardIdeas: data?.reward_ideas || ""
      };
    }
  });

  // Only fetch data once on component mount
  useEffect(() => {
    if (!didInitialFetch.current) {
      fetchData();
      didInitialFetch.current = true;
    }
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="p-6 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <div className="flex items-center gap-3 mb-4">
          <HeartPulse className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Feelings Around Partial Change</h2>
        </div>

        <div className="mb-6 space-y-4">
          <p>
            Change is rarely all-or-nothing. Most often, it happens in small steps over time. 
            It's important to recognize and celebrate partial progress rather than seeing change 
            as only successful when we've reached our end goal.
          </p>
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="font-semibold text-purple-800 mb-2">Embracing Progress</h3>
            <p className="text-purple-700">
              When we acknowledge the small victories along our journey, we build confidence, 
              reinforce positive behaviors, and create momentum that propels us forward.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="progress-steps" className="text-purple-700">
              What small steps of progress could you celebrate along your journey?
            </Label>
            <Textarea
              id="progress-steps"
              value={formData.progressSteps}
              onChange={(e) => updateForm("progressSteps", e.target.value)}
              className="mt-2 border-purple-300 focus:border-purple-500"
              rows={4}
              placeholder="E.g., Going to the gym twice this week, preparing healthy meals for 3 days..."
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="reward-ideas" className="text-purple-700">
              How might you reward yourself for these partial achievements?
            </Label>
            <Textarea
              id="reward-ideas"
              value={formData.rewardIdeas}
              onChange={(e) => updateForm("rewardIdeas", e.target.value)}
              className="mt-2 border-purple-300 focus:border-purple-500"
              rows={4}
              placeholder="E.g., A relaxing bath, watching a favorite show, buying a small item you've wanted..."
              disabled={isSaving}
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartialChangeFeelings;
