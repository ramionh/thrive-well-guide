
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
                  placeholder="I want to feel stronger, more energetic, and confident in my physical abilities."
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
                  placeholder="Lose 15 pounds and be able to run a 5K without stopping. Have more energy for activities with friends, and feel better in my clothes."
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
                  placeholder="1. Schedule 3 workouts per week on my calendar
2. Track all my meals in a fitness app
3. Prepare healthy meals in advance for busy days
4. Drink water instead of sugary beverages
5. Join a local running group
6. Get at least 7 hours of sleep each night
7. Take progress photos once a month"
                  rows={7}
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
                  placeholder="Support System:
→ Join a running club to meet people who share my goals
→ Ask my partner to work out with me on weekends
→ Schedule regular check-ins with my personal trainer
→ Share my progress with close friends who are supportive

My Resources:
→ I have good running shoes and workout clothes
→ My apartment complex has a fitness center I can use
→ I can afford a basic gym membership
→ I have a fitness app on my phone to track progress"
                  rows={8}
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
                  placeholder="Barriers:
1. Work stress and long hours making it hard to maintain energy for workouts
2. Social events with unhealthy food options
3. Potential injury or illness interrupting my routine

Getting Back on Track:
1. Remind myself that perfect consistency isn't required for progress
2. Be honest with myself about setbacks and adjust my plan as needed
3. Look at this plan to revisit my reasons and resources"
                  rows={6}
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
                  placeholder="Weekly weigh-ins
Monthly body measurements
Progress photos every two weeks
Daily tracking of food intake and exercise
Weekly review of goals and adjustments as needed"
                  rows={5}
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
                  placeholder="→ New workout clothes after one month of consistent exercise
→ Weekend hiking trip after losing 10 pounds
→ Massage after completing my first 5K
→ New fitness tracker when I reach my goal weight"
                  rows={4}
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
