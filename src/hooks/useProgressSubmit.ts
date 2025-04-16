
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
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to save your progress.",
        });
        navigate("/auth");
        return;
      }

      // Validate that user exists and has a valid UUID
      if (!user || !user.id || typeof user.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id)) {
        throw new Error("User not authenticated or invalid user ID format");
      }

      if (goalsForm.selectedGoal && goalsForm.goalProgress) {
        updateGoal(goalsForm.selectedGoal, {
          currentValue: parseFloat(goalsForm.goalProgress)
        });
      }
      
      // Save to database with proper date field
      const { error } = await supabase.from("daily_health_tracking").insert([{
        user_id: user.id,
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
        date: new Date().toISOString().split('T')[0], // Add current date in YYYY-MM-DD format
      }]);

      if (error) {
        console.error("Database error:", error);
        
        if (error.code === '42501') {
          // This is a Row Level Security error
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Please sign in again to save your progress.",
          });
          navigate("/auth");
          return;
        }
        
        throw error;
      }
      
      toast({
        title: "Progress updated",
        description: "Your wellness data has been saved successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your progress. Please try again.",
      });
    }
  };
  
  return { handleSaveProgress };
};
