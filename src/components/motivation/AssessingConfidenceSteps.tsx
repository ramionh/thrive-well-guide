
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useConfidenceSteps } from "@/hooks/useConfidenceSteps";
import ConfidenceStepInput from "./ConfidenceStepInput";

interface AssessingConfidenceStepsProps {
  onComplete?: () => void;
}

const AssessingConfidenceSteps: React.FC<AssessingConfidenceStepsProps> = ({ onComplete }) => {
  const {
    isLoading,
    isSubmitting,
    confidenceSteps,
    selectedConfidenceStep,
    setSelectedConfidenceStep,
    handleStepChange,
    handleSubmit
  } = useConfidenceSteps();

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, onComplete)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Assessing Your Confidence in Your Steps Forward</h2>
              <p className="text-gray-600 mb-6">
                This exercise revisits the Steps Forward you identified earlier. 
                Write down those five steps and rate each using your confidence scale.
              </p>
            </div>

            <div className="space-y-4">
              {confidenceSteps.map((step, index) => (
                <ConfidenceStepInput 
                  key={index} 
                  step={step} 
                  index={index} 
                  onStepChange={handleStepChange} 
                />
              ))}
            </div>

            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                Put a star beside each Step Forward rated 7 or above. Choose one you would like to start with, 
                then write it below and explain why you chose it.
              </p>
              <Textarea
                placeholder="Enter your selected step and explain why you chose it"
                value={selectedConfidenceStep}
                onChange={(e) => setSelectedConfidenceStep(e.target.value)}
                required
                rows={4}
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

export default AssessingConfidenceSteps;
