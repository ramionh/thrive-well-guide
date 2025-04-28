
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface DefiningConfidenceProps {
  onComplete?: () => void;
}

const DefiningConfidence: React.FC<DefiningConfidenceProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const confidenceWords = [
    "DETERMINED", "ASSURED", "DOUBTFUL", "FEARFUL", "RESOLVED",
    "CERTAIN", "HESITANT", "BENEFICIAL", "POSITIVE", "DRIVEN",
    "APPREHENSIVE", "STRONG-WILLED", "DECIDED", "SECONDARY", "TRIVIAL",
    "CONSEQUENTIAL", "UNDECIDED", "ENCOURAGED", "HOPEFUL", "INTENT",
    "UNQUESTIONABLE", "SO-SO", "INESCAPABLE", "SINGLE-MINDED", "HOPELESS"
  ];

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_defining_confidence")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setSelectedWords(data.selected_words || []);
          setReflection(data.reflection || "");
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

  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else {
        // Limit to 5 selections
        if (prev.length >= 5) {
          return prev;
        }
        return [...prev, word];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (selectedWords.length !== 5) {
      toast({
        title: "Selection required",
        description: "Please select exactly 5 words that describe your confidence.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_defining_confidence")
        .insert({
          user_id: user.id,
          selected_words: selectedWords,
          reflection: reflection
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

  // Create rows of 5 words each
  const wordRows = [];
  for (let i = 0; i < confidenceWords.length; i += 5) {
    wordRows.push(confidenceWords.slice(i, i + 5));
  }

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
                Another question you may ask yourself while making a change is "Can I really be successful at changing this behavior?" This speaks to your confidence in your ability to change. Research has shown that people with a high level of confidence in their ability to be successful are more likely to take on the challenge of adopting a new behavior. The word confidence can also be defined in many ways. Our next step is figuring out exactly what it means to you.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="block mb-2 font-medium text-purple-800">
                  Below is a list of words that might describe your confidence level. Select five words or phrases that best represent how confident you are that you can take action toward your goal.
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Selected: {selectedWords.length}/5
                </p>

                <div className="space-y-2">
                  {wordRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-wrap gap-2">
                      {row.map((word) => (
                        <button
                          key={word}
                          type="button"
                          onClick={() => toggleWord(word)}
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            selectedWords.includes(word)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="reflection" className="block mb-2 font-medium text-purple-800">
                  What did you learn? How confident are you that you could take action toward your goal?
                </label>
                <Textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={4}
                  placeholder="Write your reflection here..."
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

export default DefiningConfidence;
