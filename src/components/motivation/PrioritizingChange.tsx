
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import PrioritizingChangeHeader from "./prioritizing-change/PrioritizingChangeHeader";
import PrioritizingChangeDescription from "./prioritizing-change/PrioritizingChangeDescription";
import PrioritizingChangeForm from "./prioritizing-change/PrioritizingChangeForm";
import { Skeleton } from "@/components/ui/skeleton";

interface PrioritizingChangeProps {
  onComplete?: () => void;
}

const PrioritizingChange: React.FC<PrioritizingChangeProps> = ({ onComplete }) => {
  // Get the current goal data
  const { 
    data: goalData, 
    isLoading: isGoalLoading,
    error: goalError
  } = useCurrentGoal();
  
  // Initialize form hook with proper error handling
  const {
    formData,
    isLoading: isFormLoading,
    isSaving,
    error: formError,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    new_activities: string;
    prioritized_activities: string;
  }>({
    tableName: 'motivation_prioritizing_change',
    initialState: {
      new_activities: '',
      prioritized_activities: '',
    },
    onSuccess: onComplete,
    stepNumber: 61,
    nextStepNumber: 64, // Setting "Where Are You Now" (ID: 64) as the next step
    parseData: (data) => {
      console.log("Raw data from Prioritizing Change:", data);
      return {
        new_activities: data.new_activities || '',
        prioritized_activities: data.prioritized_activities || ''
      };
    }
  });

  // Fetch data on component mount, with proper dependency handling
  useEffect(() => {
    console.log("PrioritizingChange: Fetching data");
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PrioritizingChange: Submitting form", formData);
    submitForm();
  };

  // Check for loading states
  const isLoading = isFormLoading || isGoalLoading;
  
  // Error handling
  const error = formError || goalError;
  if (error) {
    console.error("Error in PrioritizingChange:", error);
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Skeleton loading state
  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format goal description if available
  const goalDescription = goalData ? 
    `Transform from ${goalData.current_body_type?.name} to ${goalData.goal_body_type?.name} by ${new Date(goalData.target_date).toLocaleDateString()}` 
    : undefined;

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <PrioritizingChangeHeader />
        <PrioritizingChangeDescription goalDescription={goalDescription} />
        <PrioritizingChangeForm 
          formData={formData}
          isSaving={isSaving}
          updateForm={updateForm}
          handleSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default PrioritizingChange;
