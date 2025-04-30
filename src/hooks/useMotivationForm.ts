
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface UseMotivationFormParams<T, U> {
  tableName: string;
  initialState: T;
  onSuccess?: () => void;
  parseData?: (data: any) => T;
  transformData?: (data: T) => U;
  stepNumber?: number;
  nextStepNumber?: number;
  stepName?: string;
  nextStepName?: string;
}

export const useMotivationForm = <T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>({
  tableName,
  initialState,
  onSuccess,
  parseData,
  transformData,
  stepNumber,
  nextStepNumber,
  stepName = "",
  nextStepName = ""
}: UseMotivationFormParams<T, U>) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);

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
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        console.log(`Raw ${tableName} data:`, data);
        let parsedData: T;
        
        if (parseData) {
          // Use the custom parser if provided
          parsedData = parseData(data);
        } else {
          // Default parsing logic: map column names to camelCase keys
          parsedData = { ...initialState };
          Object.keys(data).forEach(key => {
            const camelKey = key.replace(/([-_][a-z])/g, group =>
              group.toUpperCase().replace('-', '').replace('_', '')
            );
            
            // Only set if the key exists in initialState
            if (camelKey in parsedData) {
              // Check if it's possibly JSON stored as string
              if (typeof data[key] === 'string' && 
                (data[key].startsWith('{') || data[key].startsWith('['))) {
                try {
                  parsedData[camelKey as keyof T] = JSON.parse(data[key]);
                } catch (e) {
                  console.warn(`Failed to parse JSON for ${key}:`, e);
                  parsedData[camelKey as keyof T] = data[key];
                }
              } else {
                parsedData[camelKey as keyof T] = data[key];
              }
            }
          });
        }
        
        console.log(`Parsed ${tableName} data:`, parsedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error(`Error fetching ${tableName} data:`, error);
      toast({
        title: "Error",
        description: "Failed to load your data",
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

  const submitForm = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Transform the data if a transformer is provided
      let dataToSubmit: Record<string, any>;
      if (transformData) {
        dataToSubmit = transformData(formData);
      } else {
        // Default transformation: map camelCase keys to snake_case column names
        dataToSubmit = {};
        Object.keys(formData).forEach(key => {
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          dataToSubmit[snakeKey] = formData[key as keyof T];
        });
      }

      // Add user_id to the data
      dataToSubmit.user_id = user.id;

      // Check if a record already exists
      const { data: existingData, error: queryError } = await supabase
        .from(tableName)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from(tableName)
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        result = await supabase
          .from(tableName)
          .insert({
            ...dataToSubmit,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) throw result.error;

      // Mark step as completed if stepNumber is provided
      if (stepNumber) {
        const { error: progressError } = await supabase
          .from("motivation_steps_progress")
          .upsert(
            {
              user_id: user.id,
              step_number: stepNumber,
              step_name: stepName || `Step ${stepNumber}`,
              completed: true,
              completed_at: new Date().toISOString()
            },
            { onConflict: "user_id,step_number" }
          );

        if (progressError) throw progressError;

        // Make next step available if nextStepNumber is provided
        if (nextStepNumber) {
          const { error: nextStepError } = await supabase
            .from("motivation_steps_progress")
            .upsert(
              {
                user_id: user.id,
                step_number: nextStepNumber,
                step_name: nextStepName || `Step ${nextStepNumber}`,
                completed: false,
                available: true,
                completed_at: null
              },
              { onConflict: "user_id,step_number" }
            );

          if (nextStepError) throw nextStepError;
        }
      }

      toast({
        title: "Success",
        description: "Your response has been saved"
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error saving ${tableName} data:`, error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    updateForm,
    submitForm
  };
};
