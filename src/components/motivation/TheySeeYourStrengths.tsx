
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoadingState from "./shared/LoadingState";
import { StarIcon } from "lucide-react";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface TheySeeYourStrengthsProps {
  onComplete?: () => void;
}

interface FeedbackEntry {
  person: string;
  strengths: string;
}

const TheySeeYourStrengths: React.FC<TheySeeYourStrengthsProps> = ({ onComplete }) => {
  const initialState = {
    feedback_entries: [] as FeedbackEntry[]
  };
  
  const didInitialFetch = useRef(false);
  
  const {
    formData,
    isLoading,
    isSaving,
    error,
    updateForm,
    submitForm,
    fetchData
  } = useMotivationForm({
    tableName: "motivation_strengths_feedback",
    initialState,
    onSuccess: onComplete,
    stepNumber: 63,
    stepName: "They See Your Strengths",
    nextStepNumber: 64,
    nextStepName: "Growth Mindset",
    parseData: (data) => {
      if (!data || !data.feedback_entries) return { feedback_entries: [] };
      return {
        feedback_entries: Array.isArray(data.feedback_entries) ? data.feedback_entries : []
      };
    }
  });

  // Only fetch data once on component mount
  useEffect(() => {
    if (!didInitialFetch.current) {
      fetchData();
      didInitialFetch.current = true;
    }
  }, [fetchData]);
  
  const addEntry = () => {
    const newEntries = [...formData.feedback_entries, { person: "", strengths: "" }];
    updateForm('feedback_entries', newEntries);
  };
  
  const updateEntry = (index: number, field: keyof FeedbackEntry, value: string) => {
    const newEntries = [...formData.feedback_entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    updateForm('feedback_entries', newEntries);
  };
  
  const removeEntry = (index: number) => {
    const newEntries = formData.feedback_entries.filter((_, i) => i !== index);
    updateForm('feedback_entries', newEntries);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="px-0">
          <div className="p-6 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <StarIcon className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-purple-800">They See Your Strengths</h2>
        </div>
        
        <div className="mb-8 space-y-4">
          <p className="text-gray-700">
            Sometimes others can see strengths in us that we don't recognize in ourselves. 
            Think about people in your life who have given you positive feedback about your 
            abilities, character, or achievements related to health and fitness.
          </p>
          <div className="bg-purple-50 p-4 rounded-md">
            <p className="italic text-purple-700">
              "My friend noticed my consistency in showing up for our morning walks, even when
              I felt tired. That made me realize I have more discipline than I give myself credit for."
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.feedback_entries.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">No entries yet. Add someone who has recognized your strengths.</p>
            </div>
          )}
          
          {formData.feedback_entries.map((entry, index) => (
            <div key={index} className="p-4 border border-purple-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-purple-700">Entry #{index + 1}</h3>
                <button 
                  type="button" 
                  onClick={() => removeEntry(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`person-${index}`}>Person or relationship</Label>
                  <input
                    id={`person-${index}`}
                    value={entry.person}
                    onChange={(e) => updateEntry(index, 'person', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Friend, family member, coach, colleague..."
                  />
                </div>
                
                <div>
                  <Label htmlFor={`strengths-${index}`}>Strengths they've observed in you</Label>
                  <Textarea
                    id={`strengths-${index}`}
                    value={entry.strengths}
                    onChange={(e) => updateEntry(index, 'strengths', e.target.value)}
                    className="w-full mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="What positive qualities, abilities, or characteristics have they noticed?"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <Button 
              type="button" 
              onClick={addEntry}
              variant="outline" 
              className="border-dashed border-purple-300 hover:bg-purple-50 text-purple-700"
            >
              + Add Another Person
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={isSaving || formData.feedback_entries.length === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheySeeYourStrengths;
