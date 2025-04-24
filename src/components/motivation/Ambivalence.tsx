
import React from 'react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import ProConList from './ProConList';
import AmbivalenceCarousel from './ambivalence/AmbivalenceCarousel';
import { supabase } from '@/integrations/supabase/client';

interface AmbivalenceProps {
  onComplete?: () => void;
}

const Ambivalence = ({ onComplete }: AmbivalenceProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!user) return;

    try {
      // First check if a progress record already exists
      const { data: existingProgress } = await supabase
        .from('motivation_steps_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('step_number', 1)
        .maybeSingle();

      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('motivation_steps_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('step_number', 1);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('motivation_steps_progress')
          .insert({
            user_id: user.id,
            step_number: 1,
            step_name: 'Ambivalence',
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Step completed",
        description: "Your progress has been saved",
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving step progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <AmbivalenceCarousel />
      <ProConList onComplete={handleComplete} />
    </div>
  );
};

export default Ambivalence;
