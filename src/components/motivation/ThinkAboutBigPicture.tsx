
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/motivation/useMotivationForm";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "./shared/LoadingState";

interface ThinkAboutBigPictureProps {
  onComplete?: () => void;
}

const ThinkAboutBigPicture: React.FC<ThinkAboutBigPictureProps> = ({ onComplete }) => {
  const [bigPictureWhy, setBigPictureWhy] = useState<string>("");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData 
  } = useMotivationForm({
    tableName: "motivation_big_picture_why",
    initialState: {
      big_picture_why: ""
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your big picture why has been saved!"
      });
      if (onComplete) {
        onComplete();
      }
    },
    stepNumber: 58,
    nextStepNumber: 59,
    stepName: "Think About Big Picture",
    nextStepName: "Visualize Results"
  });
  
  // Load existing data when component mounts - only once
  useEffect(() => {
    if (!dataLoaded) {
      console.log("ThinkAboutBigPicture: Fetching data on mount");
      fetchData();
      setDataLoaded(true);
    }
  }, [fetchData, dataLoaded]);
  
  // Update state when formData changes
  useEffect(() => {
    if (formData && formData.big_picture_why !== undefined) {
      console.log("ThinkAboutBigPicture: FormData received, updating state:", formData);
      setBigPictureWhy(formData.big_picture_why || "");
    }
  }, [formData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ThinkAboutBigPicture: Submitting form");
    setIsSubmitting(true);
    
    try {
      console.log("ThinkAboutBigPicture: Updating form data with:", { bigPictureWhy });
      
      // Update form data field
      updateForm("big_picture_why", bigPictureWhy);
      
      // Submit the form with latest data
      await submitForm();
    } catch (error) {
      console.error("Error submitting ThinkAboutBigPicture form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Think About the Big Picture and Your Big Why</h2>
              
              <p className="text-gray-600 mb-6">
                Remember all the work we did on envisioning your ultimate goal? Keeping that dream alive is also a critical part of staying motivated. Let's revisit your ultimate goal (or Big Picture) and why you want to achieve it.
              </p>
              
              <div className="relative bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                <Label htmlFor="bigPictureWhy" className="text-purple-700 font-medium">
                  Big Picture and Big Why
                </Label>
                <Textarea 
                  id="bigPictureWhy"
                  value={bigPictureWhy}
                  onChange={(e) => setBigPictureWhy(e.target.value)}
                  placeholder="I want to be able to run a 5K race, feel strong, and be proud of my physical accomplishments. I deserve the health benefits of regular exercise and the confidence that comes from achieving fitness milestones."
                  className="mt-2 h-36 resize-none focus:ring-purple-500 focus:border-purple-500 bg-white"
                />
                
                <div className="mt-3 text-sm italic text-gray-500">
                  Example: "I want to be able to run a 5K race, feel strong, and be proud of my physical accomplishments. I deserve the health benefits of regular exercise and the confidence that comes from achieving fitness milestones."
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isSaving || isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving || isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ThinkAboutBigPicture;
