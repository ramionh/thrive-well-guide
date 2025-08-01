
import React from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import UserInfoStep from "./UserInfoStep";
import GoalSettingStep from "./GoalSettingStep";
import QuestionnaireStep from "./QuestionnaireStep";
import InitialCheckInStep from "./InitialCheckInStep";
import SuccessStep from "./SuccessStep";

const OnboardingWizard: React.FC = () => {
  const { 
    onboardingStep, 
    setOnboardingStep, 
    user 
  } = useUser();
  const navigate = useNavigate();
  
  const steps = [
    {
      title: "Welcome to Gen X Shred",
      description: "Let's get to know you better to personalize your fitness journey.",
      component: <UserInfoStep onNext={() => setOnboardingStep(1)} />
    },
    {
      title: "Set Your Goals",
      description: "Define what you want to achieve in your wellness transformation.",
      component: <GoalSettingStep onNext={() => setOnboardingStep(2)} />
    },
    {
      title: "Your Current Habits",
      description: "Help us understand your current habits and routines.",
      component: <QuestionnaireStep 
        onNext={() => setOnboardingStep(3)}
        onBack={() => setOnboardingStep(1)}
      />
    },
    {
      title: "Initial Check-In",
      description: "Let's establish your baseline measurements to track your progress.",
      component: <InitialCheckInStep onNext={() => setOnboardingStep(4)} />
    },
    {
      title: "All Set!",
      description: "You're ready to start your fitness journey.",
      component: <SuccessStep onComplete={() => {
        if (user) {
          navigate("/dashboard");
        }
      }} />
    }
  ];
  
  const currentStep = steps[onboardingStep];
  const progress = ((onboardingStep + 1) / steps.length) * 100;
  
  const handleBackClick = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      // Navigate to home page when on first step
      navigate("/");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-thrive-blue">GenXShred Onboarding</CardTitle>
          <CardDescription>{steps[onboardingStep].description}</CardDescription>
          <Progress value={((onboardingStep + 1) / steps.length) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          {steps[onboardingStep].component}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
          >
            {onboardingStep === 0 ? "Return to Home" : "Back"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
