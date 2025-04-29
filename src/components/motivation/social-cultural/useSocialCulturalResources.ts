
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialCulturalFormData {
  culturalBeliefs: string;
  culturalCustoms: string;
  religiousBeliefs: string;
}

export const useSocialCulturalResources = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SocialCulturalFormData>({
    culturalBeliefs: "",
    culturalCustoms: "",
    religiousBeliefs: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_social_cultural_resources")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            culturalBeliefs: data.cultural_beliefs || "",
            culturalCustoms: data.cultural_customs || "",
            religiousBeliefs: data.religious_beliefs || ""
          });
        }
      } catch (error) {
        console.error("Error fetching social cultural resources:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const updateForm = (field: keyof SocialCulturalFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Check if a record already exists for this user
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_social_cultural_resources")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (queryError) throw queryError;
      
      let result;
      
      const dataToSubmit = {
        cultural_beliefs: formData.culturalBeliefs,
        cultural_customs: formData.culturalCustoms,
        religious_beliefs: formData.religiousBeliefs
      };
      
      if (existingData && existingData.id) {
        // Update existing record
        result = await supabase
          .from("motivation_social_cultural_resources")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        result = await supabase
          .from("motivation_social_cultural_resources")
          .insert({
            user_id: user.id,
            ...dataToSubmit
          });
      }
      
      if (result.error) throw result.error;
      
      // Update the step progress for step 50
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 50,
            step_name: "Social and Cultural Resources",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );
        
      if (progressError) throw progressError;
      
      // Enable step 55 by marking it as the next available step
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 55,
            step_name: "Environmental or Situational Supports and Resources",
            completed: false,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      // Call the onComplete callback to move to the next step
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving social cultural resources:", error);
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
    formData,
    isLoading,
    isSubmitting,
    updateForm,
    handleSubmit
  };
};
