
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStressTypes } from "./useStressTypes";
import LoadingState from "../shared/LoadingState";
import StressTypeExplanation from "./StressTypeExplanation";
import StressTypeTable from "./StressTypeTable";

interface IdentifyingStressTypesProps {
  onComplete?: () => void;
}

const IdentifyingStressTypes: React.FC<IdentifyingStressTypesProps> = ({ onComplete }) => {
  const {
    stressTypes,
    isLoadingStressors,
    isSubmitting,
    handleStressorChange,
    handleTypeChange,
    handleSubmit,
  } = useStressTypes({ onComplete });

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoadingStressors ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <StressTypeExplanation />

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700">
                Write your Top Five Stressors on the corresponding lines below
                and note whether that stressor is causing you distress or eustress:
              </Label>

              <StressTypeTable 
                stressTypes={stressTypes} 
                onStressorChange={handleStressorChange}
                onTypeChange={handleTypeChange}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentifyingStressTypes;
