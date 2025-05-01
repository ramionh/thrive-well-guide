
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AffirmationItem } from "./types";
import { Json } from "@/integrations/supabase/types";

export const useSaveAffirmations = (
  affirmations: AffirmationItem[],
  onComplete?: () => void
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
            available: true, // Explicitly mark as available
            completed: false,
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
    isSaving,
    saveAffirmations
  };
};
