
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ArrowLeft, Target } from "lucide-react";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface HabitRepurposeWizardProps {
  onBackToOptions: () => void;
}

const HabitRepurposeWizard: React.FC<HabitRepurposeWizardProps> = ({ onBackToOptions }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalText, setGoalText] = useState("");
  const [isLearningGoal, setIsLearningGoal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: goalInfo } = useCurrentGoal();
  const { user } = useUser();
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentStep(2);
  };

  const handleBackToStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveGoal = async () => {
    if (!user || !goalText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_goals')
        .insert({
          user_id: user.id,
          goal_text: goalText.trim(),
          is_learning_goal: isLearningGoal
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your goal has been saved successfully!",
      });

      // Move to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 1) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <Card className="text-center">
          <CardContent className="p-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Habit Repurpose
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Lasting change is a skill. This short guide will walk you through an evidence-based plan to understand your old habits and build new ones that stick.
            </p>
            
            <div className="pt-6">
              <Button 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full max-w-xs"
              >
                Let's Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 1 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12.5%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 1: What is your ultimate goal?
              </h2>
              
              <p className="text-gray-600">
                Having a specific goal builds long-term success.
              </p>
            </div>

            {goalInfo && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Current Goal</h3>
                <p className="text-purple-700">
                  Transform from {goalInfo.current_body_type?.name} to {goalInfo.goal_body_type?.name}
                </p>
                {goalInfo.target_date && (
                  <p className="text-sm text-purple-600 mt-2">
                    Target Date: {new Date(goalInfo.target_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBackToStart}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 2 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 2: What is your ultimate goal?
              </h2>
              
              <p className="text-gray-600">
                Be as specific as possible. What exactly do you want to achieve?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="goal-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Goal
                </label>
                <textarea
                  id="goal-text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Describe your ultimate goal in detail..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="learning-goal"
                  checked={isLearningGoal}
                  onChange={(e) => setIsLearningGoal(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="learning-goal" className="text-sm text-gray-700">
                  This is a learning goal (I want to learn something new)
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveGoal}
                disabled={isSubmitting || !goalText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Placeholder for subsequent wizard steps
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onBackToOptions}
          variant="outline"
          size="sm"
        >
          Back to Journey Options
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-4">Habit Repurpose Wizard - Step {currentStep}</h1>
          <p className="text-lg text-gray-600">
            This is where the next steps of the habit repurpose wizard will go. Coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitRepurposeWizard;
