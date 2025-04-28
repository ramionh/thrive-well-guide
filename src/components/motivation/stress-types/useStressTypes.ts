
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export interface StressType {
  stressor: string;
  type: "distress" | "eustress" | "";
}

interface UseStressTypesOptions {
  onComplete?: () => void;
}

export const useStressTypes = ({ onComplete }: UseStressTypesOptions = {}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [stressTypes, setStressTypes] = useState<StressType[]>([]);
  const [isLoadingStressors, setIsLoadingStressors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStressors = async () => {
      if (!user) return;
      
      try {
        setIsLoadingStressors(true);
        
        const { data: stressorsData, error: stressorsError } = await supabase
          .from("motivation_managing_stress")
          .select("stressors")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (stressorsError) throw stressorsError;
        
        const { data: stressTypesData, error: stressTypesError } = await supabase
          .from("motivation_stress_types")
          .select("stress_types")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (stressTypesError) throw stressTypesError;
        
        if (stressorsData && stressorsData.stressors && Array.isArray(stressorsData.stressors)) {
          if (stressTypesData && stressTypesData.stress_types) {
            // First cast to unknown, then to the expected type
            const existingTypes = stressTypesData.stress_types as unknown as StressType[];
            setStressTypes(existingTypes);
          } else {
            const initialStressTypes: StressType[] = stressorsData.stressors.map((stressor: string) => ({
              stressor,
              type: ""
            }));
            setStressTypes(initialStressTypes);
          }
        } else {
          setStressTypes([]);
        }
      } catch (error) {
        console.error("Error fetching stressors data:", error);
        toast({
          title: "Error",
          description: "Failed to load your stressors",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStressors(false);
      }
    };

    fetchStressors();
  }, [user, toast]);

  const handleStressTypeChange = (index: number, type: "distress" | "eustress" | "") => {
    const newStressTypes = [...stressTypes];
    newStressTypes[index] = {
      ...newStressTypes[index],
      type
    };
    setStressTypes(newStressTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_stress_types")
        .insert({
          user_id: user.id,
          stress_types: stressTypes as any
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your stress types have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving stress types:", error);
      toast({
        title: "Error",
        description: "Failed to save your stress types",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    stressTypes,
    isLoadingStressors,
    isSubmitting,
    handleStressTypeChange,
    handleSubmit,
  };
};
