
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface AffirmationItem {
  criticism: string;
  positive: string;
}

// Type guard to check if an item has criticism and positive properties
function isAffirmationItem(item: any): item is AffirmationItem {
  return typeof item === 'object' && item !== null && 
         'criticism' in item && 'positive' in item;
}

export const useAffirmationsForm = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [affirmations, setAffirmations] = useState<AffirmationItem[]>(
    Array(5).fill({}).map(() => ({ criticism: "", positive: "" }))
  );

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("motivation_affirmations")
        .select("affirmations")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      console.log("Raw affirmations data:", data?.affirmations);
      
      if (data?.affirmations) {
        // Initialize default array with proper instances to avoid reference issues
        let parsedAffirmations: AffirmationItem[] = Array(5).fill({}).map(() => ({ criticism: "", positive: "" }));
        
        try {
          // Parse the affirmations data based on its format
          if (typeof data.affirmations === 'object') {
            console.log("Affirmations is an object:", data.affirmations);
            
            // Handle case when the object has direct numerical keys (0, 1, 2...)
            if ('0' in data.affirmations || '1' in data.affirmations) {
              console.log("Object has numeric keys");
              for (let i = 0; i < 5; i++) {
                const item = (data.affirmations as any)[i];
                if (item) {
                  parsedAffirmations[i] = {
                    criticism: item.criticism || "",
                    positive: item.positive || ""
                  };
                }
              }
            } 
            // Handle case when it's in the format { affirmations: [...] }
            else if ('affirmations' in data.affirmations) {
              console.log("Object has 'affirmations' key");
              const affArray = (data.affirmations as any).affirmations;
              if (Array.isArray(affArray)) {
                for (let i = 0; i < Math.min(affArray.length, 5); i++) {
                  const item = affArray[i];
                  if (item) {
                    parsedAffirmations[i] = {
                      criticism: item.criticism || "",
                      positive: item.positive || ""
                    };
                  }
                }
              }
            }
            // Handle direct array format
            else if (Array.isArray(data.affirmations)) {
              console.log("Data is an array");
              for (let i = 0; i < Math.min(data.affirmations.length, 5); i++) {
                const item = data.affirmations[i];
                if (item && typeof item === 'object') {
                  parsedAffirmations[i] = {
                    criticism: (item as any).criticism || "",
                    positive: (item as any).positive || ""
                  };
                }
              }
            }
          }
          // Handle string format that needs parsing
          else if (typeof data.affirmations === 'string') {
            console.log("Affirmations is a string, attempting to parse");
            try {
              const parsed = JSON.parse(data.affirmations);
              if (Array.isArray(parsed)) {
                for (let i = 0; i < Math.min(parsed.length, 5); i++) {
                  const item = parsed[i];
                  if (item && typeof item === 'object') {
                    parsedAffirmations[i] = {
                      criticism: (item as any).criticism || "",
                      positive: (item as any).positive || ""
                    };
                  }
                }
              }
            } catch (parseError) {
              console.error("Failed to parse affirmations string:", parseError);
            }
          }
          
          console.log("Parsed affirmations before setting:", parsedAffirmations);
          setAffirmations(parsedAffirmations);
          
        } catch (parseError) {
          console.error("Error parsing affirmations data:", parseError);
          toast({
            title: "Error",
            description: "Failed to parse affirmations data",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching affirmations:", error);
      toast({
        title: "Error",
        description: "Failed to load your affirmations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAffirmation = (index: number, field: keyof AffirmationItem, value: string) => {
    const updatedAffirmations = [...affirmations];
    updatedAffirmations[index] = {
      ...updatedAffirmations[index],
      [field]: value
    };
    setAffirmations(updatedAffirmations);
  };

  const saveAffirmations = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Filter out completely empty rows
      const filteredAffirmations = affirmations.filter(
        item => item.criticism.trim() !== "" || item.positive.trim() !== ""
      );
      
      console.log("Saving affirmations:", filteredAffirmations);
      
      const { error } = await supabase
        .from("motivation_affirmations")
        .upsert({
          user_id: user.id,
          affirmations: filteredAffirmations as unknown as Json,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update step progress
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 49, // Affirmations is step 49
            step_name: "Affirmations",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );
      
      if (progressError) throw progressError;
      
      // Explicitly enable the next step (54) by marking it as available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 54, // Social and Cultural Resources
            step_name: "Social and Cultural Resources",
            completed: false,
            available: true, // Explicitly mark as available
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;
      
      toast({
        title: "Success",
        description: "Your affirmations have been saved"
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving affirmations:", error);
      toast({
        title: "Error",
        description: "Failed to save your affirmations",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    affirmations,
    isLoading,
    isSaving,
    updateAffirmation,
    saveAffirmations
  };
};
