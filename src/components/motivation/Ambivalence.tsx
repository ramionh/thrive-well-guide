
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import ProConList from './ProConList';
import AmbivalenceCarousel from './ambivalence/AmbivalenceCarousel';

interface AmbivalenceProps {
  onComplete?: () => void;
}

const Ambivalence = ({ onComplete }: AmbivalenceProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const markStepCompleted = useMutation({
    mutationFn: async () => {
      if (!user) return;

      // Use upsert with onConflict to properly handle existing records
      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 1,
          step_name: 'Ambivalence',
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Step completed",
        description: "Your progress has been saved",
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving step progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-8">
      <AmbivalenceCarousel />
      <ProConList onComplete={() => markStepCompleted.mutate()} />
    </div>
  );
};

export default Ambivalence;
