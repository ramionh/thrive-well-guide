
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { Home } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface EnvironmentalResourcesProps {
  onComplete: () => void;
}

const EnvironmentalResources: React.FC<EnvironmentalResourcesProps> = ({ onComplete }) => {
  const initialState = {
    environmentalResources: ""
  };

  const { formData, updateForm, submitForm, isLoading, isSaving } = useMotivationForm({
    tableName: "motivation_environmental_resources",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        environmental_resources: data.environmentalResources
      };
    },
    parseData: (data) => {
      console.log("Raw environmental resources data:", data);
      return {
        environmentalResources: typeof data.environmental_resources === 'string' 
          ? data.environmental_resources 
          : ""
      };
    }
  });

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
                onChange={(e) => updateForm("environmentalResources", e.target.value)}
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
