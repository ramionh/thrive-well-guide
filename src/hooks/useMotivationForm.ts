
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseMotivationFormOptions<T> {
  tableName: string;
  initialState: T;
  onSuccess?: () => void;
  transformData?: (data: T) => any;
  validateData?: (data: T) => boolean | string;
}

export const useMotivationForm = <T extends Record<string, any>>({
  tableName,
  initialState,
  onSuccess,
  transformData,
  validateData
}: UseMotivationFormOptions<T>) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data
        }));
      }

      return data;
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      toast({
        title: "Error",
        description: "Failed to load your previous responses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitForm = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!user) return;

    if (validateData) {
      const validationResult = validateData(formData);
      if (validationResult !== true) {
        toast({
          title: "Validation Error",
          description: typeof validationResult === 'string' ? validationResult : "Please check your inputs",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = transformData ? transformData(formData) : formData;
      
      const { error } = await supabase
        .from(tableName)
        .insert({
          user_id: user.id,
          ...dataToSubmit
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error saving to ${tableName}:`, error);
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
    fetchData,
    updateForm,
    submitForm
  };
};
