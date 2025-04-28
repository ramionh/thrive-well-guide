import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface Step {
  text: string;
  rating: number;
}

interface AssessingImportanceStepsForwardProps {
  onComplete?: () => void;
}

const AssessingImportanceStepsForward: React.FC<AssessingImportanceStepsForwardProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState<Step[]>(Array(5).fill({ text: "", rating: 0 }));
  const [selectedStep, setSelectedStep] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_step_assessments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          let parsedSteps: Step[] = [];
          
          if (data.steps) {
            if (typeof data.steps === 'string') {
              try {
                parsedSteps = JSON.parse(data.steps);
              } catch (e) {
                console.error("Error parsing steps JSON:", e);
              }
            } 
            else if (Array.isArray(data.steps)) {
              parsedSteps = data.steps.map(step => {
                const jsonStep = step as unknown as { text?: string; rating?: number };
                return {
                  text: typeof jsonStep.text === 'string' ? jsonStep.text : '',
                  rating: typeof jsonStep.rating === 'number' ? jsonStep.rating : 0
                };
              });
            }
          }
          
          if (parsedSteps.length > 0) {
            setSteps(parsedSteps);
          }
          
          if (data.selected_step) {
            setSelectedStep(typeof data.selected_step === 'string' ? data.selected_step : '');
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [user, toast]);

  const getPlaceholder = (index: number) => {
    switch(index) {
      case 0:
        return "Example: Establish a 3-day strength-training routine";
      case 1:
        return "Example: Track daily protein intake (≥1.6 g per kg bodyweight)";
      case 2:
        return "Example: Aim for at least 7 hours of sleep each night";
      case 3:
        return "Example: Include two weekly HIIT cardio sessions";
      case 4:
        return "Example: Drink at least 2.5 L of water daily";
      default:
        return `Step ${index + 1}`;
    }
  };

  const handleStepChange = (index: number, field: keyof Step, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: field === 'rating' ? Number(value) : value
    };
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_step_assessments")
        .insert({
          user_id: user.id,
          steps: JSON.stringify(steps),
          selected_step: selectedStep
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Assessing the Importance of My Steps Forward</h2>
              <p className="text-gray-600 mb-6">
                Think of five steps you can take to help you achieve your fitness goals. For each step, state it clearly and assign a rating on your importance scale (1 = low importance, 10 = high importance).
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Input
                      value={step.text}
                      onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                      placeholder={getPlaceholder(index)}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={step.rating || ''}
                      onChange={(e) => handleStepChange(index, 'rating', e.target.value)}
                      placeholder="Rating"
                      required
                    />
                  </div>
                  {step.rating >= 7 && (
                    <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-gray-600 mb-4">
                Put a star beside each Step Forward rated 7 or above. Choose one you would like to start with. 
                Write it below and explain why you chose it.
              </p>
              <Textarea
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
                placeholder="Enter your selected step and explanation here..."
                className="h-24"
                required
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

export default AssessingImportanceStepsForward;
