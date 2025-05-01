
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import LoadingState from "./shared/LoadingState";
import { useMotivationForm } from "@/hooks/motivation/useMotivationForm";

interface FamilyStrengthsProps {
  onComplete: () => void;
}

interface FamilyStrengthsFormData {
  familyStrengths: string;
  perceivedStrengths: string;
  familyFeelings: string;
  buildFamily: string;
}

const FamilyStrengths: React.FC<FamilyStrengthsProps> = ({ onComplete }) => {
  const initialState: FamilyStrengthsFormData = {
    familyStrengths: "",
    perceivedStrengths: "",
    familyFeelings: "",
    buildFamily: ""
  };

  // Parse data from DB column format to our form data format
  const parseData = (data: any): FamilyStrengthsFormData => ({
    familyStrengths: data.family_strengths || "",
    perceivedStrengths: data.perceived_strengths || "",
    familyFeelings: data.family_feelings || "",
    buildFamily: data.build_family || ""
  });

  // Transform form data to DB column format
  const transformData = (formData: FamilyStrengthsFormData) => ({
    family_strengths: formData.familyStrengths,
    perceived_strengths: formData.perceivedStrengths,
    family_feelings: formData.familyFeelings,
    build_family: formData.buildFamily
  });

  // Use the motivation form hook to handle data fetching and submission
  const {
    formData,
    updateForm,
    submitForm,
    isLoading,
    isSaving
  } = useMotivationForm<FamilyStrengthsFormData>({
    tableName: "motivation_family_strengths",
    initialState,
    parseData,
    transformData,
    onSuccess: onComplete,
    stepNumber: 52,
    nextStepNumber: 53,
    stepName: "Family Strengths",
    nextStepName: "Time Management"
  });

  // Load data when component mounts
  useEffect(() => {}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-6 h-6 text-purple-600" />
          <CardTitle className="text-2xl font-bold text-purple-800">Family Strengths</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Think about your family as a resource. If you don't have a traditional family, that doesn't mean you won't be able to 
          reach your fitness goals. Define family in whatever terms work for you. What are some strengths your family has 
          that can help you achieve your goal? Consider the quality of your relationships, shared family values, common activities 
          and traditions, conflict management, and loyalty.
        </p>

        <p className="mb-6 text-gray-600 italic">
          "My family sticks by each other and doesn't keep secrets. I can count on them for help and to listen when I need an ear. 
          We get together most Sundays for dinner to reconnect. My mom and I text each other daily about our workout progress."
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="familyStrengths" className="text-purple-600">What are your family's strengths?</Label>
            <Textarea 
              id="familyStrengths"
              value={formData.familyStrengths}
              onChange={(e) => updateForm("familyStrengths", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
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
              disabled={isLoading || isSaving}
              placeholder="Describe ways to strengthen your family support..."
            />
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FamilyStrengths;
