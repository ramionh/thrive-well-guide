
import React from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { supabase } from "@/integrations/supabase/client";
import { Moon, Dumbbell, Pizza, Beef, Smile } from "lucide-react";

interface HealthFormData {
  sleep_hours: number;
  exercise_minutes: number;
  calories: number;
  protein: number;
  mood: number;
  notes: string;
  sleep_adherence: "red" | "yellow" | "green";
  exercise_adherence: "red" | "yellow" | "green";
  nutrition_adherence: "red" | "yellow" | "green";
  goals_adherence: "red" | "yellow" | "green";
}

const DailyHealthForm = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch } = useForm<HealthFormData>({
    defaultValues: {
      sleep_hours: 7,
      exercise_minutes: 30,
      calories: 2000,
      protein: 100,
      mood: 5,
      notes: "",
      sleep_adherence: "yellow",
      exercise_adherence: "yellow",
      nutrition_adherence: "yellow",
      goals_adherence: "yellow",
    },
  });

  // Watch the values to display them in the UI
  const sleepHours = watch("sleep_hours");
  const exerciseMinutes = watch("exercise_minutes");
  const moodValue = watch("mood");
  const sleepAdherence = watch("sleep_adherence");
  const exerciseAdherence = watch("exercise_adherence");
  const nutritionAdherence = watch("nutrition_adherence");
  const goalsAdherence = watch("goals_adherence");

  const onSubmit = async (data: HealthFormData) => {
    try {
      const { error } = await supabase.from("daily_health_tracking").insert([
        {
          user_id: user?.id,
          ...data,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your health data has been recorded.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your health data. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Daily Health Tracking</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Moon className="h-5 w-5 text-thrive-blue" />
            <Label>Sleep Hours</Label>
          </div>
          <Slider
            defaultValue={[7]}
            max={12}
            step={0.5}
            onValueChange={([value]) => setValue("sleep_hours", value)}
          />
          <div className="text-sm text-muted-foreground mt-1 text-center">
            {sleepHours} hours
          </div>
        </div>

        <StoplightControl
          value={sleepAdherence}
          onValueChange={(value) => setValue("sleep_adherence", value)}
          label="Sleep Goal Adherence"
        />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="h-5 w-5 text-thrive-blue" />
            <Label>Exercise Minutes</Label>
          </div>
          <Slider
            defaultValue={[30]}
            max={180}
            step={5}
            onValueChange={([value]) => setValue("exercise_minutes", value)}
          />
          <div className="text-sm text-muted-foreground mt-1 text-center">
            {exerciseMinutes} minutes
          </div>
        </div>

        <StoplightControl
          value={exerciseAdherence}
          onValueChange={(value) => setValue("exercise_adherence", value)}
          label="Exercise Goal Adherence"
        />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pizza className="h-5 w-5 text-thrive-orange" />
            <Label>Calories</Label>
          </div>
          <Input
            type="number"
            {...register("calories")}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Beef className="h-5 w-5 text-thrive-orange" />
            <Label>Protein (g)</Label>
          </div>
          <Input
            type="number"
            {...register("protein")}
            className="w-full"
          />
        </div>

        <StoplightControl
          value={nutritionAdherence}
          onValueChange={(value) => setValue("nutrition_adherence", value)}
          label="Nutrition Goal Adherence"
        />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Smile className="h-5 w-5 text-thrive-teal" />
            <Label>Mood (1-10)</Label>
          </div>
          <Slider
            defaultValue={[5]}
            max={10}
            step={1}
            onValueChange={([value]) => setValue("mood", value)}
          />
          <div className="text-sm text-muted-foreground mt-1 text-center">
            {moodValue}/10
          </div>
        </div>

        <StoplightControl
          value={goalsAdherence}
          onValueChange={(value) => setValue("goals_adherence", value)}
          label="Overall Goals Adherence"
        />

        <div>
          <Label>Notes</Label>
          <Textarea
            {...register("notes")}
            placeholder="Any additional notes about your day..."
            className="mt-1"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-thrive-blue hover:bg-thrive-blue/90"
      >
        Save Today's Progress
      </Button>
    </form>
  );
};

export default DailyHealthForm;
