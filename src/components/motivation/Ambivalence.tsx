
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AmbivalenceCarousel from "./ambivalence/AmbivalenceCarousel";
import ProConList from "./ProConList";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AmbivalenceProps {
  onComplete?: () => void;
}

const Ambivalence: React.FC<AmbivalenceProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkStepCompletion = async () => {
      const { data, error } = await supabase
        .from('motivation_steps_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('step_number', 1)
        .single();

      if (error) {
        console.error('Error checking step completion:', error);
        return;
      }

      setIsStepCompleted(data?.completed || false);
    };

    checkStepCompletion();
  }, [user]);

  const handleComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 1,
          step_name: 'Ambivalence',
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Step completed",
        description: "Moving on to the next step"
      });

      setIsStepCompleted(true);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error marking step as complete:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <AmbivalenceCarousel />
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Pros & Cons Exercise</h3>
        <ProConList />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleComplete}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isStepCompleted}
        >
          {isStepCompleted ? "Completed" : "Complete This Step"}
        </Button>
      </div>
    </div>
  );
};

export default Ambivalence;
