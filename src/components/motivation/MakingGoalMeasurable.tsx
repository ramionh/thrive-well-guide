
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
              In previous sections, you identified a goal that you want to address. The next step is to narrow that 
              larger goal into one that is specific, observable, and measurable. If you fine-tune your goal, 
              you can ensure you are getting the results you want.
            </p>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-gray-700 mb-2">
                Imagine your original goal was "I want to look better, feel better, and have more energy."
              </p>
              
              <p className="text-gray-700 mb-2">
                If we apply the SMART approach, we'll come up with a more specific goal: "I'd like to lose some weight so my clothes fit better."
              </p>
              
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li><strong>Specific:</strong> "I'd like to lose some weight." This goal is simple and significant.</li>
                <li><strong>Measurable:</strong> "I'd like to lose 20 pounds." To make this goal measurable, I specified the amount of weight to be lost.</li>
                <li><strong>Achievable:</strong> "I'd like to start by losing 10 pounds in the next two months." To make this goal achievable, I set a more realistic short-term goal, rather than a more dramatic one I'd be less likely to reach.</li>
                <li><strong>Relevant:</strong> "I really want to lose this weight within the next two months so my weight-loss plan is in place before the summer vacation season begins." This goal is relevant because it's a realistic goal that is important to me.</li>
                <li><strong>Time-bound:</strong> "I'd like to lose 10 pounds in the next eight weeks." This goal is now time-limited because I specified how much time I would dedicate toward it. This is now a SMART goal.</li>
              </ol>
            </div>
            
            <div>
              <label htmlFor="measurable-goal" className="block text-sm font-medium text-purple-700 mb-2">
                Let's try this with your goal. Rewrite it below using the SMART guidelines:
              </label>
              <Textarea
                id="measurable-goal"
                rows={6}
                value={formData.measurable_goal}
                onChange={(e) => updateForm("measurable_goal", e.target.value)}
                className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="Write your SMART goal here..."
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
