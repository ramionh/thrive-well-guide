
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface WhereAreYouNowProps {
  onComplete?: () => void;
}

const WhereAreYouNow: React.FC<WhereAreYouNowProps> = ({ onComplete }) => {
  const [readinessRating, setReadinessRating] = useState<number>(5);
  const [progressSummary, setProgressSummary] = useState<string>("");
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    fetchData,
    submitForm,
    updateForm
  } = useMotivationForm({
    tableName: "motivation_where_are_you_now",
    initialState: {
      readiness_rating: 5,
      progress_summary: ""
    },
    parseData: (data) => {
      console.log("Raw data from Where Are You Now:", data);
      // Ensure we properly extract the numeric readiness_rating
      const readinessRating = typeof data.readiness_rating === 'number' 
        ? data.readiness_rating 
        : 5;
      
      // Ensure we properly extract the string progress_summary
      const progressSummary = typeof data.progress_summary === 'string'
        ? data.progress_summary
        : "";
        
      return {
        readiness_rating: readinessRating,
        progress_summary: progressSummary
      };
    },
    transformData: (formData) => {
      // Convert form data to database format
      return {
        readiness_rating: readinessRating,
        progress_summary: progressSummary
      };
    },
    onSuccess: onComplete,
    stepNumber: 64,
    nextStepNumber: 65,
    stepName: "Where Are You Now",
    nextStepName: "Identifying the Steps to Reach Your Goal"
  });
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (formData) {
      // Parse the readiness_rating properly, ensuring it's a number
      if (typeof formData.readiness_rating === 'number') {
        setReadinessRating(formData.readiness_rating);
      } else if (formData.readiness_rating) {
        // Try to parse it as a number if it's not already
        const parsedRating = parseInt(formData.readiness_rating.toString(), 10);
        if (!isNaN(parsedRating)) {
          setReadinessRating(parsedRating);
        }
      }
      
      // Set the progress_summary
      if (formData.progress_summary) {
        setProgressSummary(formData.progress_summary);
      }
    }
  }, [formData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the form data with the current component state
    updateForm("readiness_rating", readinessRating);
    updateForm("progress_summary", progressSummary);
    
    // Submit the form to save to database
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Where Are You Now?</h2>
              
              <p className="text-gray-600 mb-6">
                Before embarking on your journey of change, it's important to pause and assess where
                you currently stand. This reflection helps establish a baseline and provides clarity 
                on what you're working with as you begin this process.
              </p>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-purple-700 font-medium">
                    How ready do you feel to make changes right now? (1 = Not ready at all, 10 = Completely ready)
                  </label>
                  
                  <div className="px-4">
                    <Slider
                      value={[readinessRating]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setReadinessRating(value[0])}
                      className="my-6"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Not ready</span>
                      <span>Somewhat ready</span>
                      <span>Very ready</span>
                    </div>
                    
                    <div className="text-center mt-2 text-purple-700 font-medium">
                      Selected: {readinessRating}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-purple-700 font-medium">
                    Briefly summarize your current progress toward your fitness goal:
                  </label>
                  
                  <Textarea
                    value={progressSummary}
                    onChange={(e) => setProgressSummary(e.target.value)}
                    placeholder="Describe your current situation, any progress you've already made, and challenges you're facing..."
                    className="h-40"
                  />
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

export default WhereAreYouNow;
