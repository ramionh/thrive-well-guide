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
      
      console.log("Raw affirmations data:", data?.affirmations);
      
      if (data?.affirmations) {
        // Properly parse the affirmations data regardless of format
        let parsedAffirmations: AffirmationItem[] = [];
        
        try {
          // Handle case when affirmations is already a parsed JSON array
          if (Array.isArray(data.affirmations)) {
            console.log("Handling array format");
            parsedAffirmations = (data.affirmations as any[]).map(item => ({
              criticism: isAffirmationItem(item) ? item.criticism : '',
              positive: isAffirmationItem(item) ? item.positive : ''
            }));
          } 
          // Handle case when affirmations is a JSON string
          else if (typeof data.affirmations === 'string') {
            console.log("Handling string format");
            try {
              const parsed = JSON.parse(data.affirmations);
              if (Array.isArray(parsed)) {
                parsedAffirmations = parsed.map(item => ({
                  criticism: isAffirmationItem(item) ? item.criticism : '',
                  positive: isAffirmationItem(item) ? item.positive : ''
                }));
              }
            } catch (e) {
              console.error("Failed to parse affirmations string:", e);
            }
          }
          // Handle other possible formats (object format from Supabase)
          else if (data.affirmations && typeof data.affirmations === 'object') {
            console.log("Handling object format");
            
            // If it's a direct jsonb object from Supabase with numeric keys
            if ('0' in data.affirmations) {
              console.log("Detected numeric keys in object");
              const affirmationEntries = Object.entries(data.affirmations as Record<string, any>);
              parsedAffirmations = affirmationEntries.map(([_, value]) => ({
                criticism: isAffirmationItem(value) ? value.criticism : '',
                positive: isAffirmationItem(value) ? value.positive : ''
              }));
            } 
            // Otherwise try to convert object values to array
            else {
              const values = Object.values(data.affirmations as Record<string, any>);
              if (Array.isArray(values) && values.length > 0) {
                parsedAffirmations = values.map(item => ({
                  criticism: isAffirmationItem(item) ? item.criticism : '',
                  positive: isAffirmationItem(item) ? item.positive : ''
                }));
              }
            }
          }
          
          console.log("Parsed affirmations:", parsedAffirmations);
          
          // Ensure we have at least 5 rows for the form
          if (parsedAffirmations.length > 0) {
            if (parsedAffirmations.length < 5) {
              const additionalRows = Array(5 - parsedAffirmations.length).fill({ criticism: "", positive: "" });
              setAffirmations([...parsedAffirmations, ...additionalRows]);
            } else {
              setAffirmations(parsedAffirmations);
            }
          }
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
