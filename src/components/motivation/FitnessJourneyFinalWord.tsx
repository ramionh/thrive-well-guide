
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { CheckCircle } from "lucide-react";

interface FitnessJourneyFinalWordProps {
  onComplete?: () => void;
}

const FitnessJourneyFinalWord: React.FC<FitnessJourneyFinalWordProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving,
    submitForm 
  } = useMotivationForm({
    tableName: "motivation_final_word",
    initialState: {
      plan_adjustments: "",
      completed: false
    },
    transformData: (formData) => {
      return {
        plan_adjustments: formData.plan_adjustments,
        completed: true
      };
    },
    onSuccess: onComplete,
    stepNumber: 91,
    stepName: "A Final Word: Your Fitness Journey Begins Now!"
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Your Fitness Journey Begins Now!</h2>
        
        <div className="space-y-6">
          <p className="text-gray-700">
            Congratulations on completing your motivation journey! You've put in significant work understanding 
            your motivations, building confidence, creating plans, and preparing for your fitness transformation.
          </p>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 my-6">
            <h3 className="text-lg font-medium text-purple-800 mb-3">Key Takeaways:</h3>
            
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><span className="font-medium">Change is a process</span> - not a one-time event. Be patient with yourself.</li>
              <li><span className="font-medium">Your motivation will fluctuate</span> - and that's normal. Return to these exercises when needed.</li>
              <li><span className="font-medium">Small steps lead to big changes</span> - consistency matters more than intensity.</li>
              <li><span className="font-medium">Self-compassion is essential</span> - treat yourself with the same kindness you'd offer to a friend.</li>
              <li><span className="font-medium">Community supports success</span> - stay connected with others on similar journeys.</li>
              <li><span className="font-medium">Celebrate all victories</span> - both big milestones and small daily wins.</li>
            </ul>
          </div>
          
          <p className="text-gray-700">
            Now is the time to put everything you've learned into action. Remember that progress isn't always linear, 
            but with the strategies and insights you've gained, you're well-equipped to handle challenges and keep 
            moving forward on your fitness journey.
          </p>
          
          <p className="text-gray-700 font-medium">
            You've done the inner work. You have what it takes. Your journey to better health and fitness starts now!
          </p>
          
          <Button
            onClick={() => submitForm()}
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4"
          >
            {isSaving ? "Saving..." : "Complete Your Motivation Journey"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FitnessJourneyFinalWord;
