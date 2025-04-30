
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface DevelopingObjectivesProps {
  onComplete?: () => void;
}

const DevelopingObjectives: React.FC<DevelopingObjectivesProps> = ({ onComplete }) => {
  const [actionGoal, setActionGoal] = useState("");
  const [objectives, setObjectives] = useState<string[]>(Array(5).fill(""));
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_goal_objectives",
    initialState: {
      action_goal: "",
      objectives: Array(5).fill("")
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    if (formData) {
      setActionGoal(formData.action_goal || "");
      setObjectives(formData.objectives || Array(5).fill(""));
    }
  }, [formData]);
  
  const handleObjectiveChange = (index: number, value: string) => {
    setObjectives(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("action_goal", actionGoal);
    updateForm("objectives", objectives);
    submitForm();
  };
  
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Developing Objectives for Your Goal</h2>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-gray-700 mb-4">
                Now that you have identified 10 actions you would be willing to take to reach your goal, 
                the next step is to convert them into measurable objectives.
              </p>
              
              <p className="text-gray-700 mb-4">
                Objectives, like your goal, should be specific, measurable, achievable, relevant, and time-bound. 
                For example:
              </p>
              
              <div className="bg-purple-50 p-4 rounded-md mb-4 text-gray-700 border border-purple-100">
                <p className="font-medium text-purple-700">Goal: I'd like to lose 10 pounds over the next eight weeks.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Objective 1: I will weigh myself every morning and track it in a fitness app for the next eight weeks.</li>
                  <li>Objective 2: I will keep a daily log of everything I eat for the next eight weeks.</li>
                  <li>Objective 3: I will limit myself to 1,800 calories a day for the next eight weeks.</li>
                  <li>Objective 4: I will take a two-mile walk four times a week for the next eight weeks.</li>
                  <li>Objective 5: I will schedule an appointment with a personal trainer in the next seven days to help me develop an exercise program.</li>
                </ul>
              </div>
              
              <div className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="action-goal" className="text-purple-700 font-medium">
                    Let's try this with your goal. Rewrite your goal below:
                  </Label>
                  <Input
                    id="action-goal"
                    value={actionGoal}
                    onChange={(e) => setActionGoal(e.target.value)}
                    placeholder="Write your goal here"
                    className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-purple-700 font-medium">
                    Identify five objectives or actions you feel most confident you could take to help you reach your goal. This is your Action Plan:
                  </Label>
                  
                  {objectives.map((objective, index) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`objective-${index}`} className="text-sm font-medium text-purple-700">
                        Objective {index + 1}:
                      </Label>
                      <Textarea
                        id={`objective-${index}`}
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        placeholder={`Write objective ${index + 1} here`}
                        className="h-20 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default DevelopingObjectives;
