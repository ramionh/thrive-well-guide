
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface BuildOnYourStrengthsProps {
  onComplete?: () => void;
}

interface StrengthApplication {
  strength: string;
  application: string;
}

const BuildOnYourStrengths: React.FC<BuildOnYourStrengthsProps> = ({ onComplete }) => {
  const [strengthApplications, setStrengthApplications] = useState<StrengthApplication[]>([
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ]);

  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strength_applications",
    initialState: {
      strengthApplications: []
    }
  });

  useEffect(() => {
    fetchData().then((data) => {
      if (data && 'strengthApplications' in data && Array.isArray(data.strengthApplications)) {
        if (data.strengthApplications.length > 0) {
          setStrengthApplications(data.strengthApplications);
        }
      }
    });
  }, []);

  const handleStrengthChange = (index: number, value: string) => {
    const updatedApplications = [...strengthApplications];
    updatedApplications[index].strength = value;
    setStrengthApplications(updatedApplications);
  };

  const handleApplicationChange = (index: number, value: string) => {
    const updatedApplications = [...strengthApplications];
    updatedApplications[index].application = value;
    setStrengthApplications(updatedApplications);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("strengthApplications", strengthApplications);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Build on Your Strengths</h2>
              <p className="text-gray-600 mb-6">
                Choose three strengths from the list in the previous step and explain how each one can help you work toward your goal.
              </p>
            </div>

            <div className="space-y-6">
              {strengthApplications.map((application, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg space-y-4">
                  <div>
                    <Label htmlFor={`strength-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Strength {index + 1}
                    </Label>
                    <Input
                      id={`strength-${index}`}
                      value={application.strength}
                      onChange={(e) => handleStrengthChange(index, e.target.value)}
                      className="focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter a strength from the previous step"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`application-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      How it can help:
                    </Label>
                    <Textarea
                      id={`application-${index}`}
                      value={application.application}
                      onChange={(e) => handleApplicationChange(index, e.target.value)}
                      className="min-h-[80px] focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Explain how this strength can help you work toward your goal..."
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

export default BuildOnYourStrengths;
