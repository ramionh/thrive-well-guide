
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PrioritizingChangeFormProps {
  formData: {
    new_activities: string;
    prioritized_activities: string;
  };
  isSaving: boolean;
  updateForm: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const PrioritizingChangeForm: React.FC<PrioritizingChangeFormProps> = ({
  formData,
  isSaving,
  updateForm,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="new-activities" className="block text-sm font-medium text-gray-700 mb-1">
            New goal-related activities
          </Label>
          <Textarea
            id="new-activities"
            value={formData.new_activities}
            onChange={(e) => updateForm('new_activities', e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="List your new goal-related activities here..."
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="prioritized-activities" className="block text-sm font-medium text-gray-700 mb-1">
            Let's focus on the Important and Urgent priorities. In the box below, write at least one 
            activity from your new list, then add the 'important and urgent' activities you identified 
            in the previous step. Focus on these activities as you begin to work toward your goal. 
            Refer to this list when making schedule decisions; do these activities before any that 
            fall into the other quadrants.
          </Label>
          <div className="mt-2 mb-2 font-medium text-purple-800">IMPORTANT AND URGENT</div>
          <Textarea
            id="prioritized-activities"
            value={formData.prioritized_activities}
            onChange={(e) => updateForm('prioritized_activities', e.target.value)}
            rows={6}
            className="w-full p-2 border rounded-md"
            placeholder="List your important and urgent activities here..."
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

export default PrioritizingChangeForm;
