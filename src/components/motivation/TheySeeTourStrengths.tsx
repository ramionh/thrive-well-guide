
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface TheySeeTourStrengthsProps {
  onComplete?: () => void;
}

interface FeedbackEntry {
  characteristic: string;
  evidence: string;
}

const TheySeeTourStrengths: React.FC<TheySeeTourStrengthsProps> = ({ onComplete }) => {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
  ]);

  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strengths_feedback",
    initialState: {
      feedbackEntries: []
    }
  });

  useEffect(() => {
    fetchData().then((data) => {
      if (data && 'feedbackEntries' in data && Array.isArray(data.feedbackEntries)) {
        if (data.feedbackEntries.length > 0) {
          setFeedbackEntries(data.feedbackEntries);
        }
      }
    });
  }, []);

  const handleCharacteristicChange = (index: number, value: string) => {
    const updatedEntries = [...feedbackEntries];
    updatedEntries[index].characteristic = value;
    setFeedbackEntries(updatedEntries);
  };

  const handleEvidenceChange = (index: number, value: string) => {
    const updatedEntries = [...feedbackEntries];
    updatedEntries[index].evidence = value;
    setFeedbackEntries(updatedEntries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("feedbackEntries", feedbackEntries);
    submitForm(e, onComplete);
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">They See Your Strengths</h2>
              <p className="text-gray-600 mb-6">
                Ask a trusted friend or family member to look at the list from the previous step, 
                choose a few of the strengths you listed, and fill out the following exercise.
              </p>
            </div>

            <div className="space-y-6">
              {feedbackEntries.map((entry, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg space-y-4">
                  <div>
                    <Label htmlFor={`characteristic-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Characteristic {index + 1}
                    </Label>
                    <Input
                      id={`characteristic-${index}`}
                      value={entry.characteristic}
                      onChange={(e) => handleCharacteristicChange(index, e.target.value)}
                      className="focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter a characteristic"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`evidence-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      What have you seen or heard me do that makes you think I have this characteristic?
                    </Label>
                    <Textarea
                      id={`evidence-${index}`}
                      value={entry.evidence}
                      onChange={(e) => handleEvidenceChange(index, e.target.value)}
                      className="min-h-[80px] focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter evidence for this characteristic..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TheySeeTourStrengths;
