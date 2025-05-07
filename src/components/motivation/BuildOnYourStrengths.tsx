
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMotivationSafeData } from "@/hooks/motivation/useMotivationSafeData";

interface BuildOnYourStrengthsProps {
  onComplete?: () => void;
}

interface StrengthApplication {
  strength: string;
  application: string;
}

const parseStrengthApplicationsData = (data: any) => {
  console.log("Parsing strength applications data:", data);
  
  let strengthApplications: StrengthApplication[] = [
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ];
  
  if (data.strength_applications) {
    if (Array.isArray(data.strength_applications)) {
      strengthApplications = data.strength_applications.length > 0 
        ? [...data.strength_applications]
        : strengthApplications;
    } else if (typeof data.strength_applications === 'string') {
      try {
        const parsed = JSON.parse(data.strength_applications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          strengthApplications = parsed;
        }
      } catch (e) {
        console.error("Error parsing strength_applications JSON:", e);
      }
    }
    
    // Ensure we have exactly 3 entries
    if (strengthApplications.length < 3) {
      const remaining = 3 - strengthApplications.length;
      for (let i = 0; i < remaining; i++) {
        strengthApplications.push({ strength: "", application: "" });
      }
    }
  }
  
  return { strength_applications: strengthApplications };
};

const BuildOnYourStrengths: React.FC<BuildOnYourStrengthsProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [strengthApplications, setStrengthApplications] = useState<StrengthApplication[]>([
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ]);

  const { 
    formData, 
    isLoading,
    error
  } = useMotivationSafeData(
    "motivation_strength_applications",
    { strength_applications: [] as StrengthApplication[] },
    parseStrengthApplicationsData
  );

  const { 
    isSaving,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strength_applications",
    initialState: {
      strength_applications: [] as StrengthApplication[]
    },
    onSuccess: onComplete,
    stepNumber: 42,
    nextStepNumber: 52,
    stepName: "Build on Your Strengths",
    nextStepName: "Family Strengths"
  });

  // Update local state when formData changes
  React.useEffect(() => {
    if (formData && formData.strength_applications) {
      if (Array.isArray(formData.strength_applications) && formData.strength_applications.length > 0) {
        setStrengthApplications(formData.strength_applications);
      }
    }
  }, [formData]);

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
    console.log("Submitting strength applications:", strengthApplications);
    submitForm({
      strength_applications: strengthApplications
    });
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
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-800">Build on Your Strengths</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            Choose three strengths from the list in the previous step and explain how each one can help you work toward your goal.
          </p>

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
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
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
                    className="min-h-[80px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Explain how this strength can help you work toward your goal..."
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BuildOnYourStrengths;
