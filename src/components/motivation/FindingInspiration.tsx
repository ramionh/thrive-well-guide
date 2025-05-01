
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import FindingInspirationHeader from "./finding-inspiration/FindingInspirationHeader";
import FindingInspirationDescription from "./finding-inspiration/FindingInspirationDescription";
import FindingInspirationForm from "./finding-inspiration/FindingInspirationForm";
import ErrorBoundary from "@/components/ui/error-boundary";

interface FindingInspirationProps {
  onComplete?: () => void;
}

const FindingInspiration: React.FC<FindingInspirationProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData,
    updateForm,
    submitForm,
    error
  } = useMotivationForm({
    tableName: "motivation_finding_inspiration",
    initialState: {
      inspiration_sources: "",
      inspirational_content: ""
    },
    onSuccess: onComplete,
    stepNumber: 37,
    stepName: "Finding Inspiration",
    parseData: (data) => {
      console.log("Raw data from finding inspiration:", data);
      return {
        inspiration_sources: typeof data.inspiration_sources === 'string' ? data.inspiration_sources : "",
        inspirational_content: typeof data.inspirational_content === 'string' ? data.inspirational_content : ""
      };
    }
  });

  useEffect(() => {
    console.log("FindingInspiration: Fetching data");
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FindingInspiration: Submitting form", formData);
    submitForm();
  };

  if (error) {
    console.error("FindingInspiration: Error loading data", error);
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
