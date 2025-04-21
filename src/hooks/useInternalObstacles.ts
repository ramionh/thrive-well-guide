
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useInternalObstacles = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [excuses, setExcuses] = useState<string[]>(Array(5).fill(''));
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  const { data: savedExcuses } = useQuery({
    queryKey: ['internal-obstacles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('internal_obstacles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  useEffect(() => {
    if (savedExcuses && savedExcuses.length > 0) {
      const excusesList = savedExcuses.map(e => e.excuse);
      const filledExcuses = [...excusesList, ...Array(5 - excusesList.length).fill('')].slice(0, 5);
      setExcuses(filledExcuses);
    }
  }, [savedExcuses]);

  const saveExcuseMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      await supabase
        .from('internal_obstacles')
        .delete()
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('internal_obstacles')
        .insert(
          excuses
            .filter(excuse => excuse.trim() !== '')
            .map(excuse => ({
              user_id: user.id,
              excuse
            }))
        );

      if (error) throw error;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 3,
            step_name: 'Internal Obstacles',
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
        description: "Your internal obstacles have been recorded"
      });
      setIsStepCompleted(true);
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleExcuseChange = (index: number, value: string) => {
    const newExcuses = [...excuses];
    newExcuses[index] = value;
    setExcuses(newExcuses);
  };

  return {
    excuses,
    isStepCompleted,
    handleExcuseChange,
    saveExcuseMutation
  };
};
