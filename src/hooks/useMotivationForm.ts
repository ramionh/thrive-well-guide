
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

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
      // Cast the table name to any to avoid TypeScript limitations
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        // Double-cast to avoid TypeScript errors: first to unknown, then to Partial<T>
        setFormData((prev) => {
          const safeData = data as unknown as Partial<T>;
          return {
            ...prev,
            ...safeData
          };
        });
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

  const submitForm = async (e?: React.FormEvent, onComplete?: () => void) => {
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
      
      // Cast the table name to any to avoid TypeScript limitations
      const { error } = await supabase
        .from(tableName as any)
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

      if (onComplete) {
        onComplete();
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
