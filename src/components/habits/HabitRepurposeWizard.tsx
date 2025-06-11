
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ArrowLeft, Target, Heart } from "lucide-react";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface HabitRepurposeWizardProps {
  onBackToOptions: () => void;
}

const HabitRepurposeWizard: React.FC<HabitRepurposeWizardProps> = ({ onBackToOptions }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalText, setGoalText] = useState("");
  const [isLearningGoal, setIsLearningGoal] = useState(false);
  const [goalValuesText, setGoalValuesText] = useState("");
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

  const handleSaveGoalValues = async () => {
    if (!user || !goalValuesText.trim()) {
      toast({
        title: "Error",
        description: "Please explain why your goal is important to you before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_goal_values')
        .insert({
          user_id: user.id,
          goal_values_text: goalValuesText.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your values explanation has been saved successfully!",
      });

      // Move to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving goal values:', error);
      toast({
        title: "Error",
        description: "Failed to save your values explanation. Please try again.",
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
          <div className="text-gray-500">Step 2 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Why is your goal important to your values?
              </h2>
              
              <p className="text-gray-600">
                Connecting your goal to your personal values increases motivation and commitment.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="value-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Explain why this goal matters to you
                </label>
                <Textarea
                  id="value-text"
                  value={goalValuesText}
                  onChange={(e) => setGoalValuesText(e.target.value)}
                  placeholder="This goal is important to me because..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold">Tip:</p>
                <p>Consider how your goal connects to your personal values like:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Health and well-being</li>
                  <li>Family relationships</li>
                  <li>Personal growth</li>
                  <li>Community contribution</li>
                </ul>
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
                onClick={handleSaveGoalValues}
                disabled={isSubmitting || !goalValuesText.trim()}
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

  if (currentStep === 3) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 3 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '37.5%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step 3: What is your ultimate goal?
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
                <Textarea
                  id="goal-text"
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="Describe your ultimate goal in detail..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
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
