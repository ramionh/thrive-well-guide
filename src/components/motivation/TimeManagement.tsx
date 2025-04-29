
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface TimeManagementProps {
  onComplete: () => void;
}

const TimeManagement: React.FC<TimeManagementProps> = ({ onComplete }) => {
  const initialState = {
    currentSchedule: "",
    timeSlots: "",
    quickActivities: "",
    impact: ""
  };

  const { formData, updateForm, submitForm, isLoading, fetchData } = useMotivationForm({
    tableName: "motivation_time_management",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        current_schedule: data.currentSchedule,
        time_slots: data.timeSlots,
        quick_activities: data.quickActivities,
        impact: data.impact
      };
    },
    parseData: (data) => {
      console.log("Raw data from Time Management:", data);
      return {
        currentSchedule: data.current_schedule || "",
        timeSlots: data.time_slots || "",
        quickActivities: data.quick_activities || "",
        impact: data.impact || ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-purple-800">Time Management and Personal Structure</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Time is one of the biggest challenges to making change. It may not be easy to devote time to focusing on a 
          change (especially one that is not fun in the moment), and it might feel impossible to fit one more 
          activity into a busy schedule. But time management can help you get a handle on your schedule and find 
          the time you need.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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

export default TimeManagement;
