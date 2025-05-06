
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PeopleReward {
  name: string;
  relationship: string;
  affirmation: string;
}

interface RewardsFromPeopleWhoMatterProps {
  onComplete?: () => void;
}

const RewardsFromPeopleWhoMatter: React.FC<RewardsFromPeopleWhoMatterProps> = ({ onComplete }) => {
  const [peopleRewards, setPeopleRewards] = useState<PeopleReward[]>(
    Array(5).fill({ name: "", relationship: "", affirmation: "" })
  );
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_people_rewards",
    initialState: {
      people_rewards: Array(5).fill({ name: "", relationship: "", affirmation: "" })
    },
    parseData: (data) => {
      console.log("Raw data from Rewards From People Who Matter:", data);
      
      let parsedRewards: PeopleReward[];
      
      if (Array.isArray(data.people_rewards)) {
        parsedRewards = data.people_rewards;
        // Make sure we have at least 5 rows
        if (parsedRewards.length < 5) {
          parsedRewards = [
            ...parsedRewards,
            ...Array(5 - parsedRewards.length).fill({ name: "", relationship: "", affirmation: "" })
          ];
        }
      } else {
        console.log("people_rewards is not an array, using default empty array");
        parsedRewards = Array(5).fill({ name: "", relationship: "", affirmation: "" });
      }
      
      return {
        people_rewards: parsedRewards
      };
    },
    transformData: (formData) => {
      // Make sure we're sending the rewards array properly to the database
      return {
        people_rewards: peopleRewards
      };
    },
    onSuccess: onComplete,
    stepNumber: 69,
    nextStepNumber: 70,
    stepName: "Rewards from People Who Matter",
    nextStepName: "Rewards: Events and Activities"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && formData.people_rewards) {
      console.log("Setting people rewards from formData:", formData.people_rewards);
      // Ensure we always have at least 5 rows
      const savedRewards = formData.people_rewards;
      if (savedRewards.length < 5) {
        const filledRewards = [
          ...savedRewards,
          ...Array(5 - savedRewards.length).fill({ name: "", relationship: "", affirmation: "" })
        ];
        setPeopleRewards(filledRewards);
      } else {
        setPeopleRewards(savedRewards);
      }
    }
  }, [formData]);
  
  const handleInputChange = (index: number, field: keyof PeopleReward, value: string) => {
    setPeopleRewards(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We don't need to update the form data separately since
    // the transformData function will use the current peopleRewards state
    submitForm();
  };
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Rewards from People Who Matter</h2>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-600 mb-6">
                Of course, things aren't the only kind of rewards that matter. Sometimes the best motivation is when another person recognizes your effort and gives you the proverbial pat on the back. Review your list of rewards from Step 67 and identify any that involve praise or recognition from someone who matters to you. List them below. We want at least five "people who matter" rewards, so feel free to make additions to the list.
              </p>
              
              <p className="text-gray-600 mb-6">
                In your list, make sure to mention each person's name, their relation to you, and the kind of affirmation you'd like to receive.
              </p>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-purple-700">NAME</TableHead>
                      <TableHead className="text-purple-700">RELATIONSHIP</TableHead>
                      <TableHead className="text-purple-700">AFFIRMATION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peopleRewards.map((reward, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={reward.name}
                            onChange={(e) => handleInputChange(index, "name", e.target.value)}
                            placeholder="Person's name"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={reward.relationship}
                            onChange={(e) => handleInputChange(index, "relationship", e.target.value)}
                            placeholder="Their relationship to you"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={reward.affirmation}
                            onChange={(e) => handleInputChange(index, "affirmation", e.target.value)}
                            placeholder="Affirmation you'd like"
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

export default RewardsFromPeopleWhoMatter;
