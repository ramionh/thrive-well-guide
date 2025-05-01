
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AffirmationItem } from "./types";
import { Json } from "@/integrations/supabase/types";

export const useSaveAffirmations = (
  affirmations: AffirmationItem[],
  recordId: string | null,
  onComplete?: () => void
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveAffirmations = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Drop any totally blank rows
      const filtered = affirmations.filter(
        (x) => x.criticism.trim() || x.positive.trim()
      );

      console.log("⏳ Saving affirmations:", filtered);

      // Build our payload — including `id` if we fetched one
      const payload: any = {
        user_id: user.id,
        affirmations: filtered as unknown as Json,
        updated_at: new Date().toISOString(),
      };
      if (recordId) {
        payload.id = recordId;
      }

      // Upsert: by default it will ON CONFLICT on the PK column (`id`)
      const { error } = await supabase
        .from("motivation_affirmations")
        .upsert(payload);

      if (error) throw error;

      console.log("✅ Saved affirmations");
      toast({ title: "Saved", description: "Your affirmations are updated." });
      onComplete?.();
    } catch (e) {
      console.error("❌ Error saving affirmations:", e);
      toast({
        title: "Error",
        description: "Could not save your affirmations",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveAffirmations };
};
