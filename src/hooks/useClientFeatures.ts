import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

export const useClientFeatures = () => {
  const { user } = useUser();

  const { data: featureToggles, isLoading } = useQuery({
    queryKey: ['clientFeatures', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('client_feature_toggles')
        .select('feature_name, is_enabled')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const isFeatureEnabled = (featureName: string): boolean => {
    const toggle = featureToggles?.find(t => t.feature_name === featureName);
    return toggle?.is_enabled ?? true; // Default to enabled if not set
  };

  return {
    isFeatureEnabled,
    isLoading
  };
};