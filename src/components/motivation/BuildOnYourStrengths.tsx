
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "./shared/LoadingState";
import BuildOnYourStrengthsHeader from "./build-on-strengths/BuildOnYourStrengthsHeader";
import BuildOnYourStrengthsDescription from "./build-on-strengths/BuildOnYourStrengthsDescription";
import BuildOnYourStrengthsForm from "./build-on-strengths/BuildOnYourStrengthsForm";
import { useBuildOnYourStrengths } from "./build-on-strengths/useBuildOnYourStrengths";
import { BuildOnYourStrengthsProps } from "./build-on-strengths/types";

const BuildOnYourStrengths: React.FC<BuildOnYourStrengthsProps> = ({ onComplete }) => {
  const {
    applications,
    isLoading,
    isSaving,
    error,
    updateApplication,
    saveApplications
  } = useBuildOnYourStrengths({ onComplete });

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

  const handleStrengthChange = (index: number, value: string) => {
    updateApplication(index, "strength", value);
  };
  
  const handleApplicationChange = (index: number, value: string) => {
    updateApplication(index, "application", value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveApplications();
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <BuildOnYourStrengthsHeader />
        <BuildOnYourStrengthsDescription />
        <BuildOnYourStrengthsForm
          strengthApplications={applications}
          handleStrengthChange={handleStrengthChange}
          handleApplicationChange={handleApplicationChange}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export default BuildOnYourStrengths;
