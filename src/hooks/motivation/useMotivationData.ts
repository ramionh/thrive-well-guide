
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

  const fetchData = useCallback(async (force = false) => {
    // Skip if no user, fetch is in progress, or we've already fetched (unless forced)
    if (!user || fetchInProgress.current || (hasAttemptedFetch.current && !force)) {
      if (!user) {
        setIsLoading(false);
      }
      return;
    }

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
        if (error.code !== "PGRST116") {
          throw error;
        }
      }

      // Only update state if the component is still mounted
      if (isMounted.current) {
        if (data) {
          let parsedData: T;
          
          if (parseData) {
            // Use the custom parser if provided
            parsedData = parseData(data);
          } else {
            // Default parsing logic: map column names to camelCase keys
            parsedData = { ...initialState };
            Object.keys(data).forEach(key => {
              // Convert snake_case to camelCase
              const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
              );
              
              // Only set if the key exists in initialState
              if (camelKey in parsedData) {
                // For string values, ensure empty strings are preserved
                if (data[key] === null || data[key] === undefined) {
                  (parsedData[camelKey as keyof T] as any) = '';
                } else {
                  (parsedData[camelKey as keyof T] as any) = data[key];
                }
              }
            });
          }
          
          setFormData(parsedData);
          setError(null);
        }
      }
    } catch (err: any) {
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
