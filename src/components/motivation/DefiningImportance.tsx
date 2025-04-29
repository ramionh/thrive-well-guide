
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
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
  "CONSEQUENTIAL", "TOLERABLE", "NEEDED", "DESIRABLE", "SORT OF",
  "MODERATELY", "SO-SO", "FAIRLY", "INSIGNIFICANT", "IRRELEVANT"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved values from the database
  useEffect(() => {
    const fetchSavedValues = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching defining importance data for user:', user.id);
        const { data, error } = await supabase
          .from('motivation_defining_importance')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching saved values:", error);
          throw error;
        }

        if (data) {
          console.log('Retrieved defining importance data:', data);
          // Ensure descriptors is treated as an array
          if (data.descriptors) {
            if (Array.isArray(data.descriptors)) {
              setSelectedDescriptors(data.descriptors);
            } else if (typeof data.descriptors === 'string') {
              try {
                setSelectedDescriptors(JSON.parse(data.descriptors));
              } catch (e) {
                console.error("Error parsing descriptors JSON:", e);
                setSelectedDescriptors([]);
              }
            }
          }
          setReflection(data.reflection || "");
        }
      } catch (error) {
        console.error("Error fetching saved values:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedValues();
  }, [user]);

  if (isLoading || goalLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!goalData) {
    return (
      <div className="text-center p-8">
        <p className="text-purple-600">Please set up your fitness goal first.</p>
      </div>
    );
  }

  const goalText = `Transform from ${goalData.current_body_type.name} to ${goalData.goal_body_type.name}`;

  const handleDescriptorToggle = (values: string[]) => {
    if (values.length <= 5) {
      setSelectedDescriptors(values);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!goalText || selectedDescriptors.length !== 5 || !reflection) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select exactly 5 descriptors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Saving defining importance data:', {
        user_id: user.id,
        goal_text: goalText,
        descriptors: selectedDescriptors,
        reflection: reflection
      });

      const { data: existingData } = await supabase
        .from('motivation_defining_importance')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('motivation_defining_importance')
          .update({
            descriptors: selectedDescriptors,
            reflection: reflection,
            goal_text: goalText,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('motivation_defining_importance')
          .insert({
            user_id: user.id,
            goal_text: goalText,
            descriptors: selectedDescriptors,
            reflection: reflection,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Your responses have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving defining importance data:", error);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600 mb-6">
              When you're considering making a change, one of the biggest questions to ask yourself is, "How important is this change?" While this may seem like a straightforward inquiry, it can be quite daunting to answer. Important can mean so many things. The first step is figuring out what the word means to you.
            </p>

            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium text-gray-700">
                Your transformation goal
              </label>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-700">
                {goalText}
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700 block mb-4">
                Circle five words or phrases that best represent how important your goal is
                <span className="text-sm text-gray-500 ml-2">
                  ({selectedDescriptors.length}/5 selected)
                </span>
              </label>
              <ToggleGroup
                type="multiple"
                value={selectedDescriptors}
                onValueChange={handleDescriptorToggle}
                className="flex flex-wrap gap-2"
              >
                {IMPORTANCE_DESCRIPTORS.map((descriptor) => (
                  <ToggleGroupItem
                    key={descriptor}
                    value={descriptor}
                    aria-label={descriptor}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedDescriptors.includes(descriptor)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {descriptor}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-2 mt-6">
              <label htmlFor="reflection" className="text-sm font-medium text-gray-700">
                What did you learn? How important is your goal?
              </label>
              <Textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={4}
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
      </CardContent>
    </Card>
  );
};

export default DefiningImportance;
