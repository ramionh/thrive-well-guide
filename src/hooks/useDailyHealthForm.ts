
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HealthFormData {
  sleep_hours: number;
  exercise_minutes: number;
  calories: number;
  protein: number;
  water: number;
  steps: number;
  mood: number;
  notes: string;
  sleep_adherence: "red" | "yellow" | "green";
  exercise_adherence: "red" | "yellow" | "green";
  nutrition_adherence: "red" | "yellow" | "green";
  goals_adherence: "red" | "yellow" | "green";
}

export const useDailyHealthForm = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState } = useForm<HealthFormData>({
    defaultValues: {
      sleep_hours: 7,
      exercise_minutes: 30,
      calories: 2000,
      protein: 100,
      water: 8,
      steps: 8000,
      mood: 5,
      notes: "",
      sleep_adherence: "yellow",
      exercise_adherence: "yellow",
      nutrition_adherence: "yellow",
      goals_adherence: "yellow",
    },
    mode: "onChange"
  });

  const onSubmit = async (data: HealthFormData) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("daily_health_tracking").insert([
        {
          user_id: user.id,
          ...data,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your health data has been recorded.",
      });
    } catch (error) {
      console.error("Error saving health data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your health data. Please try again.",
      });
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    formState,
    onSubmit,
  };
};
