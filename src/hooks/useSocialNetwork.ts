
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
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

  // Fetch existing entries when component loads
  const { data: existingEntries } = useQuery({
    queryKey: ['socialNetwork', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('motivation_social_network')
        .select('person_or_group, support_rating')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching social network data:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user
  });

  // Set entries from database if they exist
  useEffect(() => {
    if (existingEntries && existingEntries.length > 0) {
      const formattedEntries = existingEntries.map(entry => ({
        person: entry.person_or_group,
        rating: entry.support_rating
      }));
      
      // Fill the remaining slots with empty entries
      const filledEntries = [
        ...formattedEntries,
        ...Array(Math.max(0, 6 - formattedEntries.length)).fill({ person: '', rating: 0 })
      ];
      
      setEntries(filledEntries.slice(0, 6));
    }
  }, [existingEntries]);

  const saveSocialNetworkMutation = useMutation({
    mutationFn: async (networkEntries: SocialNetworkEntry[]) => {
      if (!user) return;

      // Only include entries that have a person name
      const validEntries = networkEntries
        .filter(entry => entry.person.trim() !== '')
        .map(entry => ({
          user_id: user.id,
          person_or_group: entry.person,
          support_rating: entry.rating
        }));

      if (validEntries.length === 0) {
        throw new Error("Please add at least one person to your social network");
      }

      // Delete existing entries first
      await supabase
        .from('motivation_social_network')
        .delete()
        .eq('user_id', user.id);

      // Insert new entries
      const { error } = await supabase
        .from('motivation_social_network')
        .insert(validEntries);

      if (error) throw error;

      // Use upsert with explicit onConflict for step progress
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
        description: error instanceof Error ? error.message : "Failed to save your progress",
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
