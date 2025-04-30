
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
    Array(5).fill({ criticism: "", positive: "" })
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
      
      if (data?.affirmations) {
        console.log("Raw affirmations data:", data.affirmations);
        
        // Parse the affirmations data based on its structure
        let parsedAffirmations: AffirmationItem[] = [];
        
        if (Array.isArray(data.affirmations)) {
          // Type assertion for the JSON data
          const affArray = data.affirmations as unknown as any[];
          
          // Validate and transform each item to ensure it matches AffirmationItem structure
          parsedAffirmations = affArray.map(item => ({
            criticism: typeof item.criticism === 'string' ? item.criticism : '',
            positive: typeof item.positive === 'string' ? item.positive : ''
          }));
        } else if (typeof data.affirmations === 'string') {
          // It might be a JSON string, try to parse it
          try {
            const parsed = JSON.parse(data.affirmations);
            if (Array.isArray(parsed)) {
              parsedAffirmations = parsed.map(item => ({
                criticism: typeof item.criticism === 'string' ? item.criticism : '',
                positive: typeof item.positive === 'string' ? item.positive : ''
              }));
            }
          } catch (e) {
            console.error("Failed to parse affirmations JSON string:", e);
          }
        } else if (typeof data.affirmations === 'object' && data.affirmations !== null) {
          // It might be a nested object with the affirmations inside
          const affObj = data.affirmations as any;
          
          if (Array.isArray(affObj)) {
            parsedAffirmations = affObj.map(item => ({
              criticism: typeof item.criticism === 'string' ? item.criticism : '',
              positive: typeof item.positive === 'string' ? item.positive : ''
            }));
          } else if (affObj.affirmations && Array.isArray(affObj.affirmations)) {
            parsedAffirmations = affObj.affirmations.map(item => ({
              criticism: typeof item.criticism === 'string' ? item.criticism : '',
              positive: typeof item.positive === 'string' ? item.positive : ''
            }));
          } else {
            // Last resort: try to extract values if it's an object with numeric keys
            const values = Object.values(affObj).filter(
              item => item && typeof item === 'object' && 'criticism' in item && 'positive' in item
            );
            
            parsedAffirmations = values.map(item => ({
              criticism: typeof (item as any).criticism === 'string' ? (item as any).criticism : '',
              positive: typeof (item as any).positive === 'string' ? (item as any).positive : ''
            }));
          }
        }
        
        console.log("Parsed affirmations:", parsedAffirmations);
        
        // Ensure we have at least 5 rows for the form
        if (parsedAffirmations.length < 5) {
          const additionalRows = Array(5 - parsedAffirmations.length).fill({ criticism: "", positive: "" });
          setAffirmations([...parsedAffirmations, ...additionalRows]);
        } else {
          setAffirmations(parsedAffirmations);
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
      
      const { error } = await supabase
        .from("motivation_affirmations")
        .upsert({
          user_id: user.id,
          // Explicit cast to ensure TypeScript knows we're handling this correctly
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
