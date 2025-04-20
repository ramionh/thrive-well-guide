
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

interface GoalSettingStepProps {
  onNext: () => void;
}

const GoalSettingStep: React.FC<GoalSettingStepProps> = ({ onNext }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">About Body Transformation Goals</h3>
            <p className="text-sm text-blue-700 mt-1">
              After completing onboarding, you'll be able to select your current body type and your goal body type.
              The system will automatically create a 100-day transformation goal for you.
            </p>
          </div>
        </div>
      </div>
      
      <Card className="p-2 bg-muted/50">
        <CardContent className="p-2">
          <h4 className="font-medium">Sample Goal</h4>
          <p className="text-sm text-muted-foreground">
            Body Transformation: Current to Goal Body Type
          </p>
          <p className="text-sm text-muted-foreground">
            Duration: 100 days
          </p>
        </CardContent>
      </Card>
      
      <Button 
        type="button" 
        onClick={onNext}
        className="w-full bg-thrive-green"
      >
        Continue
      </Button>
    </div>
  );
};

export default GoalSettingStep;
