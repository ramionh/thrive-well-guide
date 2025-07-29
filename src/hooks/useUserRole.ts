import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

export type UserRole = 'client' | 'coach' | 'admin' | null;

export const useUserRole = () => {
  const { user } = useUser();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('client'); // Default to client
        } else {
          setRole(data?.role || 'client');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('client');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole) => {
    if (!role || !requiredRole) return false;
    
    const roleHierarchy = { admin: 3, coach: 2, client: 1 };
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return {
    role,
    loading,
    hasRole,
    isAdmin: role === 'admin',
    isCoach: role === 'coach',
    isClient: role === 'client',
  };
};