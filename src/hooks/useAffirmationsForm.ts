
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface AffirmationItem {
  criticism: string;
  positive: string;
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
      console.log("Fetching affirmations data for user:", user.id);
      
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from("motivation_affirmations")
        .select("affirmations")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      console.log("Raw affirmations data:", data);
      
      if (data) {
        // Initialize default array with proper instances to avoid reference issues
        let parsedAffirmations: AffirmationItem[] = Array(5).fill({}).map(() => ({ criticism: "", positive: "" }));
        
        try {
          // Find the actual affirmations array in the response
          let affirmationsData = null;
          
          if (data.affirmations) {
            // Check if it's a string that needs to be parsed
            if (typeof data.affirmations === 'string') {
              try {
                affirmationsData = JSON.parse(data.affirmations);
              } catch (e) {
                console.error("Failed to parse affirmations string");
              }
            } else {
              affirmationsData = data.affirmations;
            }
            
            console.log("Affirmations data (pre-processing):", affirmationsData);
            
            // If we have a nested 'affirmations' property, use that
            if (affirmationsData && typeof affirmationsData === 'object') {
              if ('affirmations' in affirmationsData) {
                affirmationsData = affirmationsData.affirmations;
              }
            }
            
            // Check if it's an array directly
            if (Array.isArray(affirmationsData)) {
              // Direct array format
              for (let i = 0; i < Math.min(affirmationsData.length, 5); i++) {
                const item = affirmationsData[i];
                if (item && typeof item === 'object') {
                  parsedAffirmations[i] = {
                    criticism: item.criticism || "",
                    positive: item.positive || ""
                  };
                }
              }
            } 
            // Check if it has numbered properties (0, 1, 2...) that should be treated as an array
            else if (affirmationsData && typeof affirmationsData === 'object') {
              // It might contain a nested 'affirmations' array
              if (Array.isArray(affirmationsData.affirmations)) {
                for (let i = 0; i < Math.min(affirmationsData.affirmations.length, 5); i++) {
                  const item = affirmationsData.affirmations[i];
                  if (item && typeof item === 'object') {
                    parsedAffirmations[i] = {
                      criticism: item.criticism || "",
                      positive: item.positive || ""
                    };
                  }
                }
              }
              // Handle key-value pairs where keys are numbers or strings like "0", "1", etc.
              else {
                for (let i = 0; i < 5; i++) {
                  const item = affirmationsData[i] || affirmationsData[String(i)];
                  if (item && typeof item === 'object') {
                    parsedAffirmations[i] = {
                      criticism: item.criticism || "",
                      positive: item.positive || ""
                    };
                  }
                }
              }
              
              // Look for specific format with "first", "Second", etc.
              if (parsedAffirmations.every(a => a.criticism === "" && a.positive === "")) {
                console.log("Checking for special format with 'first', etc.");
                if (affirmationsData[0] && affirmationsData[0].criticism === "first") {
                  for (let i = 0; i < 5; i++) {
                    const item = affirmationsData[i];
                    if (item && typeof item === 'object') {
                      parsedAffirmations[i] = {
                        criticism: item.criticism || "",
                        positive: item.positive || ""
                      };
                    }
                  }
                }
              }
            }
          }
          
          console.log("Parsed affirmations:", parsedAffirmations);
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
