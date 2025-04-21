
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

export const useCurrentGoal = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ['current-goal', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          current_body_type:body_types!current_body_type_id(id, name),
          goal_body_type:body_types!goal_body_type_id(id, name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching goal:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
};
