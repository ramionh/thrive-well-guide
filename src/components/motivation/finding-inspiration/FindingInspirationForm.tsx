
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FindingInspirationFormProps {
  formData: {
    inspiration_sources: string;
    inspirational_content: string;
  };
  updateForm: (field: string, value: string) => void;
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const FindingInspirationForm: React.FC<FindingInspirationFormProps> = ({
  formData,
  updateForm,
  isSaving,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="inspiration_sources" className="block text-sm font-medium text-purple-700">
            Where can you find inspiration? Who inspires you?
          </label>
          <Textarea
            id="inspiration_sources"
            value={formData.inspiration_sources}
            onChange={(e) => updateForm("inspiration_sources", e.target.value)}
            className="min-h-[100px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter your sources of inspiration..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="inspirational_content" className="block text-sm font-medium text-purple-700">
            What are some quotes and images that inspire you to work toward your goal? 
            Write them here or create a vision board.
          </label>
          <Textarea
            id="inspirational_content"
            value={formData.inspirational_content}
            onChange={(e) => updateForm("inspirational_content", e.target.value)}
            className="min-h-[100px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Write inspirational quotes and describe images here..."
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isSaving ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default FindingInspirationForm;
