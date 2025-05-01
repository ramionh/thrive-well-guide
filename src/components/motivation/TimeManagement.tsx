
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";
import LoadingState from "./shared/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface TimeManagementProps {
  onComplete: () => void;
}

interface TimeManagementFormData {
  currentSchedule: string;
  timeSlots: string;
  quickActivities: string;
  impact: string;
}

const TimeManagement: React.FC<TimeManagementProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const initialState: TimeManagementFormData = {
    currentSchedule: "",
    timeSlots: "",
    quickActivities: "",
    impact: ""
  };

  const [formData, setFormData] = React.useState<TimeManagementFormData>(initialState);

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

  const submitForm = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database
      const dataToSubmit = {
        user_id: user.id,
        current_schedule: formData.currentSchedule,
        time_slots: formData.timeSlots,
        quick_activities: formData.quickActivities,
        impact: formData.impact,
        updated_at: new Date().toISOString()
      };

      // Check if record already exists
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_time_management")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      if (existingData && 'id' in existingData) {
        // Update existing record
        result = await supabase
          .from("motivation_time_management")
          .update(dataToSubmit)
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        const insertData = {
          ...dataToSubmit,
          created_at: new Date().toISOString()
        };
        result = await supabase
          .from("motivation_time_management")
          .insert(insertData);
      }

      if (result.error) throw result.error;

      // Update step progress
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 63,
            step_name: "Time Management and Personal Structure",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );

      if (progressError) throw progressError;
      
      // Make next step available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 64,
            step_name: "Where Are You Now",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your time management information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving time management data:", error);
      toast({
        title: "Error",
        description: "Failed to save your time management information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3 mb-1">
          <Clock className="w-6 h-6 text-purple-600" />
          <CardTitle className="text-2xl font-bold text-purple-800">Time Management and Personal Structure</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Time is one of the biggest challenges to making change. It may not be easy to devote time to focusing on a 
          change (especially one that is not fun in the moment), and it might feel impossible to fit one more 
          activity into a busy schedule. But time management can help you get a handle on your schedule and find 
          the time you need.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="currentSchedule" className="text-purple-600">
              Let's look at your current schedule. Write down as many activities as you can remember from 
              the past 24 hours. Estimate how much time you spent on each activity.
            </Label>
            <Textarea 
              id="currentSchedule"
              value={formData.currentSchedule}
              onChange={(e) => updateForm("currentSchedule", e.target.value)}
              className="mt-1"
              rows={7}
              disabled={isSaving}
            />
          </div>
          
          <div>
            <Label htmlFor="timeSlots" className="text-purple-600">
              If you needed, say, 10 minutes per day to devote to activities toward your goal, where might you find them?
            </Label>
            <Textarea 
              id="timeSlots"
              value={formData.timeSlots}
              onChange={(e) => updateForm("timeSlots", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isSaving}
            />
          </div>
          
          <div>
            <Label htmlFor="quickActivities" className="text-purple-600">
              What are some related activities you could do in 10 minutes per day?
            </Label>
            <Textarea 
              id="quickActivities"
              value={formData.quickActivities}
              onChange={(e) => updateForm("quickActivities", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isSaving}
            />
          </div>
          
          <div>
            <Label htmlFor="impact" className="text-purple-600">
              How would these activities put you closer to achieving your goal?
            </Label>
            <Textarea 
              id="impact"
              value={formData.impact}
              onChange={(e) => updateForm("impact", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isSaving}
            />
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimeManagement;
