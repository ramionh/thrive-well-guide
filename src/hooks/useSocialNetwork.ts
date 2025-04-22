
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

type SocialNetworkEntry = {
  person: string;
  rating: number;
};

export const useSocialNetwork = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SocialNetworkEntry[]>(Array(6).fill({ person: '', rating: 0 }));

  const saveSocialNetworkMutation = useMutation({
    mutationFn: async (networkEntries: SocialNetworkEntry[]) => {
      if (!user) return;

      // Delete existing entries first using type assertion to bypass TypeScript error
      await supabase
        .from('motivation_social_network' as any)
        .delete()
        .eq('user_id', user.id);

      // Insert new entries using type assertion to bypass TypeScript error
      const { error } = await supabase
        .from('motivation_social_network' as any)
        .insert(
          networkEntries
            .filter(entry => entry.person.trim() !== '')
            .map(entry => ({
              user_id: user.id,
              person_or_group: entry.person,
              support_rating: entry.rating
            }))
        );

      if (error) throw error;

      // Mark step 7 as completed in motivation steps progress
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 7,
            step_name: 'Social Network',
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
        description: "Your social network has been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving social network:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleEntryChange = (index: number, field: 'person' | 'rating', value: string | number) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    setEntries(updatedEntries);
  };

  return {
    entries,
    handleEntryChange,
    saveSocialNetworkMutation
  };
};
