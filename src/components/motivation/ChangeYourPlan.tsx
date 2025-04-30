
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface ChangeYourPlanProps {
  onComplete?: () => void;
}

const ChangeYourPlan: React.FC<ChangeYourPlanProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_change_plan_adjustments",
    initialState: {
      plan_adjustments: ""
    },
    onSuccess: onComplete
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Change Your Plan</h2>
        
        <div className="space-y-5">
          <p className="text-gray-700">
            Your plan can change. Consistently evaluating your plan and making revisions is one way to remain focused on your goals. 
            Situations change, priorities can change, and new ideas can come along. No matter the reason, you can always make changes to the plan. 
            You can scrap the whole thing and start over, or change parts of the plan so they're more relevant. 
            All that is fine, and none of it means you're any less dedicated to your goal.
          </p>
          
          <p className="text-gray-700">
            To reevaluate your plan, revisit Step 86 (Monitoring Your Progress). Analyze your answers to see what is and isn't working, 
            and use that information to make adjustments to your Action Plan.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}>
            <div className="space-y-4">
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">
                  Plan adjustments
                </label>
                <Textarea
                  value={formData.plan_adjustments || ""}
                  onChange={(e) => updateForm("plan_adjustments", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Write about the adjustments you want to make to your plan..."
                  rows={8}
                />
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? "Saving..." : "Complete Step"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeYourPlan;
