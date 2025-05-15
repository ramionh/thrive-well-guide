
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

interface UseMotivationSafeDataOptions<T> {
  tableName: string;
  initialState: T;
  parseData?: (data: any) => T;
}

/**
 * Safe data fetching hook to prevent fetch loops
 * @param options Configuration options
 */
export const useMotivationSafeData = <T extends Record<string, any>>(
  options: UseMotivationSafeDataOptions<T>
) => {
  const { tableName, initialState, parseData } = options;
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedFetch = useRef(false);
  const isMounted = useRef(true);
  const fetchInProgress = useRef(false);

  const fetchData = useCallback(async (force: boolean = false) => {
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
          if (parseData) {
            const parsedData = parseData(data);
            setFormData(parsedData);
          } else {
            setFormData(data as unknown as T);
          }
          
          setError(null);
        }
      }
    } catch (err: any) {
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
      fetchInProgress.current = false;
      hasAttemptedFetch.current = true;
    }
  }, [user, tableName, parseData, toast]);

  // Reset hasAttemptedFetch when user changes
  useEffect(() => {
    if (user) {
      hasAttemptedFetch.current = false;
    }
  }, [user?.id]);

  // Set up cleanup when component unmounts
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Only fetch data once when the component mounts and user is available
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
