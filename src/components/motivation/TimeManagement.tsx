
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "./shared/LoadingState";
import TimeManagementHeader from "./time-management/TimeManagementHeader";
import TimeManagementDescription from "./time-management/TimeManagementDescription";
import TimeManagementForm from "./time-management/TimeManagementForm";
import { useTimeManagementData } from "./time-management/useTimeManagementData";
import { useTimeManagementSubmit } from "./time-management/useTimeManagementSubmit";

interface TimeManagementProps {
  onComplete: () => void;
}

const TimeManagement: React.FC<TimeManagementProps> = ({ onComplete }) => {
  const {
    formData,
    updateForm,
    isLoading,
    isSaving,
    setIsSaving
  } = useTimeManagementData();

  const { submitForm } = useTimeManagementSubmit({ 
    onComplete 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    submitForm(formData);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <TimeManagementHeader />
      <CardContent className="px-0">
        <TimeManagementDescription />
        <TimeManagementForm
          formData={formData}
          updateForm={updateForm}
          onSubmit={handleSubmit}
          isSaving={isSaving}
        />
      </CardContent>
    </Card>
  );
};

export default TimeManagement;
