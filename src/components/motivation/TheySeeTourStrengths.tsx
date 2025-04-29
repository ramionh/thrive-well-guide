
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

// Define a parser for feedback entries data
const parseFeedbackEntriesData = (data: any) => {
  console.log("Parsing feedback entries data:", data);
  
  let feedbackEntries: FeedbackEntry[] = [
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
  ];
  
  // Parse feedback_entries
  if (data.feedback_entries) {
    if (Array.isArray(data.feedback_entries)) {
      // Data is already in array format
      feedbackEntries = data.feedback_entries.length > 0 
        ? [...data.feedback_entries]
        : feedbackEntries;
    } else if (typeof data.feedback_entries === 'string') {
      try {
        const parsed = JSON.parse(data.feedback_entries);
        if (Array.isArray(parsed) && parsed.length > 0) {
          feedbackEntries = parsed;
        }
      } catch (e) {
        console.error("Error parsing feedback_entries JSON:", e);
      }
    }
    
    // Ensure we have exactly 3 entries
    if (feedbackEntries.length < 3) {
      const remaining = 3 - feedbackEntries.length;
      for (let i = 0; i < remaining; i++) {
        feedbackEntries.push({ characteristic: "", evidence: "" });
      }
    }
  }
  
  console.log("Parsed feedback entries:", feedbackEntries);
  return { feedback_entries: feedbackEntries };
};

const TheySeeTourStrengths: React.FC<TheySeeTourStrengthsProps> = ({ onComplete }) => {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
    { characteristic: "", evidence: "" },
  ]);

  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strengths_feedback",
    initialState: {
      feedback_entries: [] as FeedbackEntry[]
    },
    onSuccess: onComplete,
    parseData: parseFeedbackEntriesData
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    
    loadData();
  }, []);

  // Update local state when formData changes
  useEffect(() => {
    console.log("Form data updated for feedback entries:", formData);
    if (formData && formData.feedback_entries) {
      if (Array.isArray(formData.feedback_entries) && formData.feedback_entries.length > 0) {
        setFeedbackEntries(formData.feedback_entries);
      }
    }
  }, [formData]);

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
    updateForm("feedback_entries", feedbackEntries);
    submitForm();
    if (onComplete) {
      onComplete();
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

export default TheySeeTourStrengths;
