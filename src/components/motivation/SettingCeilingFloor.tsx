
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface SettingCeilingFloorProps {
  onComplete?: () => void;
}

const SettingCeilingFloor: React.FC<SettingCeilingFloorProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [bestOutcome, setBestOutcome] = useState("");
  const [worstOutcome, setWorstOutcome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_ceiling_floor")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setBestOutcome(data.best_outcome || "");
          setWorstOutcome(data.worst_outcome || "");
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
        .from("motivation_ceiling_floor")
        .insert({
          user_id: user.id,
          best_outcome: bestOutcome,
          worst_outcome: worstOutcome
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
            <div className="mb-6">
              <p className="text-gray-600">
                Before moving on to assessing your level of confidence in taking action, let's set your importance floor and ceiling.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="best-outcome" className="block mb-2 font-medium text-purple-800">
                  Imagine you scored yourself a 10, meaning it is extremely important for you to take action. What's the best thing that could happen if you make this change?
                </label>
                <Textarea
                  id="best-outcome"
                  value={bestOutcome}
                  onChange={(e) => setBestOutcome(e.target.value)}
                  rows={4}
                  placeholder="Describe the best possible outcome..."
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="worst-outcome" className="block mb-2 font-medium text-purple-800">
                  On the other hand, imagine you scored yourself a 1, meaning it is extremely unimportant for you to take action (at least for the time being). What's the worst thing that could happen if you don't make this change?
                </label>
                <Textarea
                  id="worst-outcome"
                  value={worstOutcome}
                  onChange={(e) => setWorstOutcome(e.target.value)}
                  rows={4}
                  placeholder="Describe the worst possible outcome..."
                  required
                  className="w-full"
                />
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

export default SettingCeilingFloor;
