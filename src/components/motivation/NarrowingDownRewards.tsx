
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import LoadingState from "./shared/LoadingState";

interface NarrowingDownRewardsProps {
  onComplete?: () => void;
}

const NarrowingDownRewards: React.FC<NarrowingDownRewardsProps> = ({ onComplete }) => {
  const [topRewards, setTopRewards] = useState<string[]>(Array(5).fill(""));
  const { user } = useUser();
  const [previousRewards, setPreviousRewards] = useState<string[]>([]);
  
  // Fetch previous rewards
  useEffect(() => {
    if (user) {
      const fetchPreviousRewards = async () => {
        try {
          // Fetch rewards from motivation_rewards_incentive
          const { data: incentiveData, error: incentiveError } = await supabase
            .from('motivation_rewards_incentive')
            .select('rewards')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (incentiveError) {
            console.error("Error fetching incentive rewards:", incentiveError);
          }
          
          // Fetch rewards from motivation_people_rewards
          const { data: peopleData, error: peopleError } = await supabase
            .from('motivation_people_rewards')
            .select('people_rewards')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (peopleError) {
            console.error("Error fetching people rewards:", peopleError);
          }
          
          // Fetch rewards from motivation_activity_rewards
          const { data: activityData, error: activityError } = await supabase
            .from('motivation_activity_rewards')
            .select('activity_rewards')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (activityError) {
            console.error("Error fetching activity rewards:", activityError);
          }
          
          // Combine all rewards
          const allRewards = [
            ...(incentiveData?.rewards || []),
            ...(peopleData?.people_rewards || []),
            ...(activityData?.activity_rewards || [])
          ].filter(reward => reward && reward.trim() !== '');
          
          setPreviousRewards(allRewards);
        } catch (error) {
          console.error("Error fetching previous rewards:", error);
        }
      };
      
      fetchPreviousRewards();
    }
  }, [user]);
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_top_rewards",
    initialState: {
      top_rewards: Array(5).fill("")
    },
    parseData: (data) => {
      return {
        top_rewards: Array.isArray(data.top_rewards) ? data.top_rewards : Array(5).fill("")
      };
    },
    onSuccess: onComplete,
    stepNumber: 71,
    nextStepNumber: 72,
    stepName: "Narrowing Down the Rewards",
    nextStepName: "Get Organized"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && formData.top_rewards) {
      const savedRewards = formData.top_rewards;
      // Ensure we always have at least 5 rewards
      if (savedRewards.length < 5) {
        const filledRewards = [
          ...savedRewards,
          ...Array(5 - savedRewards.length).fill("")
        ];
        setTopRewards(filledRewards);
      } else {
        setTopRewards(savedRewards);
      }
    }
  }, [formData]);
  
  const handleInputChange = (index: number, value: string) => {
    setTopRewards(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("top_rewards", topRewards);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Narrowing Down the Rewards</h2>
              
              <div className="space-y-4 text-gray-600">
                <p className="mb-4">
                  In the last three exercises, you identified potential rewards that can help you stay focused on reaching your fitness goal. The final step is narrowing this down to five meaningful, tangible rewards.
                </p>
                
                {previousRewards.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg mb-4">
                    <p className="font-medium text-purple-700 mb-2">Your previously identified rewards:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {previousRewards.map((reward, index) => (
                        <li key={index}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <p className="mb-4">Some factors to consider include:</p>
                
                <ol className="list-decimal ml-5 space-y-2">
                  <li>
                    <strong>Do you have the resources to obtain this reward promptly?</strong> Short-term rewards are immediately available to you. Long-term rewards involve many factors, such as money and free time, and may take some time to plan. For example, if your reward is to sleep in, check your calendar and identify a day in the next week or two when this is feasible. If your reward is a beach vacation, however, it may take longer to acquire the money and vacation time needed to take the trip. Both kinds of rewards can be positive motivators. Be clear on which category each of your rewards falls into.
                  </li>
                  <li>
                    <strong>Are you willing to withhold this reward?</strong> Don't choose something that is functional and essential for your day-to-day life. For example, if your running shoes need replacement, don't make that contingent on completing your goal. Instead, get new shoes now, and try choosing a goal that is more pleasurable.
                  </li>
                  <li>
                    <strong>Is this reward significant?</strong> A powerful reward motivates you to work hard and stay focused. It shouldn't be something you do on a regular basis, like buying a protein shake or checking your social media account. Make sure it genuinely feels special.
                  </li>
                </ol>
              </div>
              
              <div className="mt-6">
                <Label className="text-purple-700 font-medium block mb-4">
                  List your top five rewards or incentives below. Include at least one long-term reward.
                </Label>
                
                <div className="space-y-4">
                  {topRewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <Input
                        value={reward}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder={`Top reward ${index + 1}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
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

export default NarrowingDownRewards;
