
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { SleepFormState } from "./useSleepForm";
import { ExerciseFormState } from "./useExerciseForm";
import { NutritionFormState } from "./useNutritionForm";
import { GoalsFormState } from "./useGoalsForm";

export const useProgressSubmit = () => {
  const { user, updateGoal, addVital } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveProgress = async (
    sleepForm: SleepFormState,
    nutritionForm: NutritionFormState,
    exerciseForm: ExerciseFormState,
    goalsForm: GoalsFormState
  ) => {
    try {
      if (goalsForm.selectedGoal && goalsForm.goalProgress) {
        updateGoal(goalsForm.selectedGoal, {
          currentValue: parseFloat(goalsForm.goalProgress)
        });
      }
      
      // Save to database - updated to include water and steps columns
      const { error } = await supabase.from("daily_health_tracking").insert([{
        user_id: user?.id,
        sleep_hours: parseFloat(sleepForm.sleepHours),
        sleep_adherence: sleepForm.sleepAdherence,
        calories: parseInt(nutritionForm.calories),
        protein: parseInt(nutritionForm.protein),
        water: parseInt(nutritionForm.water),
        nutrition_adherence: nutritionForm.nutritionAdherence,
        exercise_minutes: parseInt(exerciseForm.exerciseMinutes),
        steps: parseInt(exerciseForm.steps),
        exercise_adherence: exerciseForm.exerciseAdherence,
        goals_adherence: goalsForm.goalsAdherence,
      }]);

      if (error) throw error;
      
      toast({
        title: "Progress updated",
        description: "Your wellness data has been saved successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress. Please try again.",
      });
      console.error("Error saving progress:", error);
    }
  };
  
  return { handleSaveProgress };
};
