
import { useState } from "react";

export type NutritionFormState = {
  calories: string;
  protein: string;
  water: string;
  nutritionAdherence: "red" | "yellow" | "green";
};

export const useNutritionForm = (initialState?: Partial<NutritionFormState>) => {
  const [calories, setCalories] = useState(initialState?.calories || "2000");
  const [protein, setProtein] = useState(initialState?.protein || "90");
  const [water, setWater] = useState(initialState?.water || "6");
  const [nutritionAdherence, setNutritionAdherence] = useState<"red" | "yellow" | "green">(
    initialState?.nutritionAdherence || "yellow"
  );

  const getFormData = () => ({
    calories,
    protein,
    water,
    nutritionAdherence,
  });

  return {
    calories,
    setCalories,
    protein,
    setProtein,
    water,
    setWater,
    nutritionAdherence,
    setNutritionAdherence,
    getFormData,
  };
};
