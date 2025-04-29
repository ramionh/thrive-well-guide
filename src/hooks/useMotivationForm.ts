
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

export const useMotivationForm = <T, U = T>({
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
    if (!user) return null;
    
    setIsLoading(true);
    try {
      // Here we cast the tableName to any to avoid TypeScript errors with the table names
      const { data, error } = await supabase
        .from(tableName as any)
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
          // Use type-safe approach to iterate through keys
          Object.keys(initialState).forEach(key => {
            const dataKey = key as keyof typeof initialState;
            
            // Check if data has the key
            if (data[key] !== undefined) {
              // Handle arrays and objects that might be stored as strings
              if (typeof data[key] === 'string' && 
                 (key === 'characteristics' || key === 'examples' || 
                  key === 'values' || key === 'selected_values' || 
                  key === 'strength_applications' || key === 'feedback_entries' ||
                  key === 'actions' || key === 'steps' || key === 'ratings' ||
                  key === 'support_types' || key === 'confidence_scale' ||
                  key === 'confidence_talk' || key === 'confidence_steps' ||
                  key === 'stressors' || key === 'current_techniques' ||
                  key === 'new_techniques' || key === 'stress_ratings' ||
                  key === 'stress_types' || key === 'value_descriptions' ||
                  key === 'selected_values')) {
                try {
                  (cleanedData as any)[dataKey] = JSON.parse(data[key]);
                } catch (e) {
                  console.error(`Error parsing JSON for ${String(dataKey)}:`, e);
                  (cleanedData as any)[dataKey] = (initialState as any)[dataKey];
                }
              } else {
                (cleanedData as any)[dataKey] = data[key];
              }
            } else {
              // Use initial state if data doesn't have this key
              (cleanedData as any)[dataKey] = (initialState as any)[dataKey];
            }
          });
          
          console.log(`Cleaned data for ${tableName}:`, cleanedData);
          setFormData(cleanedData);
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to load your data from ${tableName}`,
        variant: "destructive"
      });
      
      return null;
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
      
      // Here we cast the tableName to any to avoid TypeScript errors
      const { error } = await supabase
        .from(tableName as any)
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
    isSaving,
    fetchData
  };
};
