
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
        .single();
      
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      
      if (data?.affirmations) {
        // Cast the Json type to our AffirmationItem array with type assertion
        const savedAffirmations = data.affirmations as unknown as AffirmationItem[];
        
        // Ensure we have at least 5 rows for the form
        if (savedAffirmations.length < 5) {
          const additionalRows = Array(5 - savedAffirmations.length).fill({ criticism: "", positive: "" });
          setAffirmations([...savedAffirmations, ...additionalRows]);
        } else {
          setAffirmations(savedAffirmations);
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
            step_number: 14, // Assuming Affirmations is step 14
            step_name: "Affirmations",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );
      
      if (progressError) throw progressError;
      
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
