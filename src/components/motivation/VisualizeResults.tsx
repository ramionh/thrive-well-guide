import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "./shared/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useProgress } from "@/hooks/motivation/useProgress";

interface VisualizeResultsProps {
  onComplete?: () => void;
}

const VisualizeResults: React.FC<VisualizeResultsProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { markStepComplete } = useProgress();
  const [threeMonths, setThreeMonths] = useState<string>("");
  const [sixMonths, setSixMonths] = useState<string>("");
  const [oneYear, setOneYear] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("VisualizeResults: Fetching data for user", user.id);
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("motivation_visualize_results")
          .select("three_months, six_months, one_year")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          // If the error is "No rows found", this is the first time the user is accessing this step
          if (error.code === "PGRST116") {
            console.log("VisualizeResults: No previous data found");
            setThreeMonths("");
            setSixMonths("");
            setOneYear("");
          } else {
            console.error("VisualizeResults: Error fetching data:", error);
            toast({
              title: "Error",
              description: "There was a problem loading your data. Please refresh and try again.",
              variant: "destructive"
            });
          }
        } else if (data) {
          console.log("VisualizeResults: Data loaded successfully:", data);
          setThreeMonths(data.three_months || "");
          setSixMonths(data.six_months || "");
          setOneYear(data.one_year || "");
        }
      } catch (error) {
        console.error("VisualizeResults: Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your progress.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("VisualizeResults: Submitting form with data:", {
      three_months: threeMonths,
      six_months: sixMonths,
      one_year: oneYear
    });
    
    setIsSaving(true);
    
    try {
      // Insert the data directly into the database
      const { error } = await supabase
        .from("motivation_visualize_results")
        .insert({
          user_id: user.id,
          three_months: threeMonths,
          six_months: sixMonths,
          one_year: oneYear
        });

      if (error) {
        throw error;
      }

      // Mark step as complete
      await markStepComplete(59, 60, "Visualize Results", "They See Your Strengths");
      
      toast({
        title: "Success",
        description: "Your visualized results have been saved!"
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error("VisualizeResults: Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Visualize Results</h2>
              
              <p className="text-gray-600 mb-6">
                As you look at your Action Plan and timeline, what will your change look and feel like along the way?
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="threeMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself three months from now.
                  </label>
                  <Textarea
                    id="threeMonths"
                    value={threeMonths}
                    onChange={(e) => setThreeMonths(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I see myself sticking with my planned workout routine of strength training three times per week and cardio twice a week. 
                    I've lost about 7-8 pounds and my endurance has increased noticeably. My clothes are starting to fit better, 
                    and I'm sleeping more soundly at night."
                  </p>
                </div>
                
                <div>
                  <label htmlFor="sixMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself six months from now.
                  </label>
                  <Textarea
                    id="sixMonths"
                    value={sixMonths}
                    onChange={(e) => setSixMonths(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I'm consistently making healthy food choices and have developed a good balance between my workout schedule and rest days. 
                    I've lost about 15 pounds total and have reached my initial weight goal. I'm feeling more energetic throughout the day 
                    and have started participating in weekend hiking groups."
                  </p>
                </div>
                
                <div>
                  <label htmlFor="oneYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself a year from now.
                  </label>
                  <Textarea
                    id="oneYear"
                    value={oneYear}
                    onChange={(e) => setOneYear(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I've maintained my weight loss and have developed muscle definition I never had before. 
                    Exercise has become a natural part of my lifestyle that I genuinely enjoy rather than something I have to force myself to do. 
                    I'm starting to train for my first 10K race and have made several new friends through my fitness activities."
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualizeResults;