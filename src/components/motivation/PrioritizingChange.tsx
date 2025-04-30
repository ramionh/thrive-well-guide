
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { List } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface PrioritizingChangeProps {
  onComplete?: () => void;
}

const PrioritizingChange: React.FC<PrioritizingChangeProps> = ({ onComplete }) => {
  const { data: goalData, isLoading: isGoalLoading } = useCurrentGoal();
  
  const {
    formData,
    isLoading,
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    new_activities: string;
    prioritized_activities: string;
  }>({
    tableName: 'motivation_prioritizing_change',
    initialState: {
      new_activities: '',
      prioritized_activities: '',
    },
    onSuccess: onComplete,
    stepNumber: 61,
    nextStepNumber: 64, // Setting "Where Are You Now" (ID: 64) as the next step
    parseData: (data) => {
      console.log("Raw data from Prioritizing Change:", data);
      return {
        new_activities: data.new_activities || '',
        prioritized_activities: data.prioritized_activities || ''
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const isPageLoading = isLoading || isGoalLoading;

  if (isPageLoading) {
    return <LoadingState />;
  }

  const goalDescription = goalData ? 
    `Transform from ${goalData.current_body_type?.name} to ${goalData.goal_body_type?.name} by ${new Date(goalData.target_date).toLocaleDateString()}` 
    : "Your transformation goal";

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <List className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-purple-800">Prioritizing the Change</h2>
          </div>
          
          {goalData && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
              <p className="text-purple-700 text-sm font-medium">Your Goal</p>
              <p className="text-purple-900">{goalDescription}</p>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            What are some activities you plan on doing that will help you achieve your goal? 
            (These are activities or tasks you did not list in the previous step.)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-activities" className="block text-sm font-medium text-gray-700 mb-1">
                New goal-related activities
              </Label>
              <Textarea
                id="new-activities"
                value={formData.new_activities}
                onChange={(e) => updateForm('new_activities', e.target.value)}
                rows={4}
                className="w-full p-2 border rounded-md"
                placeholder="List your new goal-related activities here..."
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="prioritized-activities" className="block text-sm font-medium text-gray-700 mb-1">
                Let's focus on the Important and Urgent priorities. In the box below, write at least one 
                activity from your new list, then add the 'important and urgent' activities you identified 
                in the previous step. Focus on these activities as you begin to work toward your goal. 
                Refer to this list when making schedule decisions; do these activities before any that 
                fall into the other quadrants.
              </Label>
              <div className="mt-2 mb-2 font-medium text-purple-800">IMPORTANT AND URGENT</div>
              <Textarea
                id="prioritized-activities"
                value={formData.prioritized_activities}
                onChange={(e) => updateForm('prioritized_activities', e.target.value)}
                rows={6}
                className="w-full p-2 border rounded-md"
                placeholder="List your important and urgent activities here..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrioritizingChange;
