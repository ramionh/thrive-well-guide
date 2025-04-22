
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

type CulturalObstacleEntry = {
  obstacle: string;
};

export const useCulturalObstacles = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<CulturalObstacleEntry[]>(Array(5).fill({ obstacle: '' }));

  const saveCulturalObstaclesMutation = useMutation({
    mutationFn: async (obstacleEntries: CulturalObstacleEntry[]) => {
      if (!user) return;

      // Delete existing entries first
      await supabase
        .from('motivation_cultural_obstacles' as any)
        .delete()
        .eq('user_id', user.id);

      // Insert new non-empty entries
      const { error } = await supabase
        .from('motivation_cultural_obstacles' as any)
        .insert(
          obstacleEntries
            .filter(entry => entry.obstacle.trim() !== '')
            .map(entry => ({
              user_id: user.id,
              obstacle: entry.obstacle
            }))
        );

      if (error) throw error;

      // Mark step 8 as completed in motivation steps progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 8,
            step_name: 'Cultural Obstacles',
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
        description: "Your cultural obstacles have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving cultural obstacles:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleEntryChange = (index: number, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { obstacle: value };
    setEntries(updatedEntries);
  };

  return {
    entries,
    handleEntryChange,
    saveCulturalObstaclesMutation
  };
};
