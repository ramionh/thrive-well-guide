
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TimeManagementFormProps {
  formData: {
    currentSchedule: string;
    timeSlots: string;
    quickActivities: string;
    impact: string;
  };
  updateForm: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

const TimeManagementForm: React.FC<TimeManagementFormProps> = ({
  formData,
  updateForm,
  onSubmit,
  isSaving,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="currentSchedule" className="text-purple-600">
          Let's look at your current schedule. Write down as many activities as you can remember from 
          the past 24 hours. Estimate how much time you spent on each activity.
        </Label>
        <Textarea 
          id="currentSchedule"
          value={formData.currentSchedule}
          onChange={(e) => updateForm("currentSchedule", e.target.value)}
          className="mt-1"
          rows={7}
          disabled={isSaving}
        />
      </div>
      
      <div>
        <Label htmlFor="timeSlots" className="text-purple-600">
          If you needed, say, 10 minutes per day to devote to activities toward your goal, where might you find them?
        </Label>
        <Textarea 
          id="timeSlots"
          value={formData.timeSlots}
          onChange={(e) => updateForm("timeSlots", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isSaving}
        />
      </div>
      
      <div>
        <Label htmlFor="quickActivities" className="text-purple-600">
          What are some related activities you could do in 10 minutes per day?
        </Label>
        <Textarea 
          id="quickActivities"
          value={formData.quickActivities}
          onChange={(e) => updateForm("quickActivities", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isSaving}
        />
      </div>
      
      <div>
        <Label htmlFor="impact" className="text-purple-600">
          How would these activities put you closer to achieving your goal?
        </Label>
        <Textarea 
          id="impact"
          value={formData.impact}
          onChange={(e) => updateForm("impact", e.target.value)}
          className="mt-1"
          rows={4}
          disabled={isSaving}
        />
      </div>

      <Button 
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default TimeManagementForm;
