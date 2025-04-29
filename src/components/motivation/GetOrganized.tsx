
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface GetOrganizedProps {
  onComplete?: () => void;
}

const GetOrganized: React.FC<GetOrganizedProps> = ({ onComplete }) => {
  const [planLocation, setPlanLocation] = useState<string>("");
  const [organizationTasks, setOrganizationTasks] = useState<string[]>(Array(8).fill(""));
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_get_organized",
    initialState: {
      plan_location: "",
      organization_tasks: Array(8).fill("")
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    if (formData) {
      if (formData.plan_location) {
        setPlanLocation(formData.plan_location);
      }
      
      if (formData.organization_tasks) {
        const savedTasks = formData.organization_tasks;
        // Ensure we always have at least 8 tasks
        if (savedTasks.length < 8) {
          const filledTasks = [
            ...savedTasks,
            ...Array(8 - savedTasks.length).fill("")
          ];
          setOrganizationTasks(filledTasks);
        } else {
          setOrganizationTasks(savedTasks);
        }
      }
    }
  }, [formData]);
  
  const handleTaskChange = (index: number, value: string) => {
    setOrganizationTasks(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("plan_location", planLocation);
    updateForm("organization_tasks", organizationTasks);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Get Organized</h2>
              
              <p className="text-gray-600 mb-6">
                If you want to be successful and feel motivated, being organized is essential. If you're already a fairly organized person, this part will be easy. But if you fly by the seat of your pants, it will take a bit more work.
              </p>
              
              <div className="space-y-4 mb-6">
                <Label htmlFor="planLocation" className="text-purple-700 font-medium">
                  Select a specific place where you always keep a copy of your Action Plan and related information, including exercises and other ideas. It can be a particular location in your home or a special folder online.
                </Label>
                <Input 
                  id="planLocation"
                  value={planLocation}
                  onChange={(e) => setPlanLocation(e.target.value)}
                  className="w-full"
                  placeholder="Enter your plan location here"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-purple-700 font-medium block mb-2">
                  Make a to-do list of tasks that will help you get organized. Consider actions that will help you keep your designated space clear of clutter and maintain an area where you can think about and focus on your Action Plan each day.
                </Label>
                
                {organizationTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      value={task}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                      placeholder={`Task ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                ))}
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

export default GetOrganized;
