
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface Rating {
  number: number;
  descriptor: string;
  definition: string;
}

interface ImportanceScaleProps {
  onComplete?: () => void;
}

const ImportanceScale: React.FC<ImportanceScaleProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>(
    Array.from({ length: 10 }, (_, i) => ({
      number: 10 - i,
      descriptor: "",
      definition: ""
    }))
  );

  useEffect(() => {
    const fetchSavedRatings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('motivation_importance_scale')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data && data.ratings) {
          // Parse the JSON data if it's stored as a string
          const parsedRatings = typeof data.ratings === 'string' 
            ? JSON.parse(data.ratings) 
            : data.ratings;
            
          // Ensure the parsed data matches our Rating[] structure
          if (Array.isArray(parsedRatings)) {
            setRatings(parsedRatings as Rating[]);
          }
        }
      } catch (error) {
        console.error("Error fetching saved ratings:", error);
      }
    };

    fetchSavedRatings();
  }, [user]);

  const handleDescriptorChange = (index: number, value: string) => {
    const newRatings = [...ratings];
    newRatings[index] = { ...newRatings[index], descriptor: value };
    setRatings(newRatings);
  };

  const handleDefinitionChange = (index: number, value: string) => {
    const newRatings = [...ratings];
    newRatings[index] = { ...newRatings[index], definition: value };
    setRatings(newRatings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { data: existingData } = await supabase
        .from('motivation_importance_scale')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Convert our ratings to a format compatible with Supabase's Json type
      const ratingsForDB = JSON.parse(JSON.stringify(ratings));

      if (existingData) {
        const { error } = await supabase
          .from('motivation_importance_scale')
          .update({ ratings: ratingsForDB })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('motivation_importance_scale')
          .insert({
            user_id: user.id,
            ratings: ratingsForDB
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Your importance scale has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving importance scale:", error);
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
          <div>
            <h2 className="text-xl font-semibold text-purple-800 mb-4">3.2 Importance Scale</h2>
            <p className="text-gray-600 mb-6">
              A 1-to-10 scale is useful for determining the importance of your goal. 
              Anchors give real meaning to each number. For example, Gina at Summit 
              Fitness rates her upcoming 5K training in two weeks as a 10 (urgent), 
              while a future focus on improving flexibility is a 1 (irrelevant).
            </p>
          </div>

          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div key={rating.number} className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-1">
                  <span className="font-bold text-purple-700">{rating.number}</span>
                </div>
                <div className="col-span-3">
                  <Input
                    value={rating.descriptor}
                    onChange={(e) => handleDescriptorChange(index, e.target.value)}
                    placeholder="e.g., urgent, trivial"
                    className="w-full"
                  />
                </div>
                <div className="col-span-8">
                  <Textarea
                    value={rating.definition}
                    onChange={(e) => handleDefinitionChange(index, e.target.value)}
                    placeholder="Define what this rating means to you..."
                    className="w-full"
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
            Complete Step
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImportanceScale;
