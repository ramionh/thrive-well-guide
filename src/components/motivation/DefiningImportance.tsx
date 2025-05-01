
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";

const IMPORTANCE_DESCRIPTORS = [
  "GREAT", "VALUE", "VITAL", "URGENT", "CRUCIAL", "SERIOUS",
  "ESSENTIAL", "NECESSARY", "BENEFICIAL", "DESIRABLE", "CENTRAL",
  "MEANINGFUL", "PREFERABLE", "ACCEPTABLE", "SECONDARY", "TRIVIAL",
  "CONSEQUENTIAL", "TOLERABLE", "NEEDED", "SORT OF", "MODERATELY",
  "SO-SO", "FAIRLY", "INSIGNIFICANT", "IRRELEVANT"
];

interface DefiningImportanceProps {
  onComplete?: () => void;
}

const DefiningImportance: React.FC<DefiningImportanceProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { data: goalData, isLoading: goalLoading } = useCurrentGoal();

  const [selectedDescriptors, setSelectedDescriptors] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [goalText, setGoalText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch only the latest saved row (ordered by updated_at DESC, limit 1)
  useEffect(() => {
    if (!user) return;

    const fetchSaved = async () => {
      try {
        const { data, error } = await supabase
          .from("motivation_defining_importance")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false }) // newest first
          .limit(1);

        if (error) throw error;

        // Supabase may still wrap in an array...
        const record = Array.isArray(data) ? data[0] : data;
        if (!record) return;

        // -- descriptors come back as an array if your column is JSONB
        //    or as a JSON‐encoded string if it's text
        let parsed: string[] = [];
        if (Array.isArray(record.descriptors)) {
          parsed = record.descriptors;
        } else if (typeof record.descriptors === "string") {
          try {
            parsed = JSON.parse(record.descriptors);
          } catch {
            console.warn("Could not parse descriptors JSON:", record.descriptors);
          }
        }
        setSelectedDescriptors(parsed);

        if (record.reflection) {
          setReflection(record.reflection);
        }
        if (record.goal_text) {
          setGoalText(record.goal_text);
        }
      } catch (err) {
        console.error("Error fetching defining‐importance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();
  }, [user]);

  // Initialize goal text if we haven't loaded from the DB
  useEffect(() => {
    if (!goalText && goalData) {
      setGoalText(
        `Transform from ${goalData.current_body_type.name} to ${goalData.goal_body_type.name}`
      );
    }
  }, [goalData, goalText]);

  if (isLoading || goalLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 rounded-full border-t-transparent"/>
      </div>
    );
  }

  if (!goalText) {
    return (
      <div className="text-center p-8">
        <p className="text-purple-600">Please set up your fitness goal first.</p>
      </div>
    );
  }

  const handleDescriptorToggle = (values: string[]) => {
    if (values.length <= 5) {
      setSelectedDescriptors(values);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (selectedDescriptors.length !== 5 || !reflection.trim()) {
      toast({
        title: "Missing information",
        description: "Select exactly 5 descriptors and enter your reflection.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Upsert will insert or update existing row by user_id
      const { error } = await supabase
        .from("motivation_defining_importance")
        .upsert(
          {
            user_id: user.id,
            goal_text: goalText,
            descriptors: selectedDescriptors,
            reflection,
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      toast({ title: "Saved", description: "Your responses have been stored." });
      onComplete?.();
    } catch (err) {
      console.error("Error saving importance:", err);
      toast({
        title: "Error",
        description: "Could not save your responses.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-600">
            When you're considering making a change, one of the biggest questions to ask yourself is,
            "How important is this change?"…
          </p>

          <div>
            <label className="text-sm font-medium text-gray-700">Your transformation goal</label>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-700">
              {goalText}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Circle five words or phrases that best represent how important your goal is
              <span className="text-gray-500 ml-2">({selectedDescriptors.length}/5)</span>
            </label>
            <ToggleGroup
              type="multiple"
              value={selectedDescriptors}
              onValueChange={handleDescriptorToggle}
              className="flex flex-wrap gap-2"
            >
              {IMPORTANCE_DESCRIPTORS.map((d) => (
                <ToggleGroupItem
                  key={d}
                  value={d}
                  aria-label={d}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedDescriptors.includes(d)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {d}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <label htmlFor="reflection" className="text-sm font-medium text-gray-700">
              What did you learn? How important is your goal?
            </label>
            <Textarea
              id="reflection"
              rows={4}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full border-purple-200 focus:border-purple-400"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Saving…" : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DefiningImportance;
