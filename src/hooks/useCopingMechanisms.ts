
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface CopingMechanismsData {
  currentTechniques: string[];
  newTechniques: string[];
  explanation: string;
}

export const useCopingMechanisms = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CopingMechanismsData>({
    currentTechniques: ["", ""],
    newTechniques: ["", ""],
    explanation: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("motivation_coping_mechanisms")
          .select("current_techniques, new_techniques, explanation")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Set form data from database record
          setFormData({
            currentTechniques: data.current_techniques as unknown as string[],
            newTechniques: data.new_techniques as unknown as string[],
            explanation: data.explanation || ""
          });
        }
      } catch (error) {
        console.error("Error fetching coping mechanisms data:", error);
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

  const handleCurrentTechniqueChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedTechniques = [...prev.currentTechniques];
      updatedTechniques[index] = value;
      return {
        ...prev,
        currentTechniques: updatedTechniques,
      };
    });
  };

  const handleNewTechniqueChange = (index: number, value: string) => {
    setFormData(prev => {
      const updatedTechniques = [...prev.newTechniques];
      updatedTechniques[index] = value;
      return {
        ...prev,
        newTechniques: updatedTechniques,
      };
    });
  };

  const handleExplanationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      explanation: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.currentTechniques.every(technique => technique.trim() !== "") &&
      formData.newTechniques.every(technique => technique.trim() !== "") &&
      formData.explanation.trim() !== ""
    );
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
        .from("motivation_coping_mechanisms")
        .insert({
          user_id: user.id,
          current_techniques: formData.currentTechniques as unknown as any,
          new_techniques: formData.newTechniques as unknown as any,
          explanation: formData.explanation
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your coping mechanisms have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving coping mechanisms:", error);
      toast({
        title: "Error",
        description: "Failed to save your coping mechanisms",
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
    handleCurrentTechniqueChange,
    handleNewTechniqueChange,
    handleExplanationChange,
    handleSubmit,
  };
};
