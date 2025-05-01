
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ResourceDevelopmentFormProps {
  formData: {
    helpful_resources: string;
    resource_development: string;
  };
  isSaving: boolean;
  updateForm: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ResourceDevelopmentForm: React.FC<ResourceDevelopmentFormProps> = ({
  formData,
  isSaving,
  updateForm,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="resource-development" className="text-sm font-medium text-gray-700">
            As you look over the strengths and resources exercises completed so far, what resources do you think will be most helpful?
          </Label>
          <Textarea
            id="resource-development"
            value={formData.resource_development}
            onChange={(e) => updateForm('resource_development', e.target.value)}
            rows={5}
            className="w-full mt-2 resize-y"
            placeholder="Enter your thoughts on which resources will be most helpful..."
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="helpful-resources" className="text-sm font-medium text-gray-700">
            What additional resources can you develop to support your work on this specific goal?
          </Label>
          <Textarea
            id="helpful-resources"
            value={formData.helpful_resources}
            onChange={(e) => updateForm('helpful_resources', e.target.value)}
            rows={5}
            className="w-full mt-2 resize-y"
            placeholder="Enter additional resources you can develop to support your goal..."
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md"
      >
        {isSaving ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default ResourceDevelopmentForm;
