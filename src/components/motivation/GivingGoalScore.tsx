
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface GivingGoalScoreProps {
  onComplete?: () => void;
}

const GivingGoalScore: React.FC<GivingGoalScoreProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState("");
  const [descriptor, setDescriptor] = useState("");
  const [explanation, setExplanation] = useState("");

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchExistingScore = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_goal_scores")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setScore(data.score.toString());
          setDescriptor(data.descriptor);
          setExplanation(data.explanation);
        }
      } catch (error) {
        console.error("Error fetching goal score:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingScore();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_goal_scores")
        .insert({
          user_id: user.id,
          score: parseInt(score),
          descriptor,
          explanation
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your goal score has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving goal score:", error);
      toast({
        title: "Error",
        description: "Failed to save your responses",
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Giving Your Goal a Score</h2>
              <p className="text-gray-600 mb-6">
                Using your scale from the previous step, consider how important it is to take action toward your goal. 
                Write down your rating below.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Score (1-10)
                </label>
                <Input
                  id="score"
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  className="w-32"
                />
              </div>

              <div>
                <label htmlFor="descriptor" className="block text-sm font-medium text-gray-700 mb-1">
                  Descriptor
                </label>
                <Input
                  id="descriptor"
                  type="text"
                  value={descriptor}
                  onChange={(e) => setDescriptor(e.target.value)}
                  required
                  placeholder="e.g., Important, Crucial, etc."
                />
              </div>

              <div>
                <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation
                </label>
                <Textarea
                  id="explanation"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  required
                  placeholder="Write a short explanation that describes why you chose your rating or descriptor and not a lower number."
                  className="h-24"
                />
              </div>

              <div className="italic text-gray-600 text-sm mt-4">
                Example: "I rated myself 6 and not 5 because I know I would feel less stressed if I maintained my fitness routine consistently and it's the responsible thing to do. I know I should work on sticking to my workout schedule."
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

export default GivingGoalScore;
