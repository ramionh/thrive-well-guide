
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface PastSuccessFormData {
  big_change: string;
  life_context: string;
  change_approach: string;
  change_steps: string;
  current_feelings: string;
  help_achieve_goals: string;
}

export const usePastSuccess = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PastSuccessFormData>({
    big_change: '',
    life_context: '',
    change_approach: '',
    change_steps: '',
    current_feelings: '',
    help_achieve_goals: ''
  });

  // Fetch previous past success entry
  const { data: savedPastSuccess } = useQuery({
    queryKey: ['past-success', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_past_success')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Update form when saved data is loaded
  useEffect(() => {
    if (savedPastSuccess) {
      setFormData({
        big_change: savedPastSuccess.big_change || '',
        life_context: savedPastSuccess.life_context || '',
        change_approach: savedPastSuccess.change_approach || '',
        change_steps: savedPastSuccess.change_steps || '',
        current_feelings: savedPastSuccess.current_feelings || '',
        help_achieve_goals: savedPastSuccess.help_achieve_goals || ''
      });
    }
  }, [savedPastSuccess]);

  const savePastSuccessMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error: insertError } = await supabase
        .from('motivation_past_success')
        .insert({
          user_id: user.id,
          ...formData
        });

      if (insertError) throw insertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 17,
            step_name: 'Past Success',
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
        description: "Your past success has been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving past success:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  return {
    formData,
    setFormData,
    savePastSuccessMutation
  };
};
