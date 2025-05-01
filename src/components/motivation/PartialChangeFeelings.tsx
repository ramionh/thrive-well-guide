
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { Award } from "lucide-react";
import LoadingState from "./shared/LoadingState";

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
    nextStepName: "Prioritizing Change",
    transformData: (data) => {
      return {
        progress_steps: data.progressSteps,
        reward_ideas: data.rewardIdeas
      };
    },
    parseData: (data) => {
      console.log("Raw data from Partial Change Feelings:", data);
      return {
        progressSteps: data?.progress_steps || "",
        rewardIdeas: data?.reward_ideas || ""
      };
    }
  });

  // Only fetch data once on component mount
  useEffect(() => {
    if (!didInitialFetch.current) {
      console.log("PartialChangeFeelings: Fetching data on mount");
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
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Feelings Around Partial Change</h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-purple-800">
            Now that you have a realistic, attainable goal, how will you feel if you don't quite meet it? 
            Maybe you struggle to reach your target weight. Perhaps you only make it to the gym three times a week instead of five. 
            Achieving only part of your goal is not as satisfying as fulfilling it completely, but you should be proud of the steps you have taken, 
            and realize you are closer to achieving your goal than you were when you started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="progress-steps" className="block text-sm font-medium text-purple-700 mb-2">
              List some steps you have taken toward your goal, whether recently or in the past.
            </label>
            <Textarea
              id="progress-steps"
              rows={4}
              value={formData.progressSteps}
              onChange={(e) => updateForm("progressSteps", e.target.value)}
              className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="Examples: I started walking more, I cut back on sugary drinks..."
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="reward-ideas" className="block text-sm font-medium text-purple-700 mb-2">
              Celebrate these small victories! What are some ways you can reward yourself for your progress that won't break your bank or sabotage your success?
            </label>
            <Textarea
              id="reward-ideas"
              rows={4}
              value={formData.rewardIdeas}
              onChange={(e) => updateForm("rewardIdeas", e.target.value)}
              className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="Examples: A relaxing bath, watching a favorite show..."
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
