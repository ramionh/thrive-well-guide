
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface ObstaclesToOpportunitiesProps {
  onComplete?: () => void;
}

const ObstaclesToOpportunities: React.FC<ObstaclesToOpportunitiesProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_obstacles_opportunities",
    initialState: {
      situation: "",
      thoughts: "",
      feelings: "",
      likelihood: "",
      consequences: "",
      coping_statements: "",
      actions: "",
      opportunity_for_growth: ""
    },
    onSuccess: onComplete
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Obstacles to Opportunities</h2>
        
        <div className="space-y-5">
          <p className="text-gray-700">
            While there's no way to prevent all potential setbacks, there are ways to prepare for them. One especially useful preparation technique involves analyzing a potential obstacle before it occurs.
          </p>
          
          <p className="text-gray-700 mb-4">
            Start with one obstacle, but feel free to repeat this exercise for each barrier you are likely to encounter.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}>
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Describe a situation or trigger that concerns you most about your chances of success.
                </label>
                <Input
                  value={formData.situation || ""}
                  onChange={(e) => updateForm("situation", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Friends inviting me out for unhealthy meals and drinks that derail my fitness plan."
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Identify the unhelpful thoughts you are having.
                </label>
                <Textarea
                  value={formData.thoughts || ""}
                  onChange={(e) => updateForm("thoughts", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Just one cheat meal won't hurt. I don't want to be the boring one who always says no. I deserve to have fun too."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  What feelings do you have when you think about this situation?
                </label>
                <Textarea
                  value={formData.feelings || ""}
                  onChange={(e) => updateForm("feelings", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Anxious, conflicted, worried about being judged, fear of missing out."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  What is the likelihood of this situation actually happening?
                </label>
                <Textarea
                  value={formData.likelihood || ""}
                  onChange={(e) => updateForm("likelihood", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Very likely. My friends go out for dinner and drinks at least twice a week and always invite me."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  What are the consequences if it does occur?
                </label>
                <Textarea
                  value={formData.consequences || ""}
                  onChange={(e) => updateForm("consequences", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="I'll consume excess calories, feel guilty afterward, and possibly use it as an excuse to abandon my whole plan. One cheat meal often turns into several days of poor choices."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  What are some coping statements you can use to address the thoughts and feelings?
                </label>
                <Textarea
                  value={formData.coping_statements || ""}
                  onChange={(e) => updateForm("coping_statements", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="I can enjoy socializing without overindulging. I can suggest healthier restaurant options. I can eat a small healthy meal beforehand so I'm not starving."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  What actions can you take?
                </label>
                <Textarea
                  value={formData.actions || ""}
                  onChange={(e) => updateForm("actions", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Look at the menu beforehand and choose a healthy option. Drink water between alcoholic drinks or skip alcohol entirely. Suggest active social events like bowling or hiking instead of just meals."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-1">
                  Describe how this can be an opportunity for growth.
                </label>
                <Textarea
                  value={formData.opportunity_for_growth || ""}
                  onChange={(e) => updateForm("opportunity_for_growth", e.target.value)}
                  className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Learning to navigate social situations while maintaining my health goals is an important skill. Each time I make good choices in these situations, my confidence and resolve will grow stronger."
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

export default ObstaclesToOpportunities;
