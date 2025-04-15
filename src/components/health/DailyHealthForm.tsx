
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Slider } from "@/components/ui/slider";
import { Smile, Droplets } from "lucide-react";
import { useDailyHealthForm } from "@/hooks/useDailyHealthForm";
import SleepSection from "./SleepSection";
import ExerciseSection from "./ExerciseSection";
import NutritionSection from "./NutritionSection";
import { Input } from "@/components/ui/input";

const DailyHealthForm = () => {
  const { register, handleSubmit, setValue, watch, onSubmit, formState } = useDailyHealthForm();
  const [steps, setSteps] = useState(8000);

  // Watch the values to display them in the UI
  const sleepHours = watch("sleep_hours");
  const exerciseMinutes = watch("exercise_minutes");
  const moodValue = watch("mood");
  const sleepAdherence = watch("sleep_adherence");
  const exerciseAdherence = watch("exercise_adherence");
  const nutritionAdherence = watch("nutrition_adherence");
  const goalsAdherence = watch("goals_adherence");

  // Update the steps value
  const handleStepsChange = (value: number) => {
    setSteps(value);
    setValue("steps", value);
  };

  // Check if the form is complete
  const isFormComplete = Object.keys(formState.errors).length === 0 && formState.isValid;

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
          steps={steps}
          onExerciseMinutesChange={([value]) => setValue("exercise_minutes", value)}
          onStepsChange={handleStepsChange}
          onAdherenceChange={(value) => setValue("exercise_adherence", value)}
        />

        <NutritionSection
          register={register}
          nutritionAdherence={nutritionAdherence}
          onAdherenceChange={(value) => setValue("nutrition_adherence", value)}
        />

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-5 w-5 text-thrive-blue" />
              <Label>Water Intake (glasses)</Label>
            </div>
            <Input
              type="number"
              min="0"
              {...register("water", { required: true })}
              className="w-full"
            />
          </div>
        </div>

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
        disabled={!isFormComplete}
      >
        Save Today's Progress
      </Button>
    </form>
  );
};

export default DailyHealthForm;
