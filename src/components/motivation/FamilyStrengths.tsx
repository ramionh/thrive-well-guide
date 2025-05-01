
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "./shared/LoadingState";
import { useMotivationForm } from "@/hooks/motivation/useMotivationForm";
import FamilyStrengthsHeader from "./family-strengths/FamilyStrengthsHeader";
import FamilyStrengthsDescription from "./family-strengths/FamilyStrengthsDescription";
import FamilyStrengthsForm from "./family-strengths/FamilyStrengthsForm";

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
    familyStrengths: data?.family_strengths || "",
    perceivedStrengths: data?.perceived_strengths || "",
    familyFeelings: data?.family_feelings || "",
    buildFamily: data?.build_family || ""
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
    isSaving,
    error,
    fetchData
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

  // Add useEffect to ensure data is fetched on component mount
  useEffect(() => {
    console.log("FamilyStrengths: Fetching data on mount");
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="p-6 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <FamilyStrengthsHeader />
      <CardContent className="px-0">
        <FamilyStrengthsDescription />
        <FamilyStrengthsForm
          formData={formData}
          updateForm={updateForm}
          onSubmit={handleSubmit}
          isDisabled={isLoading || isSaving}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export default FamilyStrengths;
