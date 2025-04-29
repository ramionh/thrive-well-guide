
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useMotivationStepsDB } from "@/hooks/motivation/useMotivationStepsDB";
import type { Step } from "@/components/motivation/types/motivation";

interface UseMotivationFormProps<T, U> {
  tableName: string;
  initialState: T;
  onSuccess?: () => void;
  transformData?: (data: T) => U;
  stepNumber?: number;
  parseData?: (data: any) => T;
  steps?: Step[];
}

export const useMotivationForm = <T, U>({
  tableName,
  initialState,
  onSuccess,
  transformData,
  stepNumber,
  parseData,
  steps
}: UseMotivationFormProps<T, U>) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<T>(initialState);
  const { markStepComplete } = useMotivationStepsDB();

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log(`Raw data from ${tableName}:`, data);
      
      if (data) {
        // Use custom parser if provided, otherwise use default handling
        if (parseData) {
          const parsedData = parseData(data);
          console.log(`Parsed data for ${tableName}:`, parsedData);
          setFormData(parsedData);
        } else {
          // Default simple parsing
          const cleanedData = {} as T;
          Object.keys(initialState).forEach(key => {
            // @ts-ignore
            cleanedData[key] = data[key] !== undefined && data[key] !== null ? data[key] : initialState[key];
          });
          setFormData(cleanedData);
        }
      }
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load your data from ${tableName}`,
        variant: "destructive"
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

  const submitForm = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const dataToInsert: any = transformData 
        ? { user_id: user.id, ...transformData(formData), updated_at: new Date().toISOString() }
        : { user_id: user.id, ...formData, updated_at: new Date().toISOString() };
      
      console.log(`Submitting data to ${tableName}:`, dataToInsert);
      
      const { error } = await supabase
        .from(tableName)
        .upsert(dataToInsert);
      
      if (error) throw error;
      
      // Mark step as complete if stepNumber is provided
      if (stepNumber) {
        await markStepComplete(user.id, stepNumber, steps || []);
      }
      
      toast({
        title: "Success",
        description: "Your information has been saved"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error saving data to ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to save your information to ${tableName}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    updateForm,
    submitForm,
    isLoading,
    isSaving
  };
};
