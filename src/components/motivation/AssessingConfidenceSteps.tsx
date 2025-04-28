
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

interface ConfidenceStep {
  text: string;
  rating: number;
}

interface AssessingConfidenceStepsProps {
  onComplete?: () => void;
}

const AssessingConfidenceSteps: React.FC<AssessingConfidenceStepsProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confidenceSteps, setConfidenceSteps] = useState<ConfidenceStep[]>(
    Array.from({ length: 5 }, () => ({
      text: "",
      rating: 1
    }))
  );
  const [selectedConfidenceStep, setSelectedConfidenceStep] = useState("");

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_confidence_steps")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          let parsedSteps: ConfidenceStep[] = [];
          
          if (data.confidence_steps) {
            try {
              // Convert the retrieved JSON data to the expected type
              if (typeof data.confidence_steps === 'string') {
                parsedSteps = JSON.parse(data.confidence_steps) as ConfidenceStep[];
              } else {
                // Cast the Json[] to the correct type using type assertion
                const jsonArray = data.confidence_steps as unknown;
                if (Array.isArray(jsonArray)) {
                  parsedSteps = (jsonArray as any[]).map(item => ({
                    text: item.text || "",
                    rating: parseInt(item.rating) || 1
                  }));
                }
              }
            } catch (parseError) {
              console.error("Error parsing confidence steps:", parseError);
              parsedSteps = [];
            }
            
            // Ensure we have 5 steps
            if (parsedSteps.length < 5) {
              const additionalSteps = Array.from({ length: 5 - parsedSteps.length }, () => ({
                text: "",
                rating: 1
              }));
              parsedSteps = [...parsedSteps, ...additionalSteps];
            }
            
            setConfidenceSteps(parsedSteps);
          }
          
          if (data.selected_confidence_step) {
            setSelectedConfidenceStep(data.selected_confidence_step);
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

  const handleStepChange = (index: number, field: keyof ConfidenceStep, value: string | number) => {
    setConfidenceSteps(prevSteps => 
      prevSteps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_confidence_steps")
        .insert({
          user_id: user.id,
          confidence_steps: JSON.stringify(confidenceSteps),
          selected_confidence_step: selectedConfidenceStep
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Assessing Your Confidence in Your Steps Forward</h2>
              <p className="text-gray-600 mb-6">
                This exercise revisits the Steps Forward you identified earlier. 
                Write down those five steps and rate each using your confidence scale.
              </p>
            </div>

            <div className="space-y-4">
              {confidenceSteps.map((step, index) => (
                <div key={index} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-800">Step {index + 1}</span>
                    {step.rating >= 7 && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Enter your step forward"
                        value={step.text}
                        onChange={(e) => handleStepChange(index, "text", e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rating (1-10):</span>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={step.rating}
                        onChange={(e) => handleStepChange(index, "rating", parseInt(e.target.value, 10) || 1)}
                        required
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                Put a star beside each Step Forward rated 7 or above. Choose one you would like to start with, 
                then write it below and explain why you chose it.
              </p>
              <Textarea
                placeholder="Enter your selected step and explain why you chose it"
                value={selectedConfidenceStep}
                onChange={(e) => setSelectedConfidenceStep(e.target.value)}
                required
                rows={4}
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

export default AssessingConfidenceSteps;
