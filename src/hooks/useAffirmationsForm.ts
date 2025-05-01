
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
      // Fetch data from Supabase
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
          // The data can come in various formats - let's handle them all
          let affirmationsArray: any[] = [];
          
          if (typeof data.affirmations === 'string') {
            // Handle string format
            try {
              affirmationsArray = JSON.parse(data.affirmations);
            } catch (e) {
              console.error("Failed to parse affirmations string");
            }
          } else if (Array.isArray(data.affirmations)) {
            // Direct array format
            affirmationsArray = data.affirmations;
          } else if (typeof data.affirmations === 'object' && data.affirmations !== null) {
            // Check if it's the nested format from the network response
            if ('affirmations' in data.affirmations && Array.isArray(data.affirmations.affirmations)) {
              affirmationsArray = data.affirmations.affirmations;
            } 
            // Check if it has numeric keys (0, 1, 2...)
            else if ('0' in data.affirmations || '1' in data.affirmations) {
              affirmationsArray = [];
              for (let i = 0; i < 5; i++) {
                if ((data.affirmations as any)[i]) {
                  affirmationsArray.push((data.affirmations as any)[i]);
                }
              }
            }
            // Check if it's the expanded object format from the network image
            else if (Object.keys(data.affirmations).length > 0) {
              affirmationsArray = Object.values(data.affirmations);
            }
          }
          
          // Process the array, handling different possible formats
          for (let i = 0; i < Math.min(affirmationsArray.length, 5); i++) {
            const item = affirmationsArray[i];
            
            if (item && typeof item === 'object') {
              // Format 1: {criticism: "...", positive: "..."}
              if ('criticism' in item && 'positive' in item) {
                parsedAffirmations[i] = {
                  criticism: item.criticism || "",
                  positive: item.positive || ""
                };
              } 
              // Format 2: {affirmations: [{positive: "...", criticism: "..."}, ...]}
              else if ('affirmations' in item && Array.isArray(item.affirmations)) {
                const affItem = item.affirmations[0];
                if (affItem && typeof affItem === 'object') {
                  parsedAffirmations[i] = {
                    criticism: affItem.criticism || "",
                    positive: affItem.positive || ""
                  };
                }
              } 
              // Format 3: {positive: "...", criticism: "..."}
              else if ('positive' in item && 'criticism' in item) {
                parsedAffirmations[i] = {
                  criticism: item.criticism || "",
                  positive: item.positive || ""
                };
              }
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
