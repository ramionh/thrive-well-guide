import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
    // Skip if no user, fetch is in progress, or we've already fetched
    if (!user || fetchInProgress.current || hasAttemptedFetch.current) {
      console.log(`useMotivationData: Skipping fetch for ${tableName}. No user: ${!user}, Fetch in progress: ${fetchInProgress.current}, Already attempted: ${hasAttemptedFetch.current}`);
      if (!user) {
        setIsLoading(false);
      }
      return;
    }

    console.log(`useMotivationData: Fetching data for ${tableName}, user ${user.id}`);
    setIsLoading(true);
    fetchInProgress.current = true;
    
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
              // Convert snake_case to camelCase
              const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
              );
              
              // Only set if the key exists in initialState
              if (camelKey in parsedData) {
                // Convert any empty strings to meaningful values if appropriate
                if (typeof data[key] === 'string') {
                  // Keep the value as is (even if empty string)
                  (parsedData[camelKey as keyof T] as any) = data[key];
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
      hasAttemptedFetch.current = true;
    }
  }, [user, tableName, initialState, parseData, toast]);

  // Reset hasAttemptedFetch when user changes
  useEffect(() => {
    if (user) {
      hasAttemptedFetch.current = false;
    }
  }, [user?.id]);

  // Set up cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (user && !hasAttemptedFetch.current && !fetchInProgress.current) {
      fetchData();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user?.id, fetchData]);

  return {
    formData,
    setFormData,
    isLoading,
    error,
    fetchData
  };
};
