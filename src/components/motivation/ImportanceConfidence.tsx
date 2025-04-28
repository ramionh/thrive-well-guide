
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ImportanceConfidenceProps {
  onComplete?: () => void;
}

const ImportanceConfidence: React.FC<ImportanceConfidenceProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_importance_confidence")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.selected_quadrant) {
          setSelectedQuadrant(data.selected_quadrant);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedQuadrant === null) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_importance_confidence")
        .insert({
          user_id: user.id,
          selected_quadrant: selectedQuadrant
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Importance x Confidence</h2>
              <p className="text-gray-600 mb-6">
                As you consider the ratings you gave yourself on importance and confidence, identify which quadrant you belong in. 
                For example, if your importance is 7 or above, you belong in the square labeled 1 or 3. 
                If your confidence is 7 or above, then circle quadrant 1. 
                If your confidence is below 4, circle quadrant 3.
              </p>
            </div>

            <div className="border border-purple-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-purple-200">
                <div className="p-4 text-center font-semibold border-r border-purple-200">
                  <div className="text-lg text-purple-800">HIGH IMPORTANCE</div>
                </div>
                <div className="p-4 text-center font-semibold">
                  <div className="text-lg text-purple-800">LOW IMPORTANCE</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-purple-200">
                <div className="p-4 border-r border-purple-200 min-h-[150px] bg-purple-50">
                  <div className="text-lg font-semibold text-purple-800 mb-2">1</div>
                  <div className="text-sm text-gray-700">
                    <p>Mostly to very important</p>
                    <p>Mostly to very confident</p>
                  </div>
                </div>
                <div className="p-4 min-h-[150px] bg-purple-50">
                  <div className="text-lg font-semibold text-purple-800 mb-2">2</div>
                  <div className="text-sm text-gray-700">
                    <p>Somewhat to not at all important</p>
                    <p>Mostly to very confident</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="p-4 border-r border-purple-200 min-h-[150px] bg-purple-50">
                  <div className="text-lg font-semibold text-purple-800 mb-2">3</div>
                  <div className="text-sm text-gray-700">
                    <p>Mostly to very important</p>
                    <p>Somewhat to not at all confident</p>
                  </div>
                </div>
                <div className="p-4 min-h-[150px] bg-purple-50">
                  <div className="text-lg font-semibold text-purple-800 mb-2">4</div>
                  <div className="text-sm text-gray-700">
                    <p>Somewhat to not at all important</p>
                    <p>Somewhat to not at all confident</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-md font-semibold text-purple-800 mb-4">Select your quadrant:</h3>

              <RadioGroup 
                value={selectedQuadrant?.toString() || ""}
                onValueChange={(value) => setSelectedQuadrant(parseInt(value, 10))}
                className="space-y-3"
              >
                {[1, 2, 3, 4].map((quadrant) => (
                  <div key={quadrant} className="flex items-center space-x-2">
                    <RadioGroupItem value={quadrant.toString()} id={`quadrant-${quadrant}`} />
                    <Label htmlFor={`quadrant-${quadrant}`} className="text-base">
                      Quadrant {quadrant}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {selectedQuadrant === 1 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">
                  If you chose quadrant 1, you may be ready to move on to creating your action plan.
                  If you'd like to explore your confidence and importance, continue with the next steps.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || selectedQuadrant === null}
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

export default ImportanceConfidence;
