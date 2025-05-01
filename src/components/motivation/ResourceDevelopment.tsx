
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import ResourceDevelopmentHeader from "./resource-development/ResourceDevelopmentHeader";
import ResourceDevelopmentDescription from "./resource-development/ResourceDevelopmentDescription";
import ResourceDevelopmentForm from "./resource-development/ResourceDevelopmentForm";
import LoadingState from "./shared/LoadingState";

interface ResourceDevelopmentProps {
  onComplete: () => void;
}

const ResourceDevelopment: React.FC<ResourceDevelopmentProps> = ({ onComplete }) => {
  const { user } = useUser();
  
  // Check if user has already completed this step
  const { isLoading, error } = useQuery({
    queryKey: ['resource-development', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_resource_development')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching resource development data:", error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error("Error in ResourceDevelopment component:", error);
    return (
      <div className="p-6 text-red-500">
        An error occurred while loading this component. Please try refreshing the page.
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <ResourceDevelopmentHeader />
        <ResourceDevelopmentDescription />
        <ResourceDevelopmentForm onComplete={onComplete} />
      </CardContent>
    </Card>
  );
};

export default ResourceDevelopment;
