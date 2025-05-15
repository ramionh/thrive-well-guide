
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStressTypes } from "./useStressTypes";
import StressTypeExplanation from "./StressTypeExplanation";
import StressTypeTable from "./StressTypeTable";
import LoadingState from "../shared/LoadingState";

interface IdentifyingStressTypesProps {
  onComplete?: () => void;
}

const IdentifyingStressTypes: React.FC<IdentifyingStressTypesProps> = ({ onComplete }) => {
  const { 
    stressTypes, 
    isLoading, 
    isSaving, 
    handleSubmit 
  } = useStressTypes(onComplete);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          Identifying Your Stress Types
        </h2>
        
        <StressTypeExplanation />
        
        <StressTypeTable 
          stressTypes={stressTypes} 
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

export default IdentifyingStressTypes;
