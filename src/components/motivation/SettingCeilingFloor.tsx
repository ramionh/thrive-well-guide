
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface SettingCeilingFloorProps {
  onComplete?: () => void;
}

interface CeilingFloorFormData {
  best_outcome: string;
  worst_outcome: string;
}

const SettingCeilingFloor: React.FC<SettingCeilingFloorProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<CeilingFloorFormData>({
    tableName: "motivation_ceiling_floor",
    initialState: {
      best_outcome: "",
      worst_outcome: ""
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Setting Ceiling & Floor</h2>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <p className="text-gray-700">
                Before moving on to assessing your level of confidence in taking action, let's set your importance floor and ceiling.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="best-outcome" className="block mb-2 font-medium text-purple-700">
                  Imagine you scored yourself a 10, meaning it is extremely important for you to take action. What's the best thing that could happen if you make this change?
                </label>
                <Textarea
                  id="best-outcome"
                  value={formData.best_outcome || ""}
                  onChange={(e) => updateForm("best_outcome", e.target.value)}
                  rows={4}
                  placeholder="Describe the best possible outcome..."
                  required
                  className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="worst-outcome" className="block mb-2 font-medium text-purple-700">
                  On the other hand, imagine you scored yourself a 1, meaning it is extremely unimportant for you to take action (at least for the time being). What's the worst thing that could happen if you don't make this change?
                </label>
                <Textarea
                  id="worst-outcome"
                  value={formData.worst_outcome || ""}
                  onChange={(e) => updateForm("worst_outcome", e.target.value)}
                  rows={4}
                  placeholder="Describe the worst possible outcome..."
                  required
                  className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
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

export default SettingCeilingFloor;
