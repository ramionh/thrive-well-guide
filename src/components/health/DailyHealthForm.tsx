
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Slider } from "@/components/ui/slider";
import { Smile } from "lucide-react";
import { useDailyHealthForm } from "@/hooks/useDailyHealthForm";
import SleepSection from "./SleepSection";
import ExerciseSection from "./ExerciseSection";
import NutritionSection from "./NutritionSection";

const DailyHealthForm = () => {
  const { register, handleSubmit, setValue, watch, onSubmit } = useDailyHealthForm();

  // Watch the values to display them in the UI
  const sleepHours = watch("sleep_hours");
  const exerciseMinutes = watch("exercise_minutes");
  const moodValue = watch("mood");
  const sleepAdherence = watch("sleep_adherence");
  const exerciseAdherence = watch("exercise_adherence");
  const nutritionAdherence = watch("nutrition_adherence");
  const goalsAdherence = watch("goals_adherence");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Daily Health Tracking</h2>
      
      <div className="space-y-6">
        <SleepSection
          sleepHours={sleepHours}
          sleepAdherence={sleepAdherence}
          onSleepHoursChange={([value]) => setValue("sleep_hours", value)}
          onAdherenceChange={(value) => setValue("sleep_adherence", value)}
        />

        <ExerciseSection
          exerciseMinutes={exerciseMinutes}
          exerciseAdherence={exerciseAdherence}
          onExerciseMinutesChange={([value]) => setValue("exercise_minutes", value)}
          onAdherenceChange={(value) => setValue("exercise_adherence", value)}
        />

        <NutritionSection
          register={register}
          nutritionAdherence={nutritionAdherence}
          onAdherenceChange={(value) => setValue("nutrition_adherence", value)}
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
            value={[moodValue]}
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
