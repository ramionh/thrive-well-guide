
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface MindfulnessFormData {
  thoughts: string;
  feelings: string;
  bodyReactions: string;
  afterFeelings: string;
  goalApplication: string;
}

export const useMindfulness = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MindfulnessFormData>({
    thoughts: "",
    feelings: "",
    bodyReactions: "",
    afterFeelings: "",
    goalApplication: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("motivation_mindfulness")
          .select("thoughts, feelings, body_reactions, after_feelings, goal_application")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            thoughts: data.thoughts || "",
            feelings: data.feelings || "",
            bodyReactions: data.body_reactions || "",
            afterFeelings: data.after_feelings || "",
            goalApplication: data.goal_application || "",
          });
        }
      } catch (error) {
        console.error("Error fetching mindfulness data:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleInputChange = (field: keyof MindfulnessFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!isFormValid()) {
      toast({
        title: "Form incomplete",
        description: "Please fill in all fields before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_mindfulness")
        .insert({
          user_id: user.id,
          thoughts: formData.thoughts,
          feelings: formData.feelings,
          body_reactions: formData.bodyReactions,
          after_feelings: formData.afterFeelings,
          goal_application: formData.goalApplication
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your mindfulness practice has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving mindfulness data:", error);
      toast({
        title: "Error",
        description: "Failed to save your mindfulness practice",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  };
};
