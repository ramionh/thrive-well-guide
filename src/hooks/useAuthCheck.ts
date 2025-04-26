
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Dashboard - Checking authentication");
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        console.log("Dashboard - No session found, redirecting to auth");
        navigate('/auth');
        return;
      }
      
      if (!isLoading && !user) {
        console.log("Dashboard - Session exists but no user in context, waiting...");
        // Wait for user to load
      }
      
      if (user && !user.onboardingCompleted) {
        console.log("Dashboard - User has not completed onboarding, redirecting");
        navigate('/onboarding');
      }
    };
    
    checkAuth();
  }, [user, isLoading, navigate]);

  return { user, isLoading };
};
