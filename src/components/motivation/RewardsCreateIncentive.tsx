
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface RewardsCreateIncentiveProps {
  onComplete?: () => void;
}

const RewardsCreateIncentive: React.FC<RewardsCreateIncentiveProps> = ({ onComplete }) => {
  const [rewards, setRewards] = useState<string[]>(Array(5).fill(""));
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_rewards_incentive",
    initialState: {
      rewards: Array(5).fill("")
    },
    parseData: (data) => {
      console.log("Raw data from Rewards Create Incentive:", data);
      
      // Ensure we properly extract the rewards array
      let parsedRewards: string[];
      
      if (Array.isArray(data.rewards)) {
        parsedRewards = data.rewards;
        // Make sure we have exactly 5 rewards
        if (parsedRewards.length < 5) {
          parsedRewards = [...parsedRewards, ...Array(5 - parsedRewards.length).fill("")];
        } else if (parsedRewards.length > 5) {
          parsedRewards = parsedRewards.slice(0, 5);
        }
      } else {
        console.log("Rewards is not an array, using default empty array");
        parsedRewards = Array(5).fill("");
      }
      
      return {
        rewards: parsedRewards
      };
    },
    transformData: (formData) => {
      // Make sure we're sending the rewards array properly to the database
      return {
        rewards: rewards
      };
    },
    onSuccess: onComplete,
    stepNumber: 67,
    nextStepNumber: 69,  // Set to 69 as the next step (Rewards from People Who Matter)
    stepName: "Rewards Create an Incentive to Change",
    nextStepName: "Rewards from People Who Matter"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && formData.rewards) {
      console.log("Setting rewards from formData:", formData.rewards);
      setRewards(formData.rewards);
    }
  }, [formData]);
  
  const handleRewardChange = (index: number, value: string) => {
    setRewards(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // We don't need to update the form data separately since
    // the transformData function will use the current rewards state
    submitForm();
  };
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Rewards Create an Incentive to Change</h2>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-600 mb-6">
                When you're trying to change a behavior, it's very important to plan how you will reward yourself if you 
                accomplish your goals. Tangible, meaningful rewards strengthen desirable behaviors and motivate you to stay on 
                track.
              </p>
              
              <p className="text-gray-600 mb-6">
                Over the next few exercises, we explore what rewards are important to you and how to put them into your plan.
              </p>
              
              <div className="space-y-4">
                <Label className="text-purple-700 font-medium block mb-4">
                  Think of five ways to finish this sentence: "If I stick to my fitness goal, I'll reward myself by doing this:"
                </Label>
                
                {rewards.map((reward, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`reward-${index}`} className="text-sm font-medium">
                      Reward {index + 1}
                    </Label>
                    <Input
                      id={`reward-${index}`}
                      value={reward}
                      onChange={(e) => handleRewardChange(index, e.target.value)}
                      placeholder={`Enter reward ${index + 1}`}
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

export default RewardsCreateIncentive;
