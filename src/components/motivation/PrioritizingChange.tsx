
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import PrioritizingChangeHeader from "./prioritizing-change/PrioritizingChangeHeader";
import PrioritizingChangeDescription from "./prioritizing-change/PrioritizingChangeDescription";
import PrioritizingChangeForm from "./prioritizing-change/PrioritizingChangeForm";
import { Skeleton } from "@/components/ui/skeleton";

interface PrioritizingChangeProps {
  onComplete?: () => void;
}

const PrioritizingChange: React.FC<PrioritizingChangeProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    new_activities: '',
    prioritized_activities: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get the current goal data
  const { 
    data: goalData, 
    isLoading: isGoalLoading,
    error: goalError
  } = useCurrentGoal();

  // Fetch existing data when component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("PrioritizingChange: Fetching data for user", user.id);
        
        const { data, error } = await supabase
          .from('motivation_prioritizing_change')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          console.log("PrioritizingChange: Raw data:", data);
          setFormData({
            new_activities: data.new_activities || '',
            prioritized_activities: data.prioritized_activities || ''
          });
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching prioritizing change data:", err);
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load your data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Only run this effect once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      console.log("PrioritizingChange: Submitting form", formData);
      
      const { error } = await supabase
        .from('motivation_prioritizing_change')
        .insert({
          user_id: user.id,
          new_activities: formData.new_activities,
          prioritized_activities: formData.prioritized_activities
        });

      if (error) throw error;

      // Update step progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 61,
            step_name: "Prioritizing Change",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,step_number' }
        );

      if (progressError) {
        console.error("Error updating step progress:", progressError);
      }

      toast({
        title: "Success",
        description: "Your prioritized activities have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error("Error saving prioritizing change data:", err);
      toast({
        title: "Error",
        description: "Failed to save your data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check for loading states
  const isPageLoading = isLoading || isGoalLoading;
  
  // Error handling
  if (error || goalError) {
    const displayError = error || goalError;
    console.error("Error in PrioritizingChange:", displayError);
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{displayError?.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Skeleton loading state
  if (isPageLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format goal description if available
  const goalDescription = goalData ? 
    `Transform from ${goalData.current_body_type?.name} to ${goalData.goal_body_type?.name} by ${new Date(goalData.target_date).toLocaleDateString()}` 
    : undefined;

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <PrioritizingChangeHeader />
        <PrioritizingChangeDescription goalDescription={goalDescription} />
        <PrioritizingChangeForm 
          formData={formData}
          isSaving={isSaving}
          updateForm={updateForm}
          handleSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default PrioritizingChange;
