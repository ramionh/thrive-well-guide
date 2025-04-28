
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface ConfidenceScaleEntry {
  number: number;
  descriptor: string;
  definition: string;
}

interface CreatingConfidenceScaleProps {
  onComplete?: () => void;
}

const CreatingConfidenceScale: React.FC<CreatingConfidenceScaleProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState<ConfidenceScaleEntry[]>(
    Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      descriptor: "",
      definition: ""
    }))
  );

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_confidence_scale")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.confidence_scale) {
          setScale(data.confidence_scale);
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
        .from("motivation_confidence_scale")
        .insert({
          user_id: user.id,
          confidence_scale: scale
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

  const handleScaleChange = (index: number, field: keyof ConfidenceScaleEntry, value: string) => {
    setScale(prevScale => 
      prevScale.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Creating a Confidence Scale</h2>
              <p className="text-gray-600 mb-6">
                Just as creating an importance scale helped you pinpoint the importance of your goal, creating a confidence scale will help you understand how much confidence you feel in your ability to take action toward your goal.
              </p>
              <p className="text-gray-600 mb-6">
                Using the words from the previous step, create definitions and descriptors for each number on the scale below.
                A score of 10 might be defined as determined, whereas a score of 1 might be defined as undecided.
              </p>
            </div>

            <div className="space-y-4">
              {scale.map((entry, index) => (
                <div key={entry.number} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full text-purple-800 font-semibold">
                    {entry.number}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Descriptor (e.g., determined)"
                      value={entry.descriptor}
                      onChange={(e) => handleScaleChange(index, "descriptor", e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Definition"
                      value={entry.definition}
                      onChange={(e) => handleScaleChange(index, "definition", e.target.value)}
                      required
                      rows={2}
                    />
                  </div>
                </div>
              ))}
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

export default CreatingConfidenceScale;
