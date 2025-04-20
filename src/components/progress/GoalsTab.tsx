
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressTabLayout from "./ProgressTabLayout";
import { useUser } from "@/context/UserContext";
import { useGoalsForm, GoalsFormState } from "@/hooks/useGoalsForm";
import { format, differenceInDays } from "date-fns";

interface GoalsTabProps {
  initialValues?: Partial<GoalsFormState>;
  onChange?: (values: GoalsFormState) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
  initialValues,
  onChange
}) => {
  const { user } = useUser();
  const {
    selectedGoal, 
    setSelectedGoal, 
    goalProgress, 
    setGoalProgress, 
    goalsAdherence, 
    setGoalsAdherence,
    getFormData
  } = useGoalsForm(initialValues);

  // Notify parent component when values change
  React.useEffect(() => {
    onChange?.(getFormData());
  }, [selectedGoal, goalProgress, goalsAdherence]);

  return (
    <ProgressTabLayout
      title="Track Goal Progress"
      description="Track your progress towards your transformation goals"
      adherenceValue={goalsAdherence}
      onAdherenceChange={setGoalsAdherence}
      adherenceLabel="Overall Goals Adherence"
    >
      <div className="space-y-2">
        <Label htmlFor="goalSelect">Select Goal</Label>
        <Select value={selectedGoal} onValueChange={setSelectedGoal}>
          <SelectTrigger id="goalSelect">
            <SelectValue placeholder="Select a goal to view" />
          </SelectTrigger>
          <SelectContent>
            {user?.goals.map((goal) => {
              const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
              return (
                <SelectItem key={goal.id} value={goal.id}>
                  Body Transformation ({daysRemaining} days remaining)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      {selectedGoal && (
        <div className="space-y-2 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-700">
              Your transformation progress is automatically tracked based on your check-ins.
              Continue recording your daily progress to see your transformation journey.
            </p>
          </div>
        </div>
      )}
    </ProgressTabLayout>
  );
};

export default GoalsTab;
