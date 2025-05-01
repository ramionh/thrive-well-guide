
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import LoadingState from "./shared/LoadingState";

interface GettingReadyProps {
  onComplete?: () => void;
}

const GettingReady: React.FC<GettingReadyProps> = ({ onComplete }) => {
  const [selfPersuasion, setSelfPersuasion] = useState<string>("");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Fetch existing data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("motivation_getting_ready")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          console.log("Found existing getting ready data:", data);
          setSelfPersuasion(data.self_persuasion || "");
        }
      } catch (error) {
        console.error("Error fetching Getting Ready data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Use upsert to handle both insert and update scenarios
      const { error } = await supabase
        .from("motivation_getting_ready")
        .upsert({
          user_id: user.id,
          self_persuasion: selfPersuasion,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id"
        });

      if (error) throw error;

      // Mark the step as completed in the progress tracking table
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 66, // Step number for Getting Ready
          step_name: "Getting Ready",
          completed: true,
          completed_at: new Date().toISOString(),
          available: true
        }, {
          onConflict: "user_id,step_number"
        });

      if (progressError) throw progressError;
      
      // Also make the next step available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 67,
          step_name: "Making Your Goal Measurable",
          completed: false,
          available: true,
          completed_at: null
        }, {
          onConflict: "user_id,step_number"
        });
      
      if (nextStepError) throw nextStepError;
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving Getting Ready data:", error);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Getting Ready for Change</h2>
              
              <p className="text-gray-600 mb-4">
                Change is often challenging, especially when it comes to health and fitness habits 
                that have been part of our lives for years. Before diving into specific action plans, 
                it's important to prepare yourself mentally for the journey ahead.
              </p>
              
              <p className="text-gray-600 mb-6">
                Self-persuasion is a powerful technique where you actively convince yourself of the 
                importance and possibility of change. Unlike external motivation that fades, self-persuasion 
                creates lasting internal motivation that can sustain you through challenges.
              </p>
              
              <div className="space-y-4">
                <label className="text-purple-700 font-medium">
                  Write a persuasive argument to yourself about why changing now is important and possible:
                </label>
                
                <Textarea
                  value={selfPersuasion}
                  onChange={(e) => setSelfPersuasion(e.target.value)}
                  placeholder="I need to make this change because... I know I can succeed because..."
                  className="h-48"
                />
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

export default GettingReady;
