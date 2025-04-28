
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export interface ConfidenceStep {
  text: string;
  rating: number;
}

export const useConfidenceSteps = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confidenceSteps, setConfidenceSteps] = useState<ConfidenceStep[]>(
    Array.from({ length: 5 }, () => ({
      text: "",
      rating: 1
    }))
  );
  const [selectedConfidenceStep, setSelectedConfidenceStep] = useState("");

  useEffect(() => {
    fetchExistingData();
  }, [user]);

  const fetchExistingData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("motivation_confidence_steps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        let parsedSteps: ConfidenceStep[] = [];
        
        if (data.confidence_steps) {
          try {
            // Convert the retrieved JSON data to the expected type
            if (typeof data.confidence_steps === 'string') {
              parsedSteps = JSON.parse(data.confidence_steps) as ConfidenceStep[];
            } else {
              // Cast the Json[] to the correct type using type assertion
              const jsonArray = data.confidence_steps as unknown;
              if (Array.isArray(jsonArray)) {
                parsedSteps = (jsonArray as any[]).map(item => ({
                  text: item.text || "",
                  rating: parseInt(item.rating) || 1
                }));
              }
            }
          } catch (parseError) {
            console.error("Error parsing confidence steps:", parseError);
            parsedSteps = [];
          }
          
          // Ensure we have 5 steps
          if (parsedSteps.length < 5) {
            const additionalSteps = Array.from({ length: 5 - parsedSteps.length }, () => ({
              text: "",
              rating: 1
            }));
            parsedSteps = [...parsedSteps, ...additionalSteps];
          }
          
          setConfidenceSteps(parsedSteps);
        }
        
        if (data.selected_confidence_step) {
          setSelectedConfidenceStep(data.selected_confidence_step);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load your previous responses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepChange = (index: number, field: keyof ConfidenceStep, value: string | number) => {
    setConfidenceSteps(prevSteps => 
      prevSteps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent, onComplete?: () => void) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_confidence_steps")
        .insert({
          user_id: user.id,
          confidence_steps: JSON.stringify(confidenceSteps),
          selected_confidence_step: selectedConfidenceStep
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    confidenceSteps,
    selectedConfidenceStep,
    setSelectedConfidenceStep,
    handleStepChange,
    handleSubmit
  };
};
