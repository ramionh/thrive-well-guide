
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
  onComplete: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onComplete }) => {
  return (
    <div className="text-center space-y-6 py-6">
      <div className="mx-auto w-16 h-16 bg-thrive-green rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">You're All Set!</h2>
        <p className="text-muted-foreground">
          Thank you for sharing your goals and motivations with us. We're excited to help you on your wellness journey!
        </p>
      </div>
      
      <Button 
        onClick={onComplete}
        className="bg-thrive-blue hover:bg-thrive-blue/90 w-full"
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default SuccessStep;
