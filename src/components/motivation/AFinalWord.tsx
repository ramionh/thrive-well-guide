
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { CheckCircle } from "lucide-react";

interface AFinalWordProps {
  onComplete?: () => void;
}

const AFinalWord: React.FC<AFinalWordProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [planAdjustments, setPlanAdjustments] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Use the shared motivationForm hook for data handling
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_final_word",
    initialState: {
      planAdjustments: ""
    },
    parseData: (data) => {
      console.log("Raw data from A Final Word:", data);
      return {
        planAdjustments: data.plan_adjustments || ""
      };
    },
    transformData: (formData) => {
      return {
        plan_adjustments: planAdjustments
      };
    },
    onSuccess: () => {
      setIsCompleted(true);
      if (onComplete) onComplete();
    },
    stepNumber: 91,
    stepName: "A Final Word: Your Fitness Journey Begins Now!"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData && formData.planAdjustments) {
      setPlanAdjustments(formData.planAdjustments);
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };
  
  const handleDashboardClick = () => {
    navigate("/dashboard");
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-800">A Final Word: Your Fitness Journey Begins Now!</h2>
          
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <p className="text-green-700">
                Congratulations! You've completed your motivation journey!
              </p>
            </div>
          )}
          
          <div className="space-y-4 text-gray-700">
            <p>
              Congratulations! You've completed all the steps to transform your motivational mindset around fitness and body aesthetics. 
              The work you've done here—thinking deeply, preparing mentally, and creating your action plan—has set you up for success in sculpting the physique you desire.
            </p>
            <p>
              While your ultimate fitness goal may remain constant—whether it's building lean muscle, achieving defined abs, or creating a balanced, aesthetic physique—the path 
              to get there will have natural ebbs and flows. This is completely normal in any fitness journey. You can return to this program anytime to revisit different sections 
              when you need guidance. If your aesthetic goals evolve, go back to "Starting Point" and "Charting Your Path" to reassess your fitness desires and priorities. If you're 
              committed to your physical transformation but struggle with your workout or nutrition plan, revisit "Active Change" to refine your approach.
            </p>
            <p>
              Sustained motivation throughout your fitness journey isn't always easy. No fitness coach or personal trainer can keep you disciplined 100 percent of the time—that power 
              lies within you. But I can promise that persistence in finding and refining a fitness routine that works for your body will pay dividends in muscle development, definition, 
              and overall aesthetic improvement. Stay consistent, and continue exploring different training techniques and nutrition strategies you've discovered here or through your own research.
            </p>
            <p>
              Remember, even elite bodybuilders and fitness models ask for help. Whether you completed many exercises in this program or just a few, seeking guidance from a certified 
              personal trainer or nutritionist can help you overcome any barriers to achieving your ideal physique. If you're comfortable, ask fitness-minded friends for recommendations. 
              Look for professionals with experience in aesthetic body development and the specific goals you want to achieve. There's never a wrong time to work on transforming your body, 
              and there's never a wrong time to ask for expert guidance on your fitness journey.
            </p>
          </div>
        </div>
        
        {!isCompleted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="planAdjustments" className="text-purple-700 font-medium">
                As you complete your journey, reflect on any plan adjustments you'd like to make moving forward:
              </Label>
              <Textarea
                id="planAdjustments"
                placeholder="Write about any adjustments to your fitness plan..."
                value={planAdjustments}
                onChange={(e) => setPlanAdjustments(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? "Saving..." : "Complete Motivation Journey"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-purple-800 mb-2">Your Journey Reflection:</h3>
              <p className="text-gray-700 whitespace-pre-line">{planAdjustments}</p>
            </div>
            <Button
              onClick={handleDashboardClick}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AFinalWord;
