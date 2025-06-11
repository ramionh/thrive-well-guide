
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ArrowLeft, Target } from "lucide-react";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";

interface HabitRepurposeWizardProps {
  onBackToOptions: () => void;
}

const HabitRepurposeWizard: React.FC<HabitRepurposeWizardProps> = ({ onBackToOptions }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: goalInfo } = useCurrentGoal();

  const handleGetStarted = () => {
    // Move to the next step of the wizard
    setCurrentStep(2);
  };

  const handleBackToStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    // Move to next step (step 3 when implemented)
    setCurrentStep(currentStep + 1);
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

  // Placeholder for subsequent wizard steps
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={handleBackToStart}
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
