
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FamilyStrengthsFormProps {
  formData: {
    familyStrengths: string;
    perceivedStrengths: string;
    familyFeelings: string;
    buildFamily: string;
  };
  updateForm: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
  isSaving: boolean;
}

const FamilyStrengthsForm: React.FC<FamilyStrengthsFormProps> = ({
  formData,
  updateForm,
  onSubmit,
  isDisabled,
  isSaving
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="familyStrengths" className="text-purple-600">What are your family's strengths?</Label>
        <Textarea 
          id="familyStrengths"
          value={formData.familyStrengths}
          onChange={(e) => updateForm("familyStrengths", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isDisabled}
          placeholder="Describe your family's strengths..."
        />
      </div>
      
      <div>
        <Label htmlFor="perceivedStrengths" className="text-purple-600">What would your family members say your strengths are?</Label>
        <Textarea 
          id="perceivedStrengths"
          value={formData.perceivedStrengths}
          onChange={(e) => updateForm("perceivedStrengths", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isDisabled}
          placeholder="Describe how your family members see your strengths..."
        />
      </div>
      
      <div>
        <Label htmlFor="familyFeelings" className="text-purple-600">How do you feel about this area?</Label>
        <Textarea 
          id="familyFeelings"
          value={formData.familyFeelings}
          onChange={(e) => updateForm("familyFeelings", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isDisabled}
          placeholder="Share your feelings about your family support..."
        />
      </div>
      
      <div>
        <Label htmlFor="buildFamily" className="text-purple-600">What can you build on or add to any of these family supports or strengths?</Label>
        <Textarea 
          id="buildFamily"
          value={formData.buildFamily}
          onChange={(e) => updateForm("buildFamily", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isDisabled}
          placeholder="Describe ways to strengthen your family support..."
        />
      </div>

      <Button 
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isDisabled}
      >
        {isSaving ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default FamilyStrengthsForm;
