
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface ValuesConflictProps {
  onComplete?: () => void;
}

const ValuesConflict: React.FC<ValuesConflictProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_values_conflict",
    initialState: {
      feelings_after: "",
      potential_conflicts: "",
      priority_values: ""
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Values Conflict</h2>
              <p className="text-gray-600 mb-6">
                Write about a time you did not put your most important value first, and instead made a decision based on your second- or third-ranked value.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="feelings_after" className="block text-sm font-medium text-gray-700">
                  How did you feel afterward?
                </Label>
                <Textarea
                  id="feelings_after"
                  value={formData.feelings_after}
                  onChange={(e) => updateForm("feelings_after", e.target.value)}
                  className="min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Describe your feelings after making this decision..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potential_conflicts" className="block text-sm font-medium text-gray-700">
                  When might these values conflict as you consider the steps needed to achieve your goal?
                </Label>
                <Textarea
                  id="potential_conflicts"
                  value={formData.potential_conflicts}
                  onChange={(e) => updateForm("potential_conflicts", e.target.value)}
                  className="min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Describe potential conflicts between your values and your goal..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority_values" className="block text-sm font-medium text-gray-700">
                  What value or values will you need to prioritize to help you reach your goal?
                </Label>
                <Textarea
                  id="priority_values"
                  value={formData.priority_values}
                  onChange={(e) => updateForm("priority_values", e.target.value)}
                  className="min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Identify which values you'll need to prioritize for your goals..."
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

export default ValuesConflict;
