
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActionItem {
  text: string;
  rating: number;
}

interface IdentifyingStepsToGoalProps {
  onComplete?: () => void;
}

const IdentifyingStepsToGoal: React.FC<IdentifyingStepsToGoalProps> = ({ onComplete }) => {
  const [actions, setActions] = useState<ActionItem[]>(
    Array(10).fill(null).map(() => ({ text: "", rating: 1 }))
  );
  
  const { 
    formData,
    isLoading, 
    isSaving,
    fetchData,
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_steps_to_goal",
    initialState: {
      actions: []
    },
    parseData: (data) => {
      console.log("Raw data from Steps to Goal:", data);
      return {
        actions: data.actions || Array(10).fill(null).map(() => ({ text: "", rating: 1 }))
      };
    },
    onSuccess: onComplete,
    stepNumber: 65,
    nextStepNumber: 66,
    stepName: "Identifying the Steps to Reach Your Goal",
    nextStepName: "Getting Ready"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && Array.isArray(formData.actions) && formData.actions.length > 0) {
      console.log("Setting actions from formData:", formData.actions);
      setActions(formData.actions);
    }
  }, [formData]);
  
  const handleActionChange = (index: number, value: string) => {
    setActions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], text: value };
      return updated;
    });
  };
  
  const handleRatingChange = (index: number, value: string) => {
    setActions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], rating: parseInt(value, 10) };
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("actions", actions);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Identifying the Steps to Reach Your Goal</h2>
              
              <p className="text-gray-600 mb-4">
                Writing a specific, measurable goal is the essential first step toward successful change. 
                The goal sets your destination, but it does not specify all the actions you are going to take 
                to reach that destination. Let's revisit our example goal: "I'd like to lose 10 pounds in the next eight weeks." 
                While this goal does a good job identifying the destination, it doesn't specify the actions needed to get there. 
                To figure that out, we need to brainstorm the steps that might help us lose 10 pounds over the next two months.
              </p>
              
              <p className="text-gray-600 mb-4">
                There are no right answers when you're brainstorming. You're simply trying to come up with as many potential 
                solutions as possible. They don't have to be perfect. You don't even have to love the ideas. You might want 
                to research before you brainstorm, or simply list some ideas and research them later. The important thing is 
                to let yourself think about all the ways you might achieve your goal.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-md mb-4 text-gray-700">
                <p className="font-medium mb-2">Here's what a brainstorm about losing 10 pounds in eight weeks might look like:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Start a walking program</li>
                  <li>Start a running program</li>
                  <li>Join group fitness classes (Zumba, spinning, HIIT)</li>
                  <li>Eat fewer carbohydrates</li>
                  <li>Eat fewer fats</li>
                  <li>Try a ketogenic diet</li>
                  <li>Eat fewer calories</li>
                  <li>Increase daily steps</li>
                  <li>Do more active chores and housework</li>
                  <li>Keep a daily food journal</li>
                </ol>
              </div>
              
              <div className="mt-6">
                <Label className="text-purple-700 font-medium block mb-4">
                  Brainstorm a list of 10 actions you could take to reach your goal and write them below. Rate each on a scale of 1 to 5. 
                  A score of 1 indicates you are unsure or unwilling to take that action, while a score of 5 indicates you are confident you could take that action.
                </Label>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mt-2">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 bg-purple-100 text-purple-800 rounded-tl-md">#</th>
                        <th className="text-left py-2 px-4 bg-purple-100 text-purple-800">ACTION</th>
                        <th className="text-left py-2 px-4 bg-purple-100 text-purple-800 rounded-tr-md">RATING</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actions.map((action, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                          <td className="py-3 px-4">
                            <Input
                              value={action.text}
                              onChange={(e) => handleActionChange(index, e.target.value)}
                              placeholder={`Action ${index + 1}`}
                              className="w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={action.rating.toString()}
                              onValueChange={(value) => handleRatingChange(index, value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default IdentifyingStepsToGoal;
