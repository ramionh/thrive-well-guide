
import { useState, useEffect } from 'react';
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { useMotivationSafeData } from "@/hooks/motivation/useMotivationSafeData";
import { StrengthApplication } from './types';
import { parseStrengthApplicationsData } from './utils';

export const useBuildOnYourStrengths = (onComplete?: () => void) => {
  const [strengthApplications, setStrengthApplications] = useState<StrengthApplication[]>([
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ]);

  const { 
    formData, 
    isLoading,
    error
  } = useMotivationSafeData(
    "motivation_strength_applications",
    { strength_applications: [] as StrengthApplication[] },
    parseStrengthApplicationsData
  );

  const { 
    isSaving,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strength_applications",
    initialState: {
      strength_applications: [] as StrengthApplication[]
    },
    onSuccess: onComplete,
    stepNumber: 42,
    nextStepNumber: 52,
    stepName: "Build on Your Strengths",
    nextStepName: "Family Strengths"
  });

  // Update local state when formData changes
  useEffect(() => {
    if (formData && formData.strength_applications) {
      if (Array.isArray(formData.strength_applications) && formData.strength_applications.length > 0) {
        setStrengthApplications(formData.strength_applications);
      }
    }
  }, [formData]);

  const handleStrengthChange = (index: number, value: string) => {
    const updatedApplications = [...strengthApplications];
    updatedApplications[index].strength = value;
    setStrengthApplications(updatedApplications);
  };

  const handleApplicationChange = (index: number, value: string) => {
    const updatedApplications = [...strengthApplications];
    updatedApplications[index].application = value;
    setStrengthApplications(updatedApplications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting strength applications:", strengthApplications);
    submitForm({
      strength_applications: strengthApplications
    });
  };

  return {
    strengthApplications,
    isLoading,
    isSaving,
    error,
    handleStrengthChange,
    handleApplicationChange,
    handleSubmit
  };
};
