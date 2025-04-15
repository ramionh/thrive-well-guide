import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Moon, Apple, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import SleepTab from "@/components/progress/SleepTab";
import NutritionTab from "@/components/progress/NutritionTab";
import ExerciseTab from "@/components/progress/ExerciseTab";
import GoalsTab from "@/components/progress/GoalsTab";

const AddProgressPage: React.FC = () => {
  const { user, updateGoal, addVital } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [sleepHours, setSleepHours] = useState("7.5");
  const [sleepQuality, setSleepQuality] = useState([70]);
  const [sleepAdherence, setSleepAdherence] = useState<"red" | "yellow" | "green">("yellow");
  
  const [calories, setCalories] = useState("2000");
  const [protein, setProtein] = useState("90");
  const [water, setWater] = useState("6");
  const [nutritionAdherence, setNutritionAdherence] = useState<"red" | "yellow" | "green">("yellow");
  
  const [exerciseMinutes, setExerciseMinutes] = useState("45");
  const [steps, setSteps] = useState("8000");
  const [exerciseAdherence, setExerciseAdherence] = useState<"red" | "yellow" | "green">("yellow");
  
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalProgress, setGoalProgress] = useState("");
  const [goalsAdherence, setGoalsAdherence] = useState<"red" | "yellow" | "green">("yellow");

  const handleSaveProgress = async () => {
    try {
      if (selectedGoal && goalProgress) {
        updateGoal(selectedGoal, {
          currentValue: parseFloat(goalProgress)
        });
      }
      
      addVital({
        name: "Sleep Duration",
        value: parseFloat(sleepHours),
        unit: "hours",
        category: "sleep"
      });
      
      addVital({
        name: "Sleep Quality",
        value: sleepQuality[0],
        unit: "%",
        category: "sleep"
      });
      
      addVital({
        name: "Calories",
        value: parseInt(calories),
        unit: "kcal",
        category: "nutrition"
      });
      
      addVital({
        name: "Protein",
        value: parseInt(protein),
        unit: "g",
        category: "nutrition"
      });
      
      addVital({
        name: "Water",
        value: parseInt(water),
        unit: "glasses",
        category: "nutrition"
      });
      
      addVital({
        name: "Exercise",
        value: parseInt(exerciseMinutes),
        unit: "minutes",
        category: "exercise"
      });
      
      addVital({
        name: "Steps",
        value: parseInt(steps),
        unit: "steps",
        category: "exercise"
      });
      
      const { error } = await supabase.from("daily_health_tracking").insert([{
        user_id: user?.id,
        sleep_hours: parseFloat(sleepHours),
        sleep_adherence: sleepAdherence,
        calories: parseInt(calories),
        protein: parseInt(protein),
        water: parseInt(water),
        nutrition_adherence: nutritionAdherence,
        exercise_minutes: parseInt(exerciseMinutes),
        steps: parseInt(steps),
        exercise_adherence: exerciseAdherence,
        goals_adherence: goalsAdherence,
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
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Record Your Progress</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
      
      <Tabs defaultValue="sleep">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="sleep" className="flex-1">
            <Moon className="mr-2 h-4 w-4" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex-1">
            <Apple className="mr-2 h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex-1">
            <Dumbbell className="mr-2 h-4 w-4" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex-1">
            Goals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sleep">
          <SleepTab
            sleepHours={sleepHours}
            setSleepHours={setSleepHours}
            sleepQuality={sleepQuality}
            setSleepQuality={setSleepQuality}
            sleepAdherence={sleepAdherence}
            setSleepAdherence={setSleepAdherence}
          />
        </TabsContent>
        
        <TabsContent value="nutrition">
          <NutritionTab
            calories={calories}
            setCalories={setCalories}
            protein={protein}
            setProtein={setProtein}
            water={water}
            setWater={setWater}
            nutritionAdherence={nutritionAdherence}
            setNutritionAdherence={setNutritionAdherence}
          />
        </TabsContent>
        
        <TabsContent value="exercise">
          <ExerciseTab
            exerciseMinutes={exerciseMinutes}
            setExerciseMinutes={setExerciseMinutes}
            steps={steps}
            setSteps={setSteps}
            exerciseAdherence={exerciseAdherence}
            setExerciseAdherence={setExerciseAdherence}
          />
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsTab
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            goalProgress={goalProgress}
            setGoalProgress={setGoalProgress}
            goalsAdherence={goalsAdherence}
            setGoalsAdherence={setGoalsAdherence}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-thrive-green hover:bg-thrive-green/90"
          onClick={handleSaveProgress}
        >
          Save Progress
        </Button>
      </div>
    </div>
  );
};

export default AddProgressPage;
