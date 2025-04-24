
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useExploringValues = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [valueDescriptions, setValueDescriptions] = useState<{
    [key: string]: string
  }>({});
  
  // Add a query to fetch existing values
  const { isLoading } = useQuery({
    queryKey: ['exploring-values', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_exploring_values')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        // Set the selected values
        setSelectedValues(data.selected_values as string[]);
        
        // Transform the value_descriptions array into the expected object format
        if (Array.isArray(data.value_descriptions)) {
          const descriptionsObj: { [key: string]: string } = {};
          data.value_descriptions.forEach((item: { value: string; description: string }) => {
            descriptionsObj[item.value] = item.description;
          });
          setValueDescriptions(descriptionsObj);
        }
      }
      
      return data;
    },
    enabled: !!user
  });

  const saveExploringValuesMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error: insertError } = await supabase
        .from('motivation_exploring_values')
        .upsert({
          user_id: user.id,
          selected_values: selectedValues,
          value_descriptions: Object.entries(valueDescriptions).map(
            ([value, description]) => ({ value, description })
          )
        });

      if (insertError) throw insertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 14,
            step_name: 'Exploring Values',
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
        description: "Your exploring values responses have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving exploring values:', error);
      toast({
        title: "Error",
        description: "Failed to save your exploring values",
        variant: "destructive"
      });
    }
  });

  return {
    selectedValues,
    setSelectedValues,
    valueDescriptions,
    setValueDescriptions,
    saveExploringValuesMutation,
    isLoading
  };
};
