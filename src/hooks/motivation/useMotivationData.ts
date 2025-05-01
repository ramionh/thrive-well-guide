
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

/**
 * Hook for fetching motivation form data
 */
export const useMotivationData = <T extends Record<string, any>>(
  tableName: string, 
  initialState: T,
  parseData?: (data: any) => T
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);
  const hasAttemptedFetch = useRef(false);

  const fetchData = useCallback(async () => {
    // Only run once per component lifecycle
    if (hasAttemptedFetch.current) {
      console.log(`useMotivationData: Already attempted fetch for ${tableName}, using cached data`);
      return;
    }
    
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current) {
      console.log(`useMotivationData: Fetch already in progress for ${tableName}, skipping`);
      return;
    }

    if (!user) {
      console.log(`useMotivationData: No user found for ${tableName}`);
      setIsLoading(false);
      return;
    }

    console.log(`useMotivationData: Fetching data for ${tableName}, user ${user.id}`);
    setIsLoading(true);
    fetchInProgress.current = true;
    hasAttemptedFetch.current = true;
    
    try {
      // Use 'as any' to bypass TypeScript's strict table name checking
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(`useMotivationData: Error fetching ${tableName} data:`, error);
        if (error.code !== "PGRST116") {
          throw error;
        }
      }

      // Only update state if the component is still mounted
      if (isMounted.current) {
        if (data) {
          console.log(`Raw ${tableName} data:`, data);
          let parsedData: T;
          
          if (parseData) {
            // Use the custom parser if provided
            console.log(`useMotivationData: Using custom parser for ${tableName}`);
            parsedData = parseData(data);
          } else {
            // Default parsing logic: map column names to camelCase keys
            console.log(`useMotivationData: Using default parser for ${tableName}`);
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
        } else {
          console.log(`useMotivationData: No data found for ${tableName}`);
        }
      }
    } catch (err: any) {
      console.error(`Error fetching ${tableName} data:`, err);
      if (isMounted.current) {
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load your data",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        console.log(`useMotivationData: Finished loading for ${tableName}, isLoading set to false`);
      }
      fetchInProgress.current = false;
    }
  }, [user, tableName, initialState, parseData, toast]);

  // Reset hasAttemptedFetch when user changes
  useEffect(() => {
    hasAttemptedFetch.current = false;
  }, [user?.id]);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    formData,
    setFormData,
    isLoading,
    error,
    fetchData
  };
};
