
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "./shared/LoadingState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, PlusCircle, X } from "lucide-react";

interface SelfObservationProps {
  onComplete: () => void;
}

interface Observation {
  date: string;
  situation: string;
  thoughts: string;
  feelings: string;
  behavior: string;
}

const SelfObservation: React.FC<SelfObservationProps> = ({ onComplete }) => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const didInitialFetch = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || didInitialFetch.current) return;
      
      console.log("SelfObservation: Fetching data for user", user.id);
      setIsLoading(true);
      didInitialFetch.current = true;

      try {
        const { data, error } = await supabase
          .from("motivation_self_observation")
          .select("observations")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching self-observations:", error);
          setError("Failed to load your observations. Please try again.");
        } else {
          console.log("Self-observation data loaded:", data);
          if (data && Array.isArray(data.observations)) {
            // Convert to proper Observation type
            const fetchedObservations: Observation[] = (data.observations as any[]).map(obs => ({
              date: obs.date || new Date().toISOString().split('T')[0],
              situation: obs.situation || "",
              thoughts: obs.thoughts || "",
              feelings: obs.feelings || "",
              behavior: obs.behavior || ""
            }));
            
            setObservations(fetchedObservations);
          } else {
            // Initialize with one empty observation if none exist
            setObservations([{
              date: new Date().toISOString().split('T')[0],
              situation: "",
              thoughts: "",
              feelings: "",
              behavior: ""
            }]);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addObservation = () => {
    setObservations([
      ...observations,
      {
        date: new Date().toISOString().split('T')[0],
        situation: "",
        thoughts: "",
        feelings: "",
        behavior: ""
      }
    ]);
  };

  const updateObservation = (index: number, field: keyof Observation, value: string) => {
    const updatedObservations = [...observations];
    updatedObservations[index] = {
      ...updatedObservations[index],
      [field]: value
    };
    setObservations(updatedObservations);
  };

  const removeObservation = (index: number) => {
    setObservations(observations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your observations",
        variant: "destructive"
      });
      return;
    }

    console.log("SelfObservation: Saving observations for user", user.id);
    setIsSaving(true);
    
    try {
      const { data: existingData, error: findError } = await supabase
        .from("motivation_self_observation")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (findError && findError.code !== "PGRST116") {
        throw findError;
      }

      let result;
      
      // Convert observations to format suitable for JSON storage
      const jsonObs = observations.map(obs => ({
        date: obs.date,
        situation: obs.situation,
        thoughts: obs.thoughts,
        feelings: obs.feelings, 
        behavior: obs.behavior
      }));

      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from("motivation_self_observation")
          .update({
            observations: jsonObs,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from("motivation_self_observation")
          .insert({
            user_id: user.id,
            observations: jsonObs,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) {
        throw result.error;
      }

      // Log step progress
      await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 26,
          step_name: "Self Observation",
          completed: true,
          available: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });
      
      // Make next step available
      await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 27,
          step_name: "Defining Confidence",
          completed: false,
          available: true,
          completed_at: null
        }, {
          onConflict: 'user_id,step_number'
        });

      toast({
        title: "Success",
        description: "Your self-observations have been saved!"
      });

      onComplete();
    } catch (err: any) {
      console.error("Error saving self-observations:", err);
      setError(err.message || "Failed to save your observations");
      toast({
        title: "Error",
        description: "Failed to save your observations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <EyeIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Self-Observation</h2>
        </div>

        <p className="mb-6 text-gray-700">
          Self-observation involves noticing your thoughts, feelings, and behaviors in different situations. 
          This awareness is key to understanding your patterns and making meaningful changes.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {observations.map((observation, index) => (
            <div key={index} className="p-4 border border-purple-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-purple-700">Observation #{index + 1}</h3>
                {observations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObservation(index)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove observation"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`date-${index}`}>Date</Label>
                  <Input
                    id={`date-${index}`}
                    type="date"
                    value={observation.date}
                    onChange={(e) => updateObservation(index, "date", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`situation-${index}`}>Situation</Label>
                  <Input
                    id={`situation-${index}`}
                    placeholder="Describe the situation"
                    value={observation.situation}
                    onChange={(e) => updateObservation(index, "situation", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`thoughts-${index}`}>Thoughts</Label>
                  <Input
                    id={`thoughts-${index}`}
                    placeholder="What were you thinking?"
                    value={observation.thoughts}
                    onChange={(e) => updateObservation(index, "thoughts", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`feelings-${index}`}>Feelings</Label>
                  <Input
                    id={`feelings-${index}`}
                    placeholder="How did you feel?"
                    value={observation.feelings}
                    onChange={(e) => updateObservation(index, "feelings", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor={`behavior-${index}`}>Behavior</Label>
                  <Input
                    id={`behavior-${index}`}
                    placeholder="What did you do?"
                    value={observation.behavior}
                    onChange={(e) => updateObservation(index, "behavior", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button 
              type="button" 
              onClick={addObservation}
              variant="outline"
              className="flex items-center gap-2 border-dashed"
            >
              <PlusCircle size={16} />
              Add Another Observation
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SelfObservation;
