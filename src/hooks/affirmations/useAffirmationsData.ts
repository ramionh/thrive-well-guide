
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AffirmationItem } from "./types";
import { parseAffirmationsData } from "./parseAffirmationsData";

export const useAffirmationsData = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [affirmations, setAffirmations] = useState<AffirmationItem[]>(
    Array(5).fill({}).map(() => ({ criticism: "", positive: "" }))
  );

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
        const parsedAffirmations = parseAffirmationsData(data);
        setAffirmations(parsedAffirmations);
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

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Add the refresh function to allow manual data refresh
  const refresh = () => {
    if (user) {
      fetchData();
    }
  };

  return {
    affirmations,
    setAffirmations,
    isLoading,
    refresh
  };
};
