
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStressRatings } from "@/hooks/useStressRatings";
import StressRatingTable from "./StressRatingTable";
import RatingScaleDescription from "./RatingScaleDescription";
import LoadingState from "../shared/LoadingState";

interface HowStressedAmIProps {
  onComplete?: () => void;
}

const HowStressedAmI: React.FC<HowStressedAmIProps> = ({ onComplete }) => {
  const {
    stressRatings,
    isLoading,
    isSubmitting,
    handleRatingChange,
    handleExplanationChange,
    handleSubmit
  } = useStressRatings({ onComplete });

  return (
    <Card className="bg-white shadow">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">How Stressed Am I?</h2>
              
              <p className="text-gray-700 mb-4">
                Now that you've identified your stressors and determined whether they are causing distress or eustress, 
                let's figure out the intensity of your stress. Using the following scale, rate each stressor from the 
                previous exercise and explain your rating.
              </p>
              
              <RatingScaleDescription />
            </div>

            <StressRatingTable
              stressRatings={stressRatings}
              onRatingChange={handleRatingChange}
              onExplanationChange={handleExplanationChange}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Complete Step
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default HowStressedAmI;
