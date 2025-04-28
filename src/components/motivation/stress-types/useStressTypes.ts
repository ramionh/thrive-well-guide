import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { toast } from "@/components/ui/use-toast";
import { StressType } from "./StressTypeTable";

interface UseStressTypesProps {
  onComplete?: () => void;
}

interface StressTypesData {
  stress_types: StressType[];
}

export const useStressTypes = ({ onComplete }: UseStressTypesProps = {}) => {
  const { user } = useUser();
  const [stressTypes, setStressTypes] = useState<StressType[]>([]);
  const [isLoadingStressors, setIsLoadingStressors] = useState(true);

  // Fetch stressors from the previous step
  useEffect(() => {
    const fetchStressors = async () => {
      if (!user) return;

      try {
        setIsLoadingStressors(true);
        
        // Fetch stressors from ManagingStress step
        const { data, error } = await supabase
          .from("motivation_managing_stress")
          .select("stressors")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // Fetch any existing stress type classifications
        const { data: existingData, error: fetchError } = await supabase
          .from("motivation_stress_types")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data?.stressors && Array.isArray(data.stressors)) {
          // Ensure we're working with string values and filter out empty stressors
          const filteredStressors = data.stressors
            .map(s => typeof s === 'string' ? s.trim() : String(s).trim())
            .filter(s => s !== "");
          
          // Check if we have existing data with complete null checks
          if (existingData && 
              existingData !== null && 
              typeof existingData === 'object' && 
              'stress_types' in existingData && 
              Array.isArray(existingData.stress_types)) {
            // If we have existing data, use it
            setStressTypes(existingData.stress_types);
          } else {
            // Otherwise initialize with stressors but empty type selections
            setStressTypes(
              filteredStressors.map(stressor => ({
                stressor,
                type: ""
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching stressors:", error);
        toast({
          title: "Error",
          description: "Failed to load stressors from previous step",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStressors(false);
      }
    };

    fetchStressors();
  }, [user]);

  const handleStressTypeChange = (index: number, value: "Distress" | "Eustress") => {
    const updatedStressTypes = [...stressTypes];
    updatedStressTypes[index].type = value;
    setStressTypes(updatedStressTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Check if all stress types have been selected
    const allTypesSelected = stressTypes.every(item => item.type !== "");
    
    if (!allTypesSelected) {
      toast({
        title: "Please complete all fields",
        description: "Please classify each stressor as either Distress or Eustress",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Insert the data into the database
      const { error } = await supabase
        .from("motivation_stress_types")
        .insert({
          user_id: user.id,
          stress_types: stressTypes
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
      console.error("Error saving stress types:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    }
  };

  return {
    stressTypes,
    isLoadingStressors,
    handleStressTypeChange,
    handleSubmit,
  };
};
