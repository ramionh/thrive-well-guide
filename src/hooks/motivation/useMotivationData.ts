
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

/**
 * Hook for fetching motivation form data
 */
export const useMotivationData = <T>(
  tableName: string, 
  initialState: T,
  parseData?: (data: any) => T
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Use 'as any' to bypass TypeScript's strict table name checking
      const { data, error } = await supabase
        .from(tableName as any)
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
                  (parsedData[camelKey as keyof T] as any) = JSON.parse(data[key]);
                } catch (e) {
                  console.warn(`Failed to parse JSON for ${key}:`, e);
                  (parsedData[camelKey as keyof T] as any) = data[key];
                }
              } else {
                (parsedData[camelKey as keyof T] as any) = data[key];
              }
            }
          });
        }
        
        console.log(`Parsed ${tableName} data:`, parsedData);
        setFormData(parsedData);
        setError(null);
      }
    } catch (err: any) {
      console.error(`Error fetching ${tableName} data:`, err);
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, tableName, initialState, parseData, toast]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchData]);

  return {
    formData,
    setFormData,
    isLoading,
    error,
    fetchData
  };
};
