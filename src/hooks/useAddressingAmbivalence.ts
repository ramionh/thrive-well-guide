
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useAddressingAmbivalence = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [positiveExperiences, setPositiveExperiences] = useState<string[]>([]);
  const [masteryPursuits, setMasteryPursuits] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);

  useEffect(() => {
    const fetchSavedResponses = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('motivation_addressing_ambivalence')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching addressing ambivalence data:', error);
        return;
      }
      
      if (data) {
        console.log('Retrieved addressing ambivalence data:', data);
        
        // Ensure we're handling arrays correctly
        setPositiveExperiences(Array.isArray(data.positive_experiences) ? 
          data.positive_experiences.filter(Boolean) : 
          []);
          
        setMasteryPursuits(Array.isArray(data.mastery_pursuits) ? 
          data.mastery_pursuits.filter(Boolean) : 
          []);
          
        setCopingStrategies(Array.isArray(data.coping_strategies) ? 
          data.coping_strategies.filter(Boolean) : 
          []);
      }
    };
    
    fetchSavedResponses();
  }, [user]);

  const saveAddressingAmbivalenceMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      console.log('Saving addressing ambivalence data:', {
        positive_experiences: positiveExperiences,
        mastery_pursuits: masteryPursuits,
        coping_strategies: copingStrategies
      });

      const { error: deleteError } = await supabase
        .from('motivation_addressing_ambivalence')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('motivation_addressing_ambivalence')
        .insert({
          user_id: user.id,
          positive_experiences: positiveExperiences.filter(Boolean),
          mastery_pursuits: masteryPursuits.filter(Boolean),
          coping_strategies: copingStrategies.filter(Boolean)
        });

      if (insertError) throw insertError;

      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 10,
            step_name: 'Addressing Ambivalence',
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
        description: "Your addressing ambivalence responses have been recorded"
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
    positiveExperiences,
    setPositiveExperiences,
    masteryPursuits,
    setMasteryPursuits,
    copingStrategies,
    setCopingStrategies,
    saveAddressingAmbivalenceMutation
  };
};
