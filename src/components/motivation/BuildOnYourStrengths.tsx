
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
    strengthApplications,
    isLoading,
    isSaving,
    error,
    handleStrengthChange,
    handleApplicationChange,
    handleSubmit
  } = useBuildOnYourStrengths(onComplete);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="p-6 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <BuildOnYourStrengthsHeader />
        <BuildOnYourStrengthsDescription />
        <BuildOnYourStrengthsForm
          strengthApplications={strengthApplications}
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
