
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export interface ConfidenceTalkEntry {
  unhelpful: string;
  helpful: string;
}

export const useConfidenceTalk = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [confidenceTalk, setConfidenceTalk] = useState<ConfidenceTalkEntry[]>([
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" }
  ]);

  // Example entries for UI display
  const examples: ConfidenceTalkEntry[] = [
    {
      unhelpful: "I can't handle the hunger when I try to eat less.",
      helpful: "I can learn strategies to better cope with hunger pangs."
    },
    {
      unhelpful: "I don't see how I can make time to go to the gym to exercise.",
      helpful: "I can find creative ways to exercise, even if it isn't at a gym."
    }
  ];

  useEffect(() => {
    fetchExistingData();
  }, [user]);

  const fetchExistingData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("motivation_confidence_talk")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.confidence_talk) {
        let parsedTalk: ConfidenceTalkEntry[] = [];
        
        try {
          // Convert the retrieved JSON data to the expected type
          if (typeof data.confidence_talk === 'string') {
            parsedTalk = JSON.parse(data.confidence_talk) as ConfidenceTalkEntry[];
          } else {
            // Cast the Json[] to the correct type using type assertion
            const jsonArray = data.confidence_talk as any;
            if (Array.isArray(jsonArray)) {
              parsedTalk = jsonArray.map(item => ({
                unhelpful: item.unhelpful || "",
                helpful: item.helpful || ""
              }));
            }
          }
        } catch (parseError) {
          console.error("Error parsing confidence talk:", parseError);
          parsedTalk = [];
        }
        
        // Ensure we have 5 entries
        if (parsedTalk.length < 5) {
          const additionalEntries = Array.from({ length: 5 - parsedTalk.length }, () => ({
            unhelpful: "",
            helpful: ""
          }));
          parsedTalk = [...parsedTalk, ...additionalEntries];
        }
        
        setConfidenceTalk(parsedTalk);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load your previous responses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntryChange = (index: number, field: keyof ConfidenceTalkEntry, value: string) => {
    setConfidenceTalk(prevTalk => 
      prevTalk.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent, onComplete?: () => void) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_confidence_talk")
        .insert({
          user_id: user.id,
          confidence_talk: JSON.stringify(confidenceTalk)
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    confidenceTalk,
    examples,
    handleEntryChange,
    handleSubmit
  };
};
