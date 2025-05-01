
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/motivation/useMotivationForm";

interface ResourceDevelopmentFormProps {
  onComplete: () => void;
}

interface ResourceFormData {
  helpfulResources: string;
  resourceDevelopment: string;
}

const ResourceDevelopmentForm: React.FC<ResourceDevelopmentFormProps> = ({ 
  onComplete 
}) => {
  const initialState: ResourceFormData = {
    helpfulResources: "",
    resourceDevelopment: ""
  };

  const { 
    formData, 
    updateForm, 
    submitForm, 
    isSaving 
  } = useMotivationForm<ResourceFormData>({
    tableName: "motivation_resource_development",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => ({
      helpful_resources: data.helpfulResources,
      resource_development: data.resourceDevelopment
    }),
    parseData: (data) => ({
      helpfulResources: data.helpful_resources || "",
      resourceDevelopment: data.resource_development || ""
    }),
    stepNumber: 56,
    nextStepNumber: 57,
    stepName: "Resource Development",
    nextStepName: "Envisioning Change"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="helpfulResources" className="text-purple-700 font-medium">
          Most helpful resources:
        </Label>
        <Textarea 
          id="helpfulResources"
          value={formData.helpfulResources}
          onChange={(e) => updateForm("helpfulResources", e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          rows={4}
          disabled={isSaving}
        />
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
  );
};

export default ResourceDevelopmentForm;
