
import { useState } from "react";

export type GoalsFormState = {
  selectedGoal: string;
  goalProgress: string;
  goalsAdherence: "red" | "yellow" | "green";
};

export const useGoalsForm = (initialState?: Partial<GoalsFormState>) => {
  const [selectedGoal, setSelectedGoal] = useState(initialState?.selectedGoal || "");
  const [goalProgress, setGoalProgress] = useState(initialState?.goalProgress || "");
  const [goalsAdherence, setGoalsAdherence] = useState<"red" | "yellow" | "green">(
    initialState?.goalsAdherence || "yellow"
  );

  const getFormData = () => ({
    selectedGoal,
    goalProgress,
    goalsAdherence,
  });

  return {
    selectedGoal,
    setSelectedGoal,
    goalProgress,
    setGoalProgress,
    goalsAdherence,
    setGoalsAdherence,
    getFormData,
  };
};
