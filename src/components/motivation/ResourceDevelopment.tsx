
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { Building } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface ResourceDevelopmentProps {
  onComplete: () => void;
}

const ResourceDevelopment: React.FC<ResourceDevelopmentProps> = ({ onComplete }) => {
  const initialState = {
    helpfulResources: "",
    resourceDevelopment: ""
  };

  const { formData, updateForm, submitForm, isLoading, isSaving } = useMotivationForm({
    tableName: "motivation_resource_development",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        helpful_resources: data.helpfulResources,
        resource_development: data.resourceDevelopment
      };
    },
    parseData: (data) => {
      console.log("Raw data from Resource Development:", data);
      return {
        helpfulResources: data.helpful_resources || "",
        resourceDevelopment: data.resource_development || ""
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
          <Building className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Resource Development</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-gray-700 mb-6">
              As you look over the strengths and resources exercises completed so far, what resources do you think will be most helpful?
            </p>
            
            <div className="mt-4">
              <Label htmlFor="helpfulResources" className="text-purple-700 font-medium">Most helpful resources:</Label>
              <Textarea 
                id="helpfulResources"
                value={formData.helpfulResources}
                onChange={(e) => updateForm("helpfulResources", e.target.value)}
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={4}
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="resourceDevelopment" className="text-purple-700 font-medium">
              What resources can you begin to access or start to cultivate and develop? How will you do this?
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              For example, if your workplace offers free or discounted gym memberships or online fitness coaching assistance, you can sign up to access these benefits.
            </p>
            <Textarea 
              id="resourceDevelopment"
              value={formData.resourceDevelopment}
              onChange={(e) => updateForm("resourceDevelopment", e.target.value)}
              className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              rows={4}
              disabled={isSaving}
            />
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

export default ResourceDevelopment;
