
import { useState } from "react";

export type ExerciseFormState = {
  exerciseMinutes: string;
  steps: string;
  exerciseAdherence: "red" | "yellow" | "green";
};

export const useExerciseForm = (initialState?: Partial<ExerciseFormState>) => {
  const [exerciseMinutes, setExerciseMinutes] = useState(initialState?.exerciseMinutes || "45");
  const [steps, setSteps] = useState(initialState?.steps || "8000");
  const [exerciseAdherence, setExerciseAdherence] = useState<"red" | "yellow" | "green">(
    initialState?.exerciseAdherence || "yellow"
  );

  const getFormData = () => ({
    exerciseMinutes,
    steps,
    exerciseAdherence,
  });

  return {
    exerciseMinutes,
    setExerciseMinutes,
    steps,
    setSteps,
    exerciseAdherence,
    setExerciseAdherence,
    getFormData,
  };
};
