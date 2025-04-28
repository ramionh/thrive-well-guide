
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface PartialChangeFeelingsProps {
  onComplete: () => void;
}

const PartialChangeFeelings: React.FC<PartialChangeFeelingsProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    progress_steps: string;
    reward_ideas: string;
  }>({
    tableName: "motivation_partial_change_feelings",
    initialState: {
      progress_steps: "",
      reward_ideas: ""
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(e, onComplete);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-lg text-purple-800">
          Now that you have a realistic, attainable goal, how will you feel if you don't quite meet it? 
          Maybe you struggle to reach your target weight. Perhaps you only make it to the gym three times a week instead of five. 
          Achieving only part of your goal is not as satisfying as fulfilling it completely, but you should be proud of the steps you have taken, 
          and realize you are closer to achieving your goal than you were when you started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="progress-steps" className="block text-sm font-medium text-purple-700 mb-2">
            List some steps you have taken toward your goal, whether recently or in the past.
          </label>
          <Textarea
            id="progress-steps"
            rows={4}
            value={formData.progress_steps}
            onChange={(e) => updateForm("progress_steps", e.target.value)}
            className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            placeholder="Examples: I started walking more, I cut back on sugary drinks..."
          />
        </div>

        <div>
          <label htmlFor="reward-ideas" className="block text-sm font-medium text-purple-700 mb-2">
            Celebrate these small victories! What are some ways you can reward yourself for your progress that won't break your bank or sabotage your success?
          </label>
          <Textarea
            id="reward-ideas"
            rows={4}
            value={formData.reward_ideas}
            onChange={(e) => updateForm("reward_ideas", e.target.value)}
            className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            placeholder="Examples: A relaxing bath, watching a favorite show..."
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !formData.progress_steps.trim() || !formData.reward_ideas.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Complete Step"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PartialChangeFeelings;
