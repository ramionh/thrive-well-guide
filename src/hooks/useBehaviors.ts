
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useBehaviors = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [behaviors, setBehaviors] = useState<string[]>([]);

  useEffect(() => {
    const fetchBehaviors = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('motivation_behaviors')
        .select('behavior')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching behaviors:', error);
        return;
      }

      if (data) {
        setBehaviors(data.map(b => b.behavior));
      }
    };

    fetchBehaviors();
  }, [user]);

  const saveBehaviorsMutation = useMutation({
    mutationFn: async (behaviors: string[]) => {
      if (!user) return;

      // Delete existing behaviors first
      await supabase
        .from('motivation_behaviors')
        .delete()
        .eq('user_id', user.id);

      // Insert new behaviors
      const { error } = await supabase
        .from('motivation_behaviors')
        .insert(
          behaviors
            .filter(behavior => behavior.trim() !== '')
            .map(behavior => ({
              user_id: user.id,
              behavior
            }))
        );

      if (error) throw error;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 5,
            step_name: 'Behaviors',
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,step_number' }
        );

      if (progressError) throw progressError;
    },
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your behaviors have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving behaviors:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  return {
    behaviors,
    setBehaviors,
    saveBehaviorsMutation
  };
};
