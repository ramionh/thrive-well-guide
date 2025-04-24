
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export interface ExternalObstaclesState {
  obstacle: string;
  solutions: string[];
  solution1?: string;
  solution1Attitude?: string;
  solution2?: string;
  solution2Attitude?: string;
}

export const useExternalObstacles = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [obstacle, setObstacle] = useState('');
  const [solutions, setSolutions] = useState<string[]>(['', '']);
  const [solution1, setSolution1] = useState('');
  const [solution1Attitude, setSolution1Attitude] = useState('');
  const [solution2, setSolution2] = useState('');
  const [solution2Attitude, setSolution2Attitude] = useState('');

  useEffect(() => {
    const fetchSavedObstacles = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('motivation_external_obstacles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching external obstacles:', error);
        return;
      }
      
      if (data) {
        setObstacle(data.obstacle || '');
        setSolutions(data.solutions || ['', '']);
        setSolution1(data.solution_1 || '');
        setSolution1Attitude(data.solution_1_attitude || '');
        setSolution2(data.solution_2 || '');
        setSolution2Attitude(data.solution_2_attitude || '');
      }
    };
    
    fetchSavedObstacles();
  }, [user]);

  const saveExternalObstaclesMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error: deleteError } = await supabase
        .from('motivation_external_obstacles')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('motivation_external_obstacles')
        .insert({
          user_id: user.id,
          obstacle,
          solutions,
          solution_1: solution1,
          solution_1_attitude: solution1Attitude,
          solution_2: solution2,
          solution_2_attitude: solution2Attitude
        });

      if (insertError) throw insertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 12,
            step_name: 'External Obstacles',
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
        description: "Your external obstacles have been recorded"
      });
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

  return {
    obstacle,
    setObstacle,
    solutions,
    setSolutions,
    solution1,
    setSolution1,
    solution1Attitude,
    setSolution1Attitude,
    solution2,
    setSolution2,
    solution2Attitude,
    setSolution2Attitude,
    saveExternalObstaclesMutation
  };
};
