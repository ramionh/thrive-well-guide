
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface GrowthMindsetFormData {
  learning: string;
  feedback: string;
  challenges: string;
  newThings: string;
}

export const useGrowthMindset = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<GrowthMindsetFormData>({
    learning: "",
    feedback: "",
    challenges: "",
    newThings: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("motivation_growth_mindset")
          .select("learning, feedback, challenges, new_things")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setFormData({
            learning: data.learning || "",
            feedback: data.feedback || "",
            challenges: data.challenges || "",
            newThings: data.new_things || "",
          });
        }
      } catch (error) {
        console.error("Error fetching growth mindset data:", error);
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

  const handleInputChange = (field: keyof GrowthMindsetFormData, value: string) => {
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
        .from("motivation_growth_mindset")
        .insert({
          user_id: user.id,
          learning: formData.learning,
          feedback: formData.feedback,
          challenges: formData.challenges,
          new_things: formData.newThings
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your growth mindset practice has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving growth mindset data:", error);
      toast({
        title: "Error",
        description: "Failed to save your growth mindset practice",
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
