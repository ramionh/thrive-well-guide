
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Moon, Apple, Dumbbell } from "lucide-react";

import SleepTab from "@/components/progress/SleepTab";
import NutritionTab from "@/components/progress/NutritionTab";
import ExerciseTab from "@/components/progress/ExerciseTab";
import GoalsTab from "@/components/progress/GoalsTab";
import { useSleepForm, SleepFormState } from "@/hooks/useSleepForm";
import { useNutritionForm, NutritionFormState } from "@/hooks/useNutritionForm";
import { useExerciseForm, ExerciseFormState } from "@/hooks/useExerciseForm";
import { useGoalsForm, GoalsFormState } from "@/hooks/useGoalsForm";
import { useProgressSubmit } from "@/hooks/useProgressSubmit";
import { useToast } from "@/components/ui/use-toast";

const AddProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for each tab's form data
  const [sleepFormData, setSleepFormData] = useState<SleepFormState | null>(null);
  const [nutritionFormData, setNutritionFormData] = useState<NutritionFormState | null>(null);
  const [exerciseFormData, setExerciseFormData] = useState<ExerciseFormState | null>(null);
  const [goalsFormData, setGoalsFormData] = useState<GoalsFormState | null>(null);
  
  // Add state to track if all required data is present
  const [isFormComplete, setIsFormComplete] = useState(false);
  
  // Form submission logic
  const { handleSaveProgress } = useProgressSubmit();
  
  // Check if all required form data is available
  useEffect(() => {
    const checkFormCompletion = () => {
      const isSleepComplete = !!sleepFormData?.sleepHours;
      const isNutritionComplete = !!nutritionFormData?.calories && 
                                !!nutritionFormData?.protein && 
                                !!nutritionFormData?.water;
      const isExerciseComplete = !!exerciseFormData?.exerciseMinutes && 
                               !!exerciseFormData?.steps;
      const isGoalsComplete = !!goalsFormData?.goalsAdherence;
      
      setIsFormComplete(
        isSleepComplete && 
        isNutritionComplete && 
        isExerciseComplete && 
        isGoalsComplete
      );
    };
    
    checkFormCompletion();
  }, [sleepFormData, nutritionFormData, exerciseFormData, goalsFormData]);
  
  const handleSubmit = () => {
    // Validate that all form data is available
    if (!sleepFormData || !nutritionFormData || !exerciseFormData || !goalsFormData) {
      toast({
        variant: "destructive",
        title: "Missing data",
        description: "Please fill out all sections before saving your progress.",
      });
      return;
    }
    
    handleSaveProgress(
      sleepFormData,
      nutritionFormData,
      exerciseFormData,
      goalsFormData
    );
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
          <SleepTab onChange={setSleepFormData} />
        </TabsContent>
        
        <TabsContent value="nutrition">
          <NutritionTab onChange={setNutritionFormData} />
        </TabsContent>
        
        <TabsContent value="exercise">
          <ExerciseTab onChange={setExerciseFormData} />
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsTab onChange={setGoalsFormData} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-thrive-green hover:bg-thrive-green/90"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        >
          Save Progress
        </Button>
      </div>
    </div>
  );
};

export default AddProgressPage;
