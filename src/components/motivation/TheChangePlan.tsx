
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface TheChangePlanProps {
  onComplete?: () => void;
}

const TheChangePlan: React.FC<TheChangePlanProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_change_plan",
    initialState: {
      vision_statement: "",
      goals: "",
      action_steps: "",
      support_resources: "",
      obstacles_plan: "",
      monitoring_progress: "",
      rewards: ""
    },
    onSuccess: onComplete
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">The Change Plan</h2>
        
        <div className="space-y-5">
          <p className="text-gray-700 mb-6">
            Now that you've worked through many aspects of motivation, it's time to bring everything together into a comprehensive change plan. This plan will serve as your roadmap for success.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}>
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Vision Statement - What does success look like for you?
                </label>
                <Textarea
                  value={formData.vision_statement || ""}
                  onChange={(e) => updateForm("vision_statement", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="I see myself as someone who prioritizes my health, feels strong and energetic, and can enjoy physical activities without limitation."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Specific Goals - What measurable outcomes are you working toward?
                </label>
                <Textarea
                  value={formData.goals || ""}
                  onChange={(e) => updateForm("goals", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Exercise 4 days per week for at least 30 minutes. Maintain a daily calorie deficit of 300-500 calories. Increase protein intake to 30% of daily calories."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Action Steps - What specific actions will you take?
                </label>
                <Textarea
                  value={formData.action_steps || ""}
                  onChange={(e) => updateForm("action_steps", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Meal prep every Sunday. Schedule workouts in my calendar. Use a tracking app for food and exercise. Take stairs instead of elevators."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Support Resources - Who and what will support your journey?
                </label>
                <Textarea
                  value={formData.support_resources || ""}
                  onChange={(e) => updateForm("support_resources", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Weekly check-ins with my friend who is also on a fitness journey. Online fitness community for accountability. Fitness tracking app for monitoring progress."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Obstacles and Solutions - What barriers might arise and how will you address them?
                </label>
                <Textarea
                  value={formData.obstacles_plan || ""}
                  onChange={(e) => updateForm("obstacles_plan", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Barrier: Busy work schedule - Solution: Schedule shorter, more intense workouts and have backup home workout options. Barrier: Social events - Solution: Eat protein-rich snacks beforehand and choose healthier menu options."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Monitoring Progress - How will you track your success?
                </label>
                <Textarea
                  value={formData.monitoring_progress || ""}
                  onChange={(e) => updateForm("monitoring_progress", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Weekly weigh-ins. Monthly body measurements. Progress photos every two weeks. Daily tracking of food intake and exercise. Weekly review of goals and adjustments as needed."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Rewards - How will you celebrate milestones and achievements?
                </label>
                <Textarea
                  value={formData.rewards || ""}
                  onChange={(e) => updateForm("rewards", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="New workout clothes after one month of consistent exercise. Massage after reaching my first weight goal. Weekend trip after reaching my final goal."
                  rows={3}
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

export default TheChangePlan;
