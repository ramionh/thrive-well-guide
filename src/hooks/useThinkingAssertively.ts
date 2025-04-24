
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export interface ThinkingAssertivelyState {
  thoughtChallenge: string;
  boundaryNeeds: string;
  boundaryRequest: string;
}

export const useThinkingAssertively = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [thoughtChallenge, setThoughtChallenge] = useState('');
  const [boundaryNeeds, setBoundaryNeeds] = useState('');
  const [boundaryRequest, setBoundaryRequest] = useState('');

  const saveThinkingAssertivelyMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error: deleteError } = await supabase
        .from('motivation_thinking_assertively')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('motivation_thinking_assertively')
        .insert({
          user_id: user.id,
          thought_challenge: thoughtChallenge,
          boundary_needs: boundaryNeeds,
          boundary_request: boundaryRequest
        });

      if (insertError) throw insertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 13,
            step_name: 'Thinking Assertively',
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
        description: "Your thinking assertively responses have been recorded"
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
    thoughtChallenge,
    setThoughtChallenge,
    boundaryNeeds,
    setBoundaryNeeds,
    boundaryRequest,
    setBoundaryRequest,
    saveThinkingAssertivelyMutation
  };
};
