
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

type AmbivalenceEntry = {
  ambivalence_statement: string;
};

export const useIdentifyingAmbivalence = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<AmbivalenceEntry[]>(Array(5).fill({ ambivalence_statement: '' }));

  const saveIdentifyingAmbivalenceMutation = useMutation({
    mutationFn: async (ambivalenceEntries: AmbivalenceEntry[]) => {
      if (!user) return;

      // Delete existing entries first
      await supabase
        .from('motivation_identifying_ambivalence')
        .delete()
        .eq('user_id', user.id);

      // Insert new non-empty entries
      const { error } = await supabase
        .from('motivation_identifying_ambivalence')
        .insert(
          ambivalenceEntries
            .filter(entry => entry.ambivalence_statement.trim() !== '')
            .map(entry => ({
              user_id: user.id,
              ambivalence_statement: entry.ambivalence_statement
            }))
        );

      if (error) throw error;

      // Mark step 10 as completed in motivation steps progress
      // Use upsert with onConflict to properly handle existing records
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 10,
            step_name: 'Identifying Ambivalence',
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
        description: "Your ambivalence statements have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving identifying ambivalence:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleEntryChange = (index: number, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ambivalence_statement: value };
    setEntries(updatedEntries);
  };

  return {
    entries,
    handleEntryChange,
    saveIdentifyingAmbivalenceMutation
  };
};
