
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";

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
  const didInitialFetchRef = useRef(false);

  useEffect(() => {
    const fetchStressTypes = async () => {
      if (!user || didInitialFetchRef.current) return;
      
      try {
        setIsLoadingStressors(true);
        didInitialFetchRef.current = true;
        
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
          // Cast the data properly
          const fetchedTypes: StressType[] = (stressTypesData.stress_types as any[]).map(item => ({
            stressor: item.stressor || "",
            type: item.type || ""
          }));
          
          // Ensure we have exactly 5 entries
          let updatedTypes = [...fetchedTypes];
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
      
      // Convert to plain objects for JSON serialization
      const stressTypesPlainObjects = validEntries.map(entry => ({
        stressor: entry.stressor,
        type: entry.type
      }));
      
      if (existingData && existingData.id) {
        // Update existing record
        const { error } = await supabase
          .from("motivation_stress_types")
          .update({
            stress_types: stressTypesPlainObjects,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("motivation_stress_types")
          .insert({
            user_id: user.id,
            stress_types: stressTypesPlainObjects
          });
          
        if (error) throw error;
      }
      
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
