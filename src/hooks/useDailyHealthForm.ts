
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "User identification issue. Please sign in again.",
        });
        navigate("/auth");
        return;
      }

      // Refresh the access token before making the request
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("daily_health_tracking").insert([
        {
          user_id: user.id,
          ...data,
          date: new Date().toISOString().split('T')[0], // Add current date in YYYY-MM-DD format
        },
      ]);

      if (error) {
        console.error("Database error:", error);
        
        if (error.code === '42501') {
          // This is a Row Level Security error
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Please sign in again to save your progress.",
          });
          
          // Force sign out since the session might be invalid
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }
        
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your health data has been recorded.",
      });
      
      navigate("/dashboard");
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
