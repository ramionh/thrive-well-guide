
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface RevisitValuesProps {
  onComplete?: () => void;
}

const RevisitValues: React.FC<RevisitValuesProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSubmitting,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_revisit_values",
    initialState: {
      values: ["", "", ""],
      reflection: ""
    },
    transformData: (data) => {
      return {
        values: Array.isArray(data.values) ? data.values : ["", "", ""],
        reflection: data.reflection || ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(e, onComplete);
  };

  const updateValue = (index: number, value: string) => {
    const newValues = [...formData.values];
    newValues[index] = value;
    updateForm("values", newValues);
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Revisit Values</h2>
              <p className="text-gray-600 mb-6">
                List your top values, ordered from most important to least important.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="value1" className="block text-sm font-medium text-gray-700">
                  Value 1 (Most Important)
                </Label>
                <Input
                  id="value1"
                  value={formData.values[0] || ''}
                  onChange={(e) => updateValue(0, e.target.value)}
                  placeholder="Enter your most important value..."
                  className="focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value2" className="block text-sm font-medium text-gray-700">
                  Value 2
                </Label>
                <Input
                  id="value2"
                  value={formData.values[1] || ''}
                  onChange={(e) => updateValue(1, e.target.value)}
                  placeholder="Enter your second most important value..."
                  className="focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value3" className="block text-sm font-medium text-gray-700">
                  Value 3
                </Label>
                <Input
                  id="value3"
                  value={formData.values[2] || ''}
                  onChange={(e) => updateValue(2, e.target.value)}
                  placeholder="Enter your third most important value..."
                  className="focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="reflection" className="block text-sm font-medium text-gray-700">
                  How did you decide which value trumps all others? Did anything change?
                </Label>
                <Textarea
                  id="reflection"
                  value={formData.reflection}
                  onChange={(e) => updateForm("reflection", e.target.value)}
                  className="min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Share your reflections on how you prioritized your values..."
                />
              </div>
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

export default RevisitValues;
