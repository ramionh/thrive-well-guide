
import React from "react";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { ConfidenceStep } from "@/hooks/useConfidenceSteps";

interface ConfidenceStepInputProps {
  step: ConfidenceStep;
  index: number;
  onStepChange: (index: number, field: keyof ConfidenceStep, value: string | number) => void;
}

const ConfidenceStepInput: React.FC<ConfidenceStepInputProps> = ({ 
  step, 
  index, 
  onStepChange 
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-800">Step {index + 1}</span>
        {step.rating >= 7 && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter your step forward"
            value={step.text}
            onChange={(e) => onStepChange(index, "text", e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rating (1-10):</span>
          <Input
            type="number"
            min="1"
            max="10"
            value={step.rating}
            onChange={(e) => onStepChange(index, "rating", parseInt(e.target.value, 10) || 1)}
            required
            className="w-16"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfidenceStepInput;
