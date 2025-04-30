
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BeConsistentProps {
  onComplete?: () => void;
}

interface TimeSlot {
  time: string;
  activity: string;
}

const BeConsistent: React.FC<BeConsistentProps> = ({ onComplete }) => {
  const [consistentActivities, setConsistentActivities] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "6:00-7:00 a.m.", activity: "" },
    { time: "7:00-8:00 a.m.", activity: "" },
    { time: "8:00-9:00 a.m.", activity: "" },
    { time: "9:00-10:00 a.m.", activity: "" },
    { time: "10:00-11:00 a.m.", activity: "" },
    { time: "11:00-12:00 p.m.", activity: "" },
    { time: "12:00-1:00 p.m.", activity: "" },
    { time: "1:00-2:00 p.m.", activity: "" },
    { time: "2:00-3:00 p.m.", activity: "" },
    { time: "3:00-4:00 p.m.", activity: "" },
    { time: "4:00-5:00 p.m.", activity: "" },
    { time: "5:00-6:00 p.m.", activity: "" },
    { time: "6:00-7:00 p.m.", activity: "" },
    { time: "7:00-8:00 p.m.", activity: "" },
    { time: "8:00-9:00 p.m.", activity: "" },
    { time: "9:00-10:00 p.m.", activity: "" },
  ]);

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_be_consistent",
    initialState: {
      consistent_activities: "",
      daily_schedule: {}
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData) {
      if (formData.consistent_activities) {
        setConsistentActivities(formData.consistent_activities);
      }
      
      if (formData.daily_schedule && Object.keys(formData.daily_schedule).length > 0) {
        const savedTimeSlots = [...timeSlots];
        
        Object.entries(formData.daily_schedule).forEach(([time, activity]) => {
          const index = savedTimeSlots.findIndex(slot => slot.time === time);
          if (index !== -1) {
            savedTimeSlots[index].activity = activity as string;
          }
        });
        
        setTimeSlots(savedTimeSlots);
      }
    }
  }, [formData]);

  const handleActivityChange = (index: number, value: string) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index].activity = value;
    setTimeSlots(updatedTimeSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert time slots array to object for storage
    const scheduleObject: Record<string, string> = {};
    timeSlots.forEach(slot => {
      if (slot.activity.trim() !== "") {
        scheduleObject[slot.time] = slot.activity;
      }
    });
    
    updateForm("consistent_activities", consistentActivities);
    updateForm("daily_schedule", scheduleObject);
    submitForm();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Be Consistent</h2>
              
              <p className="text-gray-600 mb-6">
                Create a schedule that includes consistent time to focus on your goal plan. 
                Look over the exercises you have completed so far. What are some activities you can 
                do consistently (not necessarily every day) to stay focused and motivated?
              </p>

              <div className="space-y-4">
                <Label htmlFor="consistentActivities" className="text-purple-700 font-medium">
                  Activities to do consistently:
                </Label>
                <Textarea
                  id="consistentActivities"
                  value={consistentActivities}
                  onChange={(e) => setConsistentActivities(e.target.value)}
                  placeholder="Meditate each morning for five minutes
Track my workout progress in my fitness app daily
Set a new small fitness goal at the beginning of each week
Take progress photos every two weeks
Plan and prepare healthy meals every Sunday"
                  className="min-h-[150px] border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                />

                <div className="mt-6">
                  <p className="text-gray-600 mb-4">
                    You may have a lifestyle that is difficult to schedule with precision, 
                    but start with a possible schedule to identify where your goal-related 
                    tasks or activities will fit. Think about work, education, family time, 
                    meals, sleep, and hygiene.
                  </p>

                  <div className="italic text-gray-500 mb-4 text-sm">
                    Example schedule entries:<br />
                    <span className="ml-4">6:00–7:00 a.m. Morning run and stretching</span><br />
                    <span className="ml-4">7:00–8:00 a.m. Shower, breakfast, pack healthy lunch</span>
                  </div>

                  <div className="overflow-x-auto">
                    <Table className="border border-purple-200 rounded-lg">
                      <TableHeader className="bg-purple-50">
                        <TableRow className="hover:bg-purple-100">
                          <TableHead className="w-1/4 font-semibold text-purple-800">TIME SLOT</TableHead>
                          <TableHead className="w-3/4 font-semibold text-purple-800">ACTIVITY</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeSlots.map((slot, index) => (
                          <TableRow key={index} className="hover:bg-purple-50">
                            <TableCell className="font-medium">{slot.time}</TableCell>
                            <TableCell>
                              <Input
                                value={slot.activity}
                                onChange={(e) => handleActivityChange(index, e.target.value)}
                                placeholder="Enter activity"
                                className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default BeConsistent;
