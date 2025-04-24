
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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

  // Fetch existing entries when component loads
  const { data: existingEntries } = useQuery({
    queryKey: ['identifyingAmbivalence', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('motivation_identifying_ambivalence')
        .select('ambivalence_statement')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching ambivalence data:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user
  });

  // Set entries from database if they exist
  useEffect(() => {
    if (existingEntries && existingEntries.length > 0) {
      const formattedEntries = existingEntries.map(entry => ({
        ambivalence_statement: entry.ambivalence_statement
      }));
      
      // Fill the remaining slots with empty entries
      const filledEntries = [
        ...formattedEntries,
        ...Array(Math.max(0, 5 - formattedEntries.length)).fill({ ambivalence_statement: '' })
      ];
      
      setEntries(filledEntries.slice(0, 5));
    }
  }, [existingEntries]);

  const saveIdentifyingAmbivalenceMutation = useMutation({
    mutationFn: async (ambivalenceEntries: AmbivalenceEntry[]) => {
      if (!user) return;

      // Only include entries that have content
      const validEntries = ambivalenceEntries
        .filter(entry => entry.ambivalence_statement.trim() !== '')
        .map(entry => ({
          user_id: user.id,
          ambivalence_statement: entry.ambivalence_statement
        }));

      if (validEntries.length === 0) {
        throw new Error("Please add at least one ambivalence statement");
      }

      // Delete existing entries first
      await supabase
        .from('motivation_identifying_ambivalence')
        .delete()
        .eq('user_id', user.id);

      // Insert new non-empty entries
      const { error } = await supabase
        .from('motivation_identifying_ambivalence')
        .insert(validEntries);

      if (error) throw error;

      // Check if step already exists in progress
      const { data: existingProgress } = await supabase
        .from('motivation_steps_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('step_number', 10)
        .maybeSingle();

      // If step exists, update it; otherwise, insert it
      if (existingProgress) {
        const { error: updateError } = await supabase
          .from('motivation_steps_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingProgress.id);

        if (updateError) throw updateError;
      } else {
        // Insert new progress entry
        const { error: insertError } = await supabase
          .from('motivation_steps_progress')
          .insert({
            user_id: user.id,
            step_number: 10,
            step_name: 'Identifying Ambivalence',
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
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
        description: error instanceof Error ? error.message : "Failed to save your progress",
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
