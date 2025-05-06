
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface TheySeeYourStrengthsProps {
  onComplete?: () => void;
}

const TheySeeYourStrengths: React.FC<TheySeeYourStrengthsProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_strengths_feedback",
    initialState: {
      feedback_entries: []
    },
    onSuccess: onComplete
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">They See Your Strengths</h2>
        
        <p className="text-gray-700 mb-6">
          Sometimes other people see strengths in us that we don't readily recognize in ourselves. 
          Think about feedback you've received from others about your strengths, particularly related 
          to your fitness journey or ability to create positive change in your life.
        </p>

        <form onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}>
          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-purple-700 font-medium mb-2">
                What strengths do others see in you?
              </label>
              <Textarea
                value={formData.strengths_others_see || ""}
                onChange={(e) => updateForm("strengths_others_see", e.target.value)}
                className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Write about how others perceive your strengths..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="block text-purple-700 font-medium mb-2">
                How can you leverage these perceived strengths in your fitness journey?
              </label>
              <Textarea
                value={formData.leverage_strengths || ""}
                onChange={(e) => updateForm("leverage_strengths", e.target.value)}
                className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe how you can use these strengths..."
                rows={4}
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSaving ? "Saving..." : "Complete Step"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheySeeYourStrengths;
