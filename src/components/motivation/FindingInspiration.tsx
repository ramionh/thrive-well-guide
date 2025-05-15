
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import FindingInspirationHeader from "./finding-inspiration/FindingInspirationHeader";
import FindingInspirationDescription from "./finding-inspiration/FindingInspirationDescription";
import FindingInspirationForm from "./finding-inspiration/FindingInspirationForm";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useMotivationSafeData } from "@/hooks/motivation/useMotivationSafeData";

interface FindingInspirationProps {
  onComplete?: () => void;
}

interface InspirationFormData {
  inspiration_sources: string;
  inspirational_content: string;
}

const FindingInspiration: React.FC<FindingInspirationProps> = ({ onComplete }) => {
  const initialState = {
    inspiration_sources: "",
    inspirational_content: ""
  };

  const { 
    formData, 
    isLoading,
    error
  } = useMotivationSafeData<InspirationFormData>({
    tableName: "motivation_finding_inspiration",
    initialState,
    parseData: (data) => ({
      inspiration_sources: typeof data.inspiration_sources === 'string' ? data.inspiration_sources : "",
      inspirational_content: typeof data.inspirational_content === 'string' ? data.inspirational_content : ""
    })
  });
  
  const {
    isSaving,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_finding_inspiration",
    initialState,
    onSuccess: onComplete,
    stepNumber: 37,
    nextStepNumber: 38,
    stepName: "Finding Inspiration",
    nextStepName: "Building on Your Strengths"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FindingInspiration: Submitting form", formData);
    submitForm();
  };

  if (error) {
    console.error("FindingInspiration: Error loading data", error);
    return (
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="p-6 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="bg-white shadow-lg border border-purple-200">
        <CardContent className="p-6">
          <FindingInspirationHeader />
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <FindingInspirationDescription />
              <FindingInspirationForm 
                formData={formData}
                updateForm={updateForm}
                isSaving={isSaving}
                handleSubmit={handleSubmit}
              />
            </>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default FindingInspiration;
