
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface ExceptionFormData {
  behavior: string;
  who: string;
  when_context: string;
  where_what: string;
  thoughts_feelings: string;
}

export const useExceptionsToRule = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExceptionFormData>({
    behavior: '',
    who: '',
    when_context: '',
    where_what: '',
    thoughts_feelings: ''
  });

  // Fetch internal obstacles
  const { data: internalObstacles } = useQuery({
    queryKey: ['internal-obstacles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('internal_obstacles')
        .select('excuse')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Fetch external obstacles
  const { data: externalObstacles } = useQuery({
    queryKey: ['external-obstacles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('motivation_external_obstacles')
        .select('obstacle')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const saveExceptionMutation = useMutation({
    mutationFn: async (data: ExceptionFormData) => {
      if (!user) return;

      const { error: insertError } = await supabase
        .from('motivation_exceptions_to_rule')
        .insert({
          user_id: user.id,
          ...data
        });

      if (insertError) throw insertError;

      // Update progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 16,
            step_name: 'Exceptions to the Rule',
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
        description: "Your exceptions to the rule have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving exceptions to rule:', error);
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
    internalObstacles,
    externalObstacles,
    saveExceptionMutation
  };
};
