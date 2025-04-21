
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export type Step = {
  id: number;
  title: string;
  description: string;
  component: React.ReactNode;
  completed: boolean;
};

export const useMotivationSteps = (initialSteps: Step[]) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepId, setCurrentStepId] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchStepProgress = async () => {
      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('step_number, completed')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching step progress:', error);
        return;
      }

      if (data) {
        setSteps(prevSteps => 
          prevSteps.map(step => ({
            ...step,
            completed: data.some(p => p.step_number === step.id && p.completed)
          }))
        );
      }
    };

    fetchStepProgress();
  }, [user]);

  const handleStepClick = (stepId: number) => {
    const maxAllowedStep = steps.filter((s) => s.completed).reduce(
      (max, step) => Math.max(max, step.id + 1),
      1
    );
    
    if (stepId <= maxAllowedStep) {
      setCurrentStepId(stepId);
    }
  };

  const markStepComplete = async (stepId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: stepId,
          step_name: steps.find(s => s.id === stepId)?.title || '',
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.id === stepId 
            ? { ...step, completed: true } 
            : step
        )
      );
      
      const nextStepId = stepId + 1;
      if (steps.some(step => step.id === nextStepId)) {
        setCurrentStepId(nextStepId);
      }

      toast({
        title: "Step completed",
        description: "Your progress has been saved"
      });
    } catch (error) {
      console.error('Error saving step progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  return {
    steps,
    currentStepId,
    handleStepClick,
    markStepComplete,
    currentStep: steps.find((step) => step.id === currentStepId)
  };
};
