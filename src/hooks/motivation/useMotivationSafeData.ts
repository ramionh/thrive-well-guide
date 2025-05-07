
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

/**
 * Safe data fetching hook to prevent fetch loops
 * @param tableName The Supabase table to fetch from
 * @param initialState Initial state for the data
 * @param parseData Optional function to parse the fetched data
 */
export const useMotivationSafeData = <T extends Record<string, any>>(
  tableName: string,
  initialState: T,
  parseData?: (data: any) => T
) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedFetch = useRef(false);
  const isMounted = useRef(true);

  const fetchData = useCallback(async (force: boolean = false) => {
    // Skip if no user, or we've already fetched (unless forced)
    if (!user || (hasAttemptedFetch.current && !force)) {
      if (!user) {
        setIsLoading(false);
      }
      return;
    }

    console.log(`useMotivationSafeData: Fetching data for ${tableName}, user ${user.id}`);
    setIsLoading(true);
    hasAttemptedFetch.current = true;
    
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching ${tableName} data:`, error);
        if (error.code !== "PGRST116") {
          throw error;
        }
      }

      // Only update state if the component is still mounted
      if (isMounted.current) {
        if (data) {
          console.log(`Raw ${tableName} data:`, data);
          
          if (parseData) {
            const parsedData = parseData(data);
            console.log(`Parsed ${tableName} data:`, parsedData);
            setFormData(parsedData);
          } else {
            setFormData(data as unknown as T);
          }
          
          setError(null);
        } else {
          console.log(`No data found for ${tableName}`);
        }
      }
    } catch (err: any) {
      console.error(`Error fetching ${tableName} data:`, err);
      if (isMounted.current) {
        setError(err.message || "Failed to load data");
        toast({
          title: "Error",
          description: `Failed to load data: ${err.message}`,
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [user, tableName, parseData, toast]);

  // Set up cleanup when component unmounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Only fetch data once when the component mounts and user is available
  useEffect(() => {
    if (user && !hasAttemptedFetch.current) {
      fetchData();
    } else if (!user) {
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
