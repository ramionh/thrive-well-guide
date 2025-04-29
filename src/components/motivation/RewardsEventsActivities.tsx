
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface RewardsEventsActivitiesProps {
  onComplete?: () => void;
}

const RewardsEventsActivities: React.FC<RewardsEventsActivitiesProps> = ({ onComplete }) => {
  const [activityRewards, setActivityRewards] = useState<string[]>(Array(5).fill(""));
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_activity_rewards",
    initialState: {
      activity_rewards: Array(5).fill("")
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    if (formData && formData.activity_rewards) {
      const savedRewards = formData.activity_rewards;
      // Ensure we always have at least 5 rewards
      if (savedRewards.length < 5) {
        const filledRewards = [
          ...savedRewards,
          ...Array(5 - savedRewards.length).fill("")
        ];
        setActivityRewards(filledRewards);
      } else {
        setActivityRewards(savedRewards);
      }
    }
  }, [formData]);
  
  const handleInputChange = (index: number, value: string) => {
    setActivityRewards(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("activity_rewards", activityRewards);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Rewards: Events and Activities</h2>
              
              <p className="text-gray-600 mb-6">
                Events and activities are another common reward category. For example, after a week of sticking to your workout schedule, a great reward might be taking an extra hour to yourself on the weekend. Or if your goal is to complete all your planned workouts for a month, your reward is signing up for that scenic hiking trip you've been wanting to do.
              </p>
              
              <p className="text-gray-600 mb-6">
                Review the list of rewards you completed in Step 67 and identify any events and activities. List them below. We want at least five "events/activities" rewards, so feel free to make additions to the list.
              </p>
              
              <div className="space-y-4">
                {activityRewards.map((reward, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      value={reward}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={`Event/activity reward ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                ))}
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

export default RewardsEventsActivities;
