
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface GettingReadyProps {
  onComplete?: () => void;
}

const GettingReady: React.FC<GettingReadyProps> = ({ onComplete }) => {
  const [selfPersuasion, setSelfPersuasion] = useState<string>("");
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    fetchData,
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_getting_ready",
    initialState: {
      self_persuasion: ""
    },
    parseData: (data) => {
      return {
        self_persuasion: data.self_persuasion || ""
      };
    },
    onSuccess: onComplete,
    stepNumber: 66,
    nextStepNumber: 67,
    stepName: "Getting Ready",
    nextStepName: "Making Your Goal Measurable"
  });
  
  // Only fetch data once when component mounts
  useEffect(() => {
    fetchData();
  }, []); // Remove fetchData from dependencies
  
  // Update the state when formData changes
  useEffect(() => {
    if (formData && formData.self_persuasion !== undefined) {
      setSelfPersuasion(formData.self_persuasion);
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("self_persuasion", selfPersuasion);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Getting Ready for Change</h2>
              
              <p className="text-gray-600 mb-4">
                Change is often challenging, especially when it comes to health and fitness habits 
                that have been part of our lives for years. Before diving into specific action plans, 
                it's important to prepare yourself mentally for the journey ahead.
              </p>
              
              <p className="text-gray-600 mb-6">
                Self-persuasion is a powerful technique where you actively convince yourself of the 
                importance and possibility of change. Unlike external motivation that fades, self-persuasion 
                creates lasting internal motivation that can sustain you through challenges.
              </p>
              
              <div className="space-y-4">
                <label className="text-purple-700 font-medium">
                  Write a persuasive argument to yourself about why changing now is important and possible:
                </label>
                
                <Textarea
                  value={selfPersuasion}
                  onChange={(e) => setSelfPersuasion(e.target.value)}
                  placeholder="I need to make this change because... I know I can succeed because..."
                  className="h-48"
                />
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

export default GettingReady;
