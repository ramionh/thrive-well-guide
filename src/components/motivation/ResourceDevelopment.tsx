
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import ResourceDevelopmentHeader from "./resource-development/ResourceDevelopmentHeader";
import ResourceDevelopmentDescription from "./resource-development/ResourceDevelopmentDescription";
import ResourceDevelopmentForm from "./resource-development/ResourceDevelopmentForm";
import { Skeleton } from "@/components/ui/skeleton";

interface ResourceDevelopmentProps {
  onComplete: () => void;
}

const ResourceDevelopment: React.FC<ResourceDevelopmentProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    helpful_resources: '',
    resource_development: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch existing data when component mounts
  React.useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("ResourceDevelopment: Fetching data for user", user.id);
        
        const { data, error } = await supabase
          .from('motivation_resource_development')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          console.log("ResourceDevelopment: Raw data:", data);
          setFormData({
            helpful_resources: data.helpful_resources || '',
            resource_development: data.resource_development || ''
          });
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching resource development data:", err);
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
      console.log("ResourceDevelopment: Submitting form", formData);
      
      const { error } = await supabase
        .from('motivation_resource_development')
        .insert({
          user_id: user.id,
          helpful_resources: formData.helpful_resources,
          resource_development: formData.resource_development
        });

      if (error) throw error;

      // Update step progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 56,
            step_name: "Resource Development",
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
        description: "Your resource development notes have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error("Error saving resource development data:", err);
      toast({
        title: "Error",
        description: "Failed to save your data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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

  if (error) {
    console.error("Error in ResourceDevelopment component:", error);
    return (
      <div className="p-6 text-red-500">
        An error occurred while loading this component. Please try refreshing the page.
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <ResourceDevelopmentHeader />
        <ResourceDevelopmentDescription />
        <ResourceDevelopmentForm 
          formData={formData}
          isSaving={isSaving}
          updateForm={updateForm}
          handleSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default ResourceDevelopment;
