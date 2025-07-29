
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
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p className="text-muted-foreground">
          Thank you for completing your registration and onboarding with GenXShred. We're excited to help you on your fitness journey!
        </p>
        
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-center">Ready for Your Next Step?</h3>
          <p className="text-sm text-muted-foreground text-center">
            Schedule a meeting with your assigned coach to receive your personalized macros and complete your initial motivational interviewing assessment.
          </p>
          
          <Button 
            asChild
            className="w-full bg-primary hover:bg-primary/90"
          >
            <a 
              href="https://scheduler.zoom.us/gen-x-shred/gen-x-shred-intro" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Schedule Your Coaching Session
            </a>
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={onComplete}
        variant="outline"
        className="w-full"
      >
        Continue to Dashboard
      </Button>
    </div>
  );
};

export default SuccessStep;
