
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuildOnYourStrengthsProps {
  onComplete?: () => void;
}

interface StrengthApplication {
  strength: string;
  application: string;
}

// Define a parser for strength applications data
const parseStrengthApplicationsData = (data: any) => {
  console.log("Parsing strength applications data:", data);
  
  let strengthApplications: StrengthApplication[] = [
    { strength: "", application: "" },
    { strength: "", application: "" },
    { strength: "", application: "" },
  ];
  
  // Parse strength_applications
  if (data.strength_applications) {
    if (Array.isArray(data.strength_applications)) {
      // Data is already in array format
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
  
  console.log("Parsed strength applications:", strengthApplications);
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
    isSaving, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_strength_applications",
    initialState: {
      strength_applications: [] as StrengthApplication[]
    },
    onSuccess: onComplete,
    parseData: parseStrengthApplicationsData,
    transformData: (data) => {
      // Ensure data is properly formatted for saving to database
      return {
        strength_applications: strengthApplications
      };
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching strength applications data:", error);
        toast({
          title: "Error",
          description: "Failed to load your strength applications data",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [fetchData, toast]);

  // Update local state when formData changes
  useEffect(() => {
    console.log("Form data updated for strength applications:", formData);
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
    updateForm("strength_applications", strengthApplications);
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
        )}
      </CardContent>
    </Card>
  );
};

export default BuildOnYourStrengths;
