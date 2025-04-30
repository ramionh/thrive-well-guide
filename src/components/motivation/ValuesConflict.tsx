
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { Scale } from "lucide-react";

interface ValuesConflictProps {
  onComplete?: () => void;
}

const ValuesConflict: React.FC<ValuesConflictProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_values_conflict",
    initialState: {
      feelings_after: "",
      potential_conflicts: "",
      priority_values: ""
    },
    onSuccess: onComplete,
    parseData: (data) => {
      console.log("Raw data from values conflict:", data);
      return {
        feelings_after: typeof data.feelings_after === 'string' ? data.feelings_after : "",
        potential_conflicts: typeof data.potential_conflicts === 'string' ? data.potential_conflicts : "",
        priority_values: typeof data.priority_values === 'string' ? data.priority_values : ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-800">Values Conflict</h2>
            </div>
            
            <p className="text-gray-700">
              Write about a time you did not put your most important value first, and instead made a decision based on your second- or third-ranked value.
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="feelings_after" className="block text-sm font-medium text-purple-700">
                  How did you feel afterward?
                </Label>
                <Textarea
                  id="feelings_after"
                  value={formData.feelings_after}
                  onChange={(e) => updateForm("feelings_after", e.target.value)}
                  className="min-h-[120px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Describe your feelings after making this decision..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potential_conflicts" className="block text-sm font-medium text-purple-700">
                  When might these values conflict as you consider the steps needed to achieve your goal?
                </Label>
                <Textarea
                  id="potential_conflicts"
                  value={formData.potential_conflicts}
                  onChange={(e) => updateForm("potential_conflicts", e.target.value)}
                  className="min-h-[120px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Describe potential conflicts between your values and your goal..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority_values" className="block text-sm font-medium text-purple-700">
                  What value or values will you need to prioritize to help you reach your goal?
                </Label>
                <Textarea
                  id="priority_values"
                  value={formData.priority_values}
                  onChange={(e) => updateForm("priority_values", e.target.value)}
                  className="min-h-[120px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Identify which values you'll need to prioritize for your goals..."
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

export default ValuesConflict;
