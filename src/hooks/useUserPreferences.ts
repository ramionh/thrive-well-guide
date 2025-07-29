import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface UserPreferences {
  id: string;
  user_id: string;
  hide_habits_splash: boolean;
  hide_motivation_splash: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', error);
        throw error;
      }

      // If no preferences exist, create them
      if (!data) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            hide_habits_splash: false,
            hide_motivation_splash: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user preferences:', insertError);
          throw insertError;
        }

        return newPrefs as UserPreferences;
      }

      return data as UserPreferences;
    },
    enabled: !!user
  });

  const updatePreference = useMutation({
    mutationFn: async (updates: Partial<Pick<UserPreferences, 'hide_habits_splash' | 'hide_motivation_splash'>>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  });

  return {
    preferences,
    isLoading,
    updatePreference: updatePreference.mutate,
    isUpdating: updatePreference.isPending
  };
};