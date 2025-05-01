
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Home } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface EnvironmentalResourcesProps {
  onComplete?: () => void;
}

interface EnvironmentalResourcesFormData {
  environmentalResources: string;
}

const EnvironmentalResources: React.FC<EnvironmentalResourcesProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EnvironmentalResourcesFormData>({
    environmentalResources: ""
  });

  useEffect(() => {
    if (user) {
      fetchExistingData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from("motivation_environmental_resources")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log("Environmental resources raw data:", data);

      if (data) {
        // Parse the data
        setFormData({
          environmentalResources: typeof data.environmental_resources === 'string' 
            ? data.environmental_resources 
            : ""
        });
      }
    } catch (error) {
      console.error("Error fetching environmental resources data:", error);
      toast({
        title: "Error",
        description: "Failed to load your environmental resources data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, environmentalResources: value }));
  };

  const submitForm = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("motivation_environmental_resources")
        .upsert({
          user_id: user.id,
          environmental_resources: formData.environmentalResources,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mark step as completed
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 55,
            step_name: "Environmental or Situational Supports and Resources",
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
            step_number: 56,
            step_name: "Resource Development",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your environmental resources information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving environmental resources data:", error);
      toast({
        title: "Error",
        description: "Failed to save your environmental resources information",
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
      <CardContent className="px-0">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Environmental Resources</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-gray-700 mb-6">
              What other resources are available to you in your community, online, at your house of worship, 
              or in or around your home that can help you take steps toward your fitness goal?
            </p>
            
            <div className="mt-4">
              <Label htmlFor="environmentalResources" className="text-purple-700 font-medium">Resources:</Label>
              <Textarea 
                id="environmentalResources"
                value={formData.environmentalResources}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="List the environmental or situational resources available to you..."
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={7}
                disabled={isSaving}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalResources;
