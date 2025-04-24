
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
        // Parse the selected values from JSON if needed
        if (data.selected_values) {
          // Handle whether it's already an array or needs to be parsed
          const parsedValues = Array.isArray(data.selected_values) 
            ? data.selected_values 
            : JSON.parse(typeof data.selected_values === 'string' 
                ? data.selected_values 
                : JSON.stringify(data.selected_values));
          
          setSelectedValues(parsedValues);
        }
        
        // Parse the value descriptions from JSON if needed
        if (data.value_descriptions) {
          // Handle different possible formats of the data
          try {
            let descriptionsObj: { [key: string]: string } = {};
            
            // Check if value_descriptions is an array of {value, description} objects
            if (Array.isArray(data.value_descriptions)) {
              data.value_descriptions.forEach((item: { value: string; description: string }) => {
                descriptionsObj[item.value] = String(item.description);
              });
            } 
            // Check if it's already an object with value keys
            else if (typeof data.value_descriptions === 'object' && data.value_descriptions !== null) {
              // If it's in {value: description} format
              if (Object.keys(data.value_descriptions).some(key => key.startsWith('value'))) {
                // Convert from {"value":"VALUE","description":"DESC"} format
                Object.keys(data.value_descriptions).forEach(key => {
                  const value = data.value_descriptions[key];
                  if (value && typeof value === 'object' && 'value' in value && 'description' in value) {
                    descriptionsObj[value.value] = String(value.description);
                  }
                });
              } else {
                // It's already in the format we want: {VALUE: "description"}
                // But we need to ensure all values are strings
                Object.keys(data.value_descriptions).forEach(key => {
                  const description = data.value_descriptions[key];
                  descriptionsObj[key] = String(description);
                });
              }
            }
            
            setValueDescriptions(descriptionsObj);
          } catch (e) {
            console.error('Error parsing value descriptions:', e);
          }
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
