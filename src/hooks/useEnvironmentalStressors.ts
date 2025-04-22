
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

type StressorEntry = {
  stressor: string;
};

export const useEnvironmentalStressors = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<StressorEntry[]>(Array(5).fill({ stressor: '' }));

  const saveEnvironmentalStressorsMutation = useMutation({
    mutationFn: async (stressorEntries: StressorEntry[]) => {
      if (!user) return;

      // Delete existing entries first
      await supabase
        .from('motivation_environmental_stressors')
        .delete()
        .eq('user_id', user.id);

      // Insert new non-empty entries
      const { error } = await supabase
        .from('motivation_environmental_stressors')
        .insert(
          stressorEntries
            .filter(entry => entry.stressor.trim() !== '')
            .map(entry => ({
              user_id: user.id,
              stressor: entry.stressor
            }))
        );

      if (error) throw error;

      // Mark step 9 as completed in motivation steps progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 9,
            step_name: 'Environmental Stressors',
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
        description: "Your environmental stressors have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving environmental stressors:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleEntryChange = (index: number, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { stressor: value };
    setEntries(updatedEntries);
  };

  return {
    entries,
    handleEntryChange,
    saveEnvironmentalStressorsMutation
  };
};
