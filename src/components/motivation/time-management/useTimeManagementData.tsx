
import { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TimeManagementFormData {
  currentSchedule: string;
  timeSlots: string;
  quickActivities: string;
  impact: string;
}

export const useTimeManagementData = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialState: TimeManagementFormData = {
    currentSchedule: "",
    timeSlots: "",
    quickActivities: "",
    impact: ""
  };

  const [formData, setFormData] = useState<TimeManagementFormData>(initialState);

  useEffect(() => {
    if (user) {
      fetchExistingData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchExistingData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("motivation_time_management")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log("Raw data from Time Management:", data);
      
      if (data) {
        setFormData({
          currentSchedule: data.current_schedule || "",
          timeSlots: data.time_slots || "",
          quickActivities: data.quick_activities || "",
          impact: data.impact || ""
        });
      }
    } catch (err) {
      console.error("Error fetching time management data:", err);
      toast({
        title: "Error",
        description: "Failed to load your time management data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: keyof TimeManagementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    updateForm,
    setFormData,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
  };
};
