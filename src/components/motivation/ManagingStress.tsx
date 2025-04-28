import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface ManagingStressProps {
  onComplete?: () => void;
}

// Define an interface for the data we expect to receive
interface ManagingStressData {
  stressors: string[];
  impact: string;
}

const ManagingStress: React.FC<ManagingStressProps> = ({ onComplete }) => {
  const [stressors, setStressors] = useState<string[]>(["", "", "", "", ""]);
  const [impact, setImpact] = useState<string>("");

  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<ManagingStressData>({
    tableName: "motivation_managing_stress",
    initialState: {
      stressors: [],
      impact: ""
    }
  });

  useEffect(() => {
    fetchData().then((response) => {
      if (!response) return;
      
      const data = response as ManagingStressData;
        
      if (Array.isArray(data.stressors)) {
        const savedStressors = [...data.stressors];
        while (savedStressors.length < 5) {
          savedStressors.push("");
        }
        setStressors(savedStressors.slice(0, 5));
      }
          
      if (data.impact) {
        setImpact(data.impact);
      }
    });
  }, [fetchData]);

  const handleStressorChange = (index: number, value: string) => {
    const newStressors = [...stressors];
    newStressors[index] = value;
    setStressors(newStressors);
  };

  const handleImpactChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImpact(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredStressors = stressors.filter(s => s.trim() !== "");
    
    updateForm("stressors", filteredStressors);
    updateForm("impact", impact);
    
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Managing Stress</h2>
              <p className="text-gray-600 mb-6">
                We've all experienced stress. You can probably recognize the signs: the muscles in your neck and shoulders tighten, 
                your heart beats a little harder, you breathe a little faster, and your mind becomes filled with frustrated or anxious thoughts.
              </p>
              <p className="text-gray-600 mb-6">
                Stress can arise from many different sources. Perhaps you overslept and now you're late getting to work. 
                Maybe you're driving to the gym and the slow driver in front of you seems determined to make you late for your training session. 
                Maybe you feel like you're stuck in an unfulfilling fitness routine or you recently argued with your workout partner.
              </p>
              <p className="text-gray-600 mb-6">
                But we don't feel stressed only when something unpleasant occurs; we can also feel it when something positive happens. 
                If you're considering changing a behavior, trying something new, or giving something up, you're probably feeling a little stressed.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700">
                Close your eyes and picture your Top Five Stressors, then write them below with a brief description.
              </Label>

              {stressors.map((stressor, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-purple-700 font-medium mt-2">{index + 1}.</span>
                  <Input
                    value={stressor}
                    onChange={(e) => handleStressorChange(index, e.target.value)}
                    className="focus:border-purple-500 focus:ring-purple-500"
                    placeholder={`Stressor ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact" className="block text-sm font-medium text-gray-700">
                How might these stressors get in the way of achieving your goal?
              </Label>
              <Textarea
                id="impact"
                value={impact}
                onChange={handleImpactChange}
                className="min-h-[120px] focus:border-purple-500 focus:ring-purple-500"
                placeholder="Describe how these stressors might affect your goals..."
              />
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

export default ManagingStress;
