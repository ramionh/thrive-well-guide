
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
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('motivation_exploring_values')
        .select('selected_values')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching exploring values:", error);
        return [];
      }
      
      if (data?.selected_values) {
        try {
          const parsedValues = Array.isArray(data.selected_values) 
            ? data.selected_values 
            : JSON.parse(data.selected_values as string);
          return parsedValues.map(String);
        } catch (e) {
          console.error("Error parsing selected values:", e);
          return [];
        }
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
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Update form values when existing values are fetched
  useEffect(() => {
    if (existingValues) {
      setSelectedValue1(String(existingValues.selected_value_1 || ''));
      setSelectedValue2(String(existingValues.selected_value_2 || ''));
      setReasonsAlignment(String(existingValues.reasons_alignment || ''));
      setGoalValueAlignment(String(existingValues.goal_value_alignment || ''));
    }
  }, [existingValues]);

  const saveClarifyingValuesMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error: upsertError } = await supabase
        .from('motivation_clarifying_values')
        .insert({
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
