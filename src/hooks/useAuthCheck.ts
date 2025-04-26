import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Dashboard - Checking authentication");
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        console.log("Dashboard - No session found, redirecting to auth");
        navigate('/auth');
        setIsAuthChecking(false);
        return;
      }
      
      // If we have a session but the user context is still loading, wait for it
      if (isLoading) {
        console.log("Dashboard - Session exists but context still loading");
        return; // Keep isAuthChecking true, wait for user context to load
      }
      
      // If we have a session but no user in context (could happen if context failed to load)
      if (!user) {
        console.log("Dashboard - Session exists but no user in context");
        // We'll keep waiting for user context to load
        return;
      }
      
      console.log("Dashboard - Auth check complete, user found:", user.id);
      setIsAuthChecking(false);
    };
    
    checkAuth();
  }, [user, isLoading, navigate]);

  return { user, isLoading: isLoading || isAuthChecking };
};
