
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface TakingAnotherStepTowardChangeProps {
  onComplete?: () => void;
}

const TakingAnotherStepTowardChange: React.FC<TakingAnotherStepTowardChangeProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newScore, setNewScore] = useState("");
  const [newDescriptor, setNewDescriptor] = useState("");
  const [newExplanation, setNewExplanation] = useState("");

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_next_step_confidence")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setNewScore(data.new_score.toString());
          setNewDescriptor(data.new_descriptor);
          setNewExplanation(data.new_explanation);
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
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_next_step_confidence")
        .insert({
          user_id: user.id,
          new_score: parseInt(newScore),
          new_descriptor: newDescriptor,
          new_explanation: newExplanation
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Taking Another Step Toward Change</h2>
              <p className="text-gray-600 mb-6">
                Consider what it would take to increase your confidence score by one. Write your new score and descriptor below.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="newScore" className="block text-sm font-medium text-gray-700 mb-1">
                  New Score (1-10)
                </label>
                <Input
                  id="newScore"
                  type="number"
                  min="1"
                  max="10"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  required
                  className="w-32"
                />
              </div>

              <div>
                <label htmlFor="newDescriptor" className="block text-sm font-medium text-gray-700 mb-1">
                  New Descriptor
                </label>
                <Input
                  id="newDescriptor"
                  type="text"
                  value={newDescriptor}
                  onChange={(e) => setNewDescriptor(e.target.value)}
                  required
                  placeholder="e.g., determined, confident, etc."
                />
              </div>

              <div>
                <label htmlFor="newExplanation" className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation
                </label>
                <Textarea
                  id="newExplanation"
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  required
                  placeholder="Write a short explanation that describes your rating or descriptor."
                  className="h-24"
                />
              </div>

              <div className="italic text-gray-600 text-sm mt-4">
                Example: "I rated myself 5. To become 6, I would need to have some new ideas to help me stick with my workout schedule and then be able to maintain it for a month."
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

export default TakingAnotherStepTowardChange;
