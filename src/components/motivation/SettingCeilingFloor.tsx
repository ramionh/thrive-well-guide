
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import LoadingState from "./shared/LoadingState";

interface SettingCeilingFloorProps {
  onComplete?: () => void;
}

const SettingCeilingFloor: React.FC<SettingCeilingFloorProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bestOutcome, setBestOutcome] = useState("");
  const [worstOutcome, setWorstOutcome] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching ceiling floor data for user:', user.id);
      const { data, error } = await supabase
        .from('motivation_ceiling_floor')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error('Error fetching ceiling floor data:', error);
        throw error;
      }

      console.log('Retrieved ceiling floor data:', data);
      
      if (data) {
        // Set best outcome
        if (data.best_outcome) {
          console.log('Setting best outcome:', data.best_outcome);
          setBestOutcome(data.best_outcome);
        }
        
        // Set worst outcome
        if (data.worst_outcome) {
          console.log('Setting worst outcome:', data.worst_outcome);
          setWorstOutcome(data.worst_outcome);
        }
      }
    } catch (error) {
      console.error('Error fetching ceiling floor data:', error);
      toast({
        title: "Error",
        description: "Failed to load your saved responses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const dataToSave = {
        user_id: user.id,
        best_outcome: bestOutcome,
        worst_outcome: worstOutcome,
        updated_at: new Date().toISOString()
      };
      
      console.log('Saving ceiling floor data:', dataToSave);
      
      const { error } = await supabase
        .from('motivation_ceiling_floor')
        .upsert(dataToSave);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your responses have been saved"
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving ceiling floor data:', error);
      toast({
        title: "Error",
        description: "Failed to save your responses",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Setting Ceiling & Floor</h2>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
              <p className="text-gray-700">
                Before moving on to assessing your level of confidence in taking action, let's set your importance floor and ceiling.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="best-outcome" className="block mb-2 font-medium text-purple-700">
                  Imagine you scored yourself a 10, meaning it is extremely important for you to take action. What's the best thing that could happen if you make this change?
                </label>
                <Textarea
                  id="best-outcome"
                  value={bestOutcome}
                  onChange={(e) => setBestOutcome(e.target.value)}
                  rows={4}
                  placeholder="Describe the best possible outcome..."
                  required
                  className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="worst-outcome" className="block mb-2 font-medium text-purple-700">
                  On the other hand, imagine you scored yourself a 1, meaning it is extremely unimportant for you to take action (at least for the time being). What's the worst thing that could happen if you don't make this change?
                </label>
                <Textarea
                  id="worst-outcome"
                  value={worstOutcome}
                  onChange={(e) => setWorstOutcome(e.target.value)}
                  rows={4}
                  placeholder="Describe the worst possible outcome..."
                  required
                  className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
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

export default SettingCeilingFloor;
