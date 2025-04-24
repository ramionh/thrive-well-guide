
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Define proper types for our value descriptions
interface ValueDescription {
  value: string;
  description: string;
}

export const useExploringValues = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [valueDescriptions, setValueDescriptions] = useState<{
    [key: string]: string
  }>({});
  
  // Add a query to fetch existing values - always get the most recent entry
  const { data, isLoading } = useQuery({
    queryKey: ['exploring-values', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('motivation_exploring_values')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Get the most recent entry first
        .limit(1) // Only get one record
        .maybeSingle(); // Use maybeSingle to prevent errors if no record exists
      
      if (error) {
        console.error("Error fetching exploring values:", error);
        return null;
      }
      
      console.log("Raw exploring values data:", data);
      
      if (data) {
        try {
          // Handle selected values
          if (data.selected_values) {
            let parsedSelectedValues: string[] = [];
            
            // Handle different types of selected_values data
            if (Array.isArray(data.selected_values)) {
              parsedSelectedValues = data.selected_values.map(String);
            } else if (typeof data.selected_values === 'string') {
              try {
                parsedSelectedValues = JSON.parse(data.selected_values);
              } catch (e) {
                console.error("Failed to parse selected_values as JSON string:", e);
              }
            }
            
            console.log("Parsed selected values:", parsedSelectedValues);
            setSelectedValues(parsedSelectedValues);
          }
          
          // Handle value descriptions
          if (data.value_descriptions) {
            let parsedDescriptions: { [key: string]: string } = {};
            
            // If it's an array of {value, description} objects
            if (Array.isArray(data.value_descriptions)) {
              data.value_descriptions.forEach((item: any) => {
                if (item && typeof item === 'object' && 'value' in item && 'description' in item) {
                  parsedDescriptions[item.value] = String(item.description);
                }
              });
            } 
            // If it's an object with value keys
            else if (typeof data.value_descriptions === 'object' && data.value_descriptions !== null) {
              // Cast to any to handle the unknown structure
              const descriptionsObj = data.value_descriptions as any;
              
              // Try to extract values from the object
              Object.keys(descriptionsObj).forEach(key => {
                const value = descriptionsObj[key];
                if (value && typeof value === 'object' && 'value' in value && 'description' in value) {
                  parsedDescriptions[value.value] = String(value.description);
                } else if (typeof key === 'string' && typeof value === 'string') {
                  parsedDescriptions[key] = value;
                }
              });
            }
            
            console.log("Parsed value descriptions:", parsedDescriptions);
            setValueDescriptions(parsedDescriptions);
          }
        } catch (e) {
          console.error("Error parsing exploring values data:", e);
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
