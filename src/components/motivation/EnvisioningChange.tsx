
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface EnvisioningChangeProps {
  onComplete: () => void;
}

const EnvisioningChange: React.FC<EnvisioningChangeProps> = ({ onComplete }) => {
  const initialState = {
    successfulChange: "",
    howItWorked: ""
  };

  const { formData, updateForm, submitForm, isLoading } = useMotivationForm({
    tableName: "motivation_envisioning_change",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        successful_change: data.successfulChange,
        how_it_worked: data.howItWorked
      };
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-700 mb-6">
            Let's think about your goal again. Now that you've explored this change and thought about your strengths, resources, obstacles, and stress, what does a successful change look like?
          </p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="successfulChange" className="text-purple-600 font-medium">
                What does a successful change look like?
              </Label>
              <Textarea
                id="successfulChange"
                value={formData.successfulChange}
                onChange={(e) => updateForm("successfulChange", e.target.value)}
                className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={4}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="howItWorked" className="text-purple-600 font-medium">
                If you succeeded with this change, what most likely worked? How did it happen?
              </Label>
              <Textarea
                id="howItWorked"
                value={formData.howItWorked}
                onChange={(e) => updateForm("howItWorked", e.target.value)}
                className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnvisioningChange;
