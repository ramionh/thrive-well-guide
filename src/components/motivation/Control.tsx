
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface ControlProps {
  onComplete?: () => void;
}

const Control: React.FC<ControlProps> = ({ onComplete }) => {
  const [cantControl, setCantControl] = useState<string>("");
  const [canControl, setCanControl] = useState<string>("");
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_control",
    initialState: {
      cant_control: "",
      can_control: ""
    },
    onSuccess: onComplete
  });
  
  useEffect(() => {
    if (formData) {
      if (formData.cant_control) {
        setCantControl(formData.cant_control);
      }
      if (formData.can_control) {
        setCanControl(formData.can_control);
      }
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("cant_control", cantControl);
    updateForm("can_control", canControl);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Control</h2>
              
              <p className="text-gray-600 mb-6">
                Even though you've worked hard to plan your steps and stay motivated, there will still be factors beyond your control that can impact your progress. Focusing on what you can reasonably control and letting go of things you cannot control will help you stay motivated.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                  <Label htmlFor="cantControl" className="text-purple-700 font-medium uppercase">
                    Can't Control
                  </Label>
                  <Textarea 
                    id="cantControl"
                    value={cantControl}
                    onChange={(e) => setCantControl(e.target.value)}
                    placeholder="How quickly my body responds to my new exercise routine
Whether the weather permits outdoor workouts
My genetics and natural body type
What others think about my fitness journey"
                    className="mt-2 h-56 resize-none focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>
                
                <div className="relative bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                  <Label htmlFor="canControl" className="text-purple-700 font-medium uppercase">
                    Can Control
                  </Label>
                  <Textarea 
                    id="canControl"
                    value={canControl}
                    onChange={(e) => setCanControl(e.target.value)}
                    placeholder="Making time for my scheduled workouts
Preparing healthy meals in advance
Having a backup plan for indoor exercises on rainy days
Getting enough sleep to recover between workouts"
                    className="mt-2 h-56 resize-none focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="mt-3 text-sm italic text-gray-500">
                <strong>Examples:</strong><br />
                <strong>Can't control:</strong> How quickly my body responds to my new exercise routine, whether the weather permits outdoor workouts, my genetics and natural body type, what others think about my fitness journey<br /><br />
                <strong>Can control:</strong> Making time for my scheduled workouts, preparing healthy meals in advance, having a backup plan for indoor exercises on rainy days, getting enough sleep to recover between workouts
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

export default Control;
