
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingScaleDescription from "./RatingScaleDescription";
import StressRatingTable from "./StressRatingTable";
import { useStressRatings } from "@/hooks/useStressRatings";
import LoadingState from "../shared/LoadingState";

interface HowStressedAmIProps {
  onComplete?: () => void;
}

const HowStressedAmI: React.FC<HowStressedAmIProps> = ({ onComplete }) => {
  const { 
    stressRatings, 
    isLoading, 
    isSaving, 
    handleSubmit 
  } = useStressRatings(onComplete);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          How Stressed Am I?
        </h2>
        
        <RatingScaleDescription />
        
        <StressRatingTable 
          stressRatings={stressRatings} 
        />

        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowStressedAmI;
