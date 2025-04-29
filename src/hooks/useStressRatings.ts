import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

export interface StressRating {
  stressor: string;
  rating: number | null;
  explanation: string;
}

interface UseStressRatingsOptions {
  onComplete?: () => void;
}

export const useStressRatings = ({ onComplete }: UseStressRatingsOptions = {}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [stressRatings, setStressRatings] = useState<StressRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First, get previously saved stress ratings if they exist
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("motivation_stress_ratings")
          .select("stress_ratings")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (ratingsError) throw ratingsError;
        
        // If we found existing ratings, use them
        if (ratingsData && ratingsData.stress_ratings) {
          // First cast to unknown, then to our expected type
          const existingRatings = ratingsData.stress_ratings as unknown as StressRating[];
          setStressRatings(existingRatings);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, get the stressors from the previous step
        const { data: stressTypesData, error: stressTypesError } = await supabase
          .from("motivation_stress_types")
          .select("stress_types")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (stressTypesError) throw stressTypesError;
        
        if (stressTypesData && stressTypesData.stress_types) {
          // Convert stress types to stress ratings with empty ratings and explanations
          const types = stressTypesData.stress_types as unknown as Array<{ stressor: string; type: string }>;
          const newRatings: StressRating[] = types.map(item => ({
            stressor: item.stressor,
            rating: null,
            explanation: ""
          }));
          
          setStressRatings(newRatings);
        } else {
          // Create default stressors if none were found from previous steps
          const defaultStressors = [
            { stressor: "Work demands", rating: null, explanation: "" },
            { stressor: "Family responsibilities", rating: null, explanation: "" },
            { stressor: "Financial concerns", rating: null, explanation: "" },
            { stressor: "Health issues", rating: null, explanation: "" },
            { stressor: "Time management", rating: null, explanation: "" },
          ];
          
          setStressRatings(defaultStressors);
        }
      } catch (error) {
        console.error("Error fetching stress data:", error);
        toast({
          title: "Error",
          description: "Failed to load your stressors",
          variant: "destructive",
        });
        
        // Even on error, provide default stressors
        const defaultStressors = [
          { stressor: "Work demands", rating: null, explanation: "" },
          { stressor: "Family responsibilities", rating: null, explanation: "" },
          { stressor: "Financial concerns", rating: null, explanation: "" },
          { stressor: "Health issues", rating: null, explanation: "" },
          { stressor: "Time management", rating: null, explanation: "" },
        ];
        
        setStressRatings(defaultStressors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const handleRatingChange = (index: number, rating: number) => {
    const newRatings = [...stressRatings];
    newRatings[index] = {
      ...newRatings[index],
      rating
    };
    setStressRatings(newRatings);
  };

  const handleExplanationChange = (index: number, explanation: string) => {
    const newRatings = [...stressRatings];
    newRatings[index] = {
      ...newRatings[index],
      explanation
    };
    setStressRatings(newRatings);
  };

  const isFormValid = () => {
    return stressRatings.every(rating => 
      rating.rating !== null && 
      rating.rating >= 1 && 
      rating.rating <= 5 &&
      rating.explanation.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!isFormValid()) {
      toast({
        title: "Incomplete form",
        description: "Please provide a rating (1-5) and explanation for each stressor",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_stress_ratings")
        .insert({
          user_id: user.id,
          // Cast our StressRating[] to a type that Supabase accepts
          stress_ratings: stressRatings as unknown as any
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your stress ratings have been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving stress ratings:", error);
      toast({
        title: "Error",
        description: "Failed to save your stress ratings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    stressRatings,
    isLoading,
    isSubmitting,
    handleRatingChange,
    handleExplanationChange,
    handleSubmit,
  };
};
