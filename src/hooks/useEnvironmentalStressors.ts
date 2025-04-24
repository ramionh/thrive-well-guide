
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

type EnvironmentalStressorEntry = {
  stressor: string;
};

export const useEnvironmentalStressors = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<EnvironmentalStressorEntry[]>(Array(5).fill({ stressor: '' }));

  // Fetch existing entries when component loads
  const { data: existingEntries } = useQuery({
    queryKey: ['environmentalStressors', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('motivation_environmental_stressors')
        .select('stressor')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching environmental stressors data:', error);
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
        stressor: entry.stressor
      }));
      
      // Fill the remaining slots with empty entries
      const filledEntries = [
        ...formattedEntries,
        ...Array(Math.max(0, 5 - formattedEntries.length)).fill({ stressor: '' })
      ];
      
      setEntries(filledEntries.slice(0, 5));
    }
  }, [existingEntries]);

  const saveEnvironmentalStressorsMutation = useMutation({
    mutationFn: async (stressorEntries: EnvironmentalStressorEntry[]) => {
      if (!user) return;

      // Only include entries that have a stressor
      const validEntries = stressorEntries
        .filter(entry => entry.stressor.trim() !== '')
        .map(entry => ({
          user_id: user.id,
          stressor: entry.stressor
        }));

      if (validEntries.length === 0) {
        throw new Error("Please add at least one environmental stressor");
      }

      // Delete existing entries first
      await supabase
        .from('motivation_environmental_stressors')
        .delete()
        .eq('user_id', user.id);

      // Insert new non-empty entries
      const { error } = await supabase
        .from('motivation_environmental_stressors')
        .insert(validEntries);

      if (error) throw error;

      // Use upsert with explicit onConflict for step progress
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
        description: error instanceof Error ? error.message : "Failed to save your progress",
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
