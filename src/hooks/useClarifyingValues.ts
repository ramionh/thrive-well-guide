
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useClarifyingValues = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');
  const [reasonsAlignment, setReasonsAlignment] = useState('');
  const [goalValueAlignment, setGoalValueAlignment] = useState('');

  // Fetch pros from the pros_cons table
  const { data: pros } = useQuery({
    queryKey: ['pros', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('motivation_pros_cons')
        .select('text')
        .eq('user_id', user.id)
        .eq('type', 'pro');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch exploring values
  const { data: exploringValues } = useQuery({
    queryKey: ['exploring-values', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_exploring_values')
        .select('selected_values')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.selected_values) {
        const parsedValues = Array.isArray(data.selected_values) 
          ? data.selected_values 
          : JSON.parse(typeof data.selected_values === 'string' 
              ? data.selected_values 
              : JSON.stringify(data.selected_values));
        
        // Ensure all values are strings
        return parsedValues.map(value => String(value));
      }
      
      return [];
    },
    enabled: !!user
  });

  // Fetch existing clarifying values
  const { data: existingValues } = useQuery({
    queryKey: ['clarifying-values', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_clarifying_values')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setSelectedValue1(String(data.selected_value_1 || ''));
        setSelectedValue2(String(data.selected_value_2 || ''));
        setReasonsAlignment(String(data.reasons_alignment || ''));
        setGoalValueAlignment(String(data.goal_value_alignment || ''));
      }
      
      return data;
    },
    enabled: !!user
  });

  const saveClarifyingValuesMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error: upsertError } = await supabase
        .from('motivation_clarifying_values')
        .upsert({
          user_id: user.id,
          selected_value_1: selectedValue1,
          selected_value_2: selectedValue2,
          reasons_alignment: reasonsAlignment,
          goal_value_alignment: goalValueAlignment
        });

      if (upsertError) throw upsertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 15,
            step_name: 'Clarifying Values',
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
        description: "Your clarifying values responses have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving clarifying values:', error);
      toast({
        title: "Error",
        description: "Failed to save your clarifying values",
        variant: "destructive"
      });
    }
  });

  return {
    selectedValue1,
    setSelectedValue1,
    selectedValue2,
    setSelectedValue2,
    reasonsAlignment,
    setReasonsAlignment,
    goalValueAlignment,
    setGoalValueAlignment,
    saveClarifyingValuesMutation,
    exploringValues,
    pros
  };
};
