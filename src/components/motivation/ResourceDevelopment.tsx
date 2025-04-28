
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface ResourceDevelopmentProps {
  onComplete: () => void;
}

const ResourceDevelopment: React.FC<ResourceDevelopmentProps> = ({ onComplete }) => {
  const initialState = {
    helpfulResources: "",
    resourceDevelopment: ""
  };

  const { formData, updateForm, submitForm, isLoading } = useMotivationForm({
    tableName: "motivation_resource_development",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        helpful_resources: data.helpfulResources,
        resource_development: data.resourceDevelopment
      };
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-gray-700 mb-6">
              As you look over the strengths and resources exercises completed so far, what resources do you think will be most helpful?
            </p>
            
            <div className="mt-4">
              <Label htmlFor="helpfulResources" className="text-purple-600">Most helpful resources:</Label>
              <Textarea 
                id="helpfulResources"
                value={formData.helpfulResources}
                onChange={(e) => updateForm("helpfulResources", e.target.value)}
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="resourceDevelopment" className="text-purple-600">
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
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResourceDevelopment;
