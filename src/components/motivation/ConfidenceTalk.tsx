
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface ConfidenceTalkEntry {
  unhelpful: string;
  helpful: string;
}

interface ConfidenceTalkProps {
  onComplete?: () => void;
}

const ConfidenceTalk: React.FC<ConfidenceTalkProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [confidenceTalk, setConfidenceTalk] = useState<ConfidenceTalkEntry[]>([
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" },
    { unhelpful: "", helpful: "" }
  ]);

  // Example entries for UI display
  const examples: ConfidenceTalkEntry[] = [
    {
      unhelpful: "I can't handle the hunger when I try to eat less.",
      helpful: "I can learn strategies to better cope with hunger pangs."
    },
    {
      unhelpful: "I don't see how I can make time to go to the gym to exercise.",
      helpful: "I can find creative ways to exercise, even if it isn't at a gym."
    }
  ];

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_confidence_talk")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.confidence_talk) {
          let parsedTalk: ConfidenceTalkEntry[] = [];
          
          try {
            // Convert the retrieved JSON data to the expected type
            if (typeof data.confidence_talk === 'string') {
              parsedTalk = JSON.parse(data.confidence_talk) as ConfidenceTalkEntry[];
            } else {
              // Cast the Json[] to the correct type using type assertion
              const jsonArray = data.confidence_talk as unknown;
              if (Array.isArray(jsonArray)) {
                parsedTalk = (jsonArray as any[]).map(item => ({
                  unhelpful: item.unhelpful || "",
                  helpful: item.helpful || ""
                }));
              }
            }
          } catch (parseError) {
            console.error("Error parsing confidence talk:", parseError);
            parsedTalk = [];
          }
          
          // Ensure we have 5 entries
          if (parsedTalk.length < 5) {
            const additionalEntries = Array.from({ length: 5 - parsedTalk.length }, () => ({
              unhelpful: "",
              helpful: ""
            }));
            parsedTalk = [...parsedTalk, ...additionalEntries];
          }
          
          setConfidenceTalk(parsedTalk);
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

  const handleEntryChange = (index: number, field: keyof ConfidenceTalkEntry, value: string) => {
    setConfidenceTalk(prevTalk => 
      prevTalk.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_confidence_talk")
        .insert({
          user_id: user.id,
          confidence_talk: JSON.stringify(confidenceTalk)
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Building Confidence—Confidence Talk</h2>
              <p className="text-gray-600 mb-6">
                Remember when you listed some of your unhelpful thoughts and created positive self-talk 
                to counteract them? Let's do that again, focusing on unhelpful thoughts around 
                your confidence to make the change.
              </p>
            </div>

            <div className="border border-purple-100 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-purple-100 bg-purple-50">
                <div className="p-4 font-semibold text-purple-800 border-r border-purple-100">
                  UNHELPFUL (LACK OF CONFIDENCE) THOUGHTS
                </div>
                <div className="p-4 font-semibold text-purple-800">
                  (BUILDING HELPFUL CONFIDENCE) THOUGHTS
                </div>
              </div>

              {/* Example rows */}
              {examples.map((example, index) => (
                <div key={`example-${index}`} className="grid grid-cols-2 border-b border-purple-100 bg-gray-50">
                  <div className="p-4 border-r border-purple-100 italic text-gray-600">
                    {example.unhelpful}
                  </div>
                  <div className="p-4 italic text-gray-600">
                    {example.helpful}
                  </div>
                </div>
              ))}

              {/* User input rows */}
              {confidenceTalk.map((entry, index) => (
                <div key={index} className="grid grid-cols-2 border-b border-purple-100">
                  <div className="p-2 border-r border-purple-100">
                    <Textarea
                      placeholder="Enter an unhelpful thought"
                      value={entry.unhelpful}
                      onChange={(e) => handleEntryChange(index, "unhelpful", e.target.value)}
                      className="min-h-[80px] bg-white"
                    />
                  </div>
                  <div className="p-2">
                    <Textarea
                      placeholder="Enter a helpful confidence-building thought"
                      value={entry.helpful}
                      onChange={(e) => handleEntryChange(index, "helpful", e.target.value)}
                      className="min-h-[80px] bg-white"
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

export default ConfidenceTalk;
