
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { BookOpen } from "lucide-react";

interface RevisitValuesProps {
  onComplete?: () => void;
}

const RevisitValues: React.FC<RevisitValuesProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_revisit_values",
    initialState: {
      values: ["", "", ""],
      reflection: ""
    },
    onSuccess: onComplete,
    parseData: (data) => {
      console.log("Raw data from revisit values:", data);
      
      // Handle values array which could be stored as a string or array
      let parsedValues = ["", "", ""];
      if (data.values) {
        if (typeof data.values === 'string') {
          try {
            parsedValues = JSON.parse(data.values);
          } catch (e) {
            console.error("Error parsing values as JSON:", e);
            // Create a default array if parsing fails
            parsedValues = [data.values || "", "", ""];
          }
        } else if (Array.isArray(data.values)) {
          parsedValues = data.values;
        }
      }
      
      // Ensure array has exactly 3 elements
      while (parsedValues.length < 3) {
        parsedValues.push("");
      }
      
      return {
        values: parsedValues.slice(0, 3),
        reflection: typeof data.reflection === 'string' ? data.reflection : ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
    if (onComplete) {
      onComplete();
    }
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    updateForm("values", newValues);
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-800">Revisit Values</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              List your top values, ordered from most important to least important.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="value1" className="block text-sm font-medium text-purple-700">
                  Value 1 (Most Important)
                </Label>
                <Input
                  id="value1"
                  value={formData.values[0] || ''}
                  onChange={(e) => updateValue(0, e.target.value)}
                  placeholder="Enter your most important value..."
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value2" className="block text-sm font-medium text-purple-700">
                  Value 2
                </Label>
                <Input
                  id="value2"
                  value={formData.values[1] || ''}
                  onChange={(e) => updateValue(1, e.target.value)}
                  placeholder="Enter your second most important value..."
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value3" className="block text-sm font-medium text-purple-700">
                  Value 3
                </Label>
                <Input
                  id="value3"
                  value={formData.values[2] || ''}
                  onChange={(e) => updateValue(2, e.target.value)}
                  placeholder="Enter your third most important value..."
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="reflection" className="block text-sm font-medium text-purple-700">
                  How did you decide which value trumps all others? Did anything change?
                </Label>
                <Textarea
                  id="reflection"
                  value={formData.reflection}
                  onChange={(e) => updateForm("reflection", e.target.value)}
                  className="min-h-[120px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Share your reflections on how you prioritized your values..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default RevisitValues;
