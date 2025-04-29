
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
  const [stressTypes, setStressTypes] = useState<StressType[]>([
    { stressor: "", type: "" },
    { stressor: "", type: "" },
    { stressor: "", type: "" },
    { stressor: "", type: "" },
    { stressor: "", type: "" },
  ]);
  const [isLoadingStressors, setIsLoadingStressors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStressTypes = async () => {
      if (!user) return;
      
      try {
        setIsLoadingStressors(true);
        
        // Check if we have existing stress type data
        const { data: stressTypesData, error: stressTypesError } = await supabase
          .from("motivation_stress_types")
          .select("stress_types")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (stressTypesError) throw stressTypesError;
        
        if (stressTypesData && stressTypesData.stress_types) {
          // First cast to unknown, then to the expected type
          const existingTypes = stressTypesData.stress_types as unknown as StressType[];
          
          // Ensure we have exactly 5 entries
          let updatedTypes = [...existingTypes];
          while (updatedTypes.length < 5) {
            updatedTypes.push({ stressor: "", type: "" });
          }
          
          setStressTypes(updatedTypes.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching stress types data:", error);
        toast({
          title: "Error",
          description: "Failed to load your stress types",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStressors(false);
      }
    };

    fetchStressTypes();
  }, [user, toast]);

  const handleStressorChange = (index: number, value: string) => {
    const newStressTypes = [...stressTypes];
    newStressTypes[index] = {
      ...newStressTypes[index],
      stressor: value
    };
    setStressTypes(newStressTypes);
  };

  const handleTypeChange = (index: number, type: "distress" | "eustress" | "") => {
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
    
    // Filter out empty entries
    const validEntries = stressTypes.filter(entry => entry.stressor.trim() !== "");
    
    if (validEntries.length === 0) {
      toast({
        title: "No stressors entered",
        description: "Please enter at least one stressor before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if a record already exists for this user
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_stress_types")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (queryError) throw queryError;
      
      let result;
      
      // Convert StressType[] to a format compatible with Json type
      const stressTypesJson = JSON.parse(JSON.stringify(validEntries));
      
      if (existingData && existingData.id) {
        // Update existing record
        result = await supabase
          .from("motivation_stress_types")
          .update({
            stress_types: stressTypesJson,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from("motivation_stress_types")
          .insert({
            user_id: user.id,
            stress_types: stressTypesJson
          });
      }
      
      if (result.error) throw result.error;
      
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
    handleStressorChange,
    handleTypeChange,
    handleSubmit,
  };
};
