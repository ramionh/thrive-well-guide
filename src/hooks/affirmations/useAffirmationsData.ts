
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AffirmationItem } from "./types";
import { parseAffirmationsData } from "./parseAffirmationsData";

export const useAffirmationsData = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // Are we still fetching?
  const [isLoading, setIsLoading] = useState(true);
  // The PK of the row we'll upsert against
  const [recordId, setRecordId] = useState<string | null>(null);
  // Default to 5 blank rows
  const [affirmations, setAffirmations] = useState<AffirmationItem[]>(
    Array(5).fill(0).map(() => ({ criticism: "", positive: "" }))
  );

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("⏳ Fetching affirmations for", user!.id);

      // Pull back exactly one row, newest first
      const { data, error } = await supabase
        .from("motivation_affirmations")
        .select("id, affirmations")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single(); // nice shorthand for exactly one or error

      // If no rows exist yet, PostgREST returns PGRST116 — safe to ignore
      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        console.log("✅ Retrieved row:", data);
        setRecordId(data.id);

        // Turn the raw JSON into an array of exactly 5 items
        const parsed = parseAffirmationsData(data);
        setAffirmations(parsed);
      }
    } catch (e) {
      console.error("❌ Error fetching affirmations:", e);
      toast({
        title: "Error",
        description: "Could not load your affirmations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { recordId, affirmations, setAffirmations, isLoading };
};
