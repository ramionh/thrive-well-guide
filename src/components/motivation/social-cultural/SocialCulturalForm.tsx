
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SocialCulturalFormProps {
  formData: {
    culturalBeliefs: string;
    culturalCustoms: string;
    religiousBeliefs: string;
  };
  isLoading: boolean;
  isSubmitting: boolean;
  updateForm: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const SocialCulturalForm: React.FC<SocialCulturalFormProps> = ({
  formData,
  isLoading,
  isSubmitting,
  updateForm,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="culturalBeliefs" className="text-purple-600">Cultural beliefs:</Label>
        <Textarea 
          id="culturalBeliefs"
          value={formData.culturalBeliefs}
          onChange={(e) => updateForm("culturalBeliefs", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isLoading || isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="culturalCustoms" className="text-purple-600">Cultural customs:</Label>
        <Textarea 
          id="culturalCustoms"
          value={formData.culturalCustoms}
          onChange={(e) => updateForm("culturalCustoms", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isLoading || isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="religiousBeliefs" className="text-purple-600">Religious beliefs:</Label>
        <Textarea 
          id="religiousBeliefs"
          value={formData.religiousBeliefs}
          onChange={(e) => updateForm("religiousBeliefs", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isLoading || isSubmitting}
        />
      </div>
      
      <p className="text-gray-600 italic">
        It can be hard to see a culture from the inside. If you are struggling with this section, try asking others 
        how they might define their cultural groups and the accompanying beliefs, values, customs, and traditions. 
        This might give you some ideas to work with.
      </p>

      <Button 
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isLoading || isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default SocialCulturalForm;
