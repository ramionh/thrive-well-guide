import React, { createContext, useState, useEffect } from "react";
import { User, UserContextType, Goal, Vital } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUser: User = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "",
  email: "",
  onboardingCompleted: false,
  goals: [],
  vitals: [],
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [motivationalResponses, setMotivationalResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("UserProvider - Loading user data");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("UserProvider - Session found, fetching profile data");
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          console.log("UserProvider - Profile loaded:", profileData);
          
          const { data: goalsData, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', session.user.id);

          if (goalsError) {
            console.error("Error fetching goals:", goalsError);
          }

          const transformedGoals: Goal[] = Array.isArray(goalsData) ? goalsData.map(goal => ({
            id: goal.id,
            userId: goal.user_id,
            goalBodyTypeId: goal.goal_body_type_id,
            currentBodyTypeId: goal.current_body_type_id,
            startedDate: new Date(goal.started_date),
            targetDate: new Date(goal.target_date),
            createdAt: new Date(goal.created_at || Date.now()),
            name: `Body Transformation Goal`,
            currentValue: 0,
            targetValue: 100,
            unit: "%",
            category: "other"
          })) : [];

          setUser({
            id: session.user.id,
            name: profileData.full_name || '',
            email: session.user.email || '',
            onboardingCompleted: profileData.onboarding_completed || false,
            goals: transformedGoals,
            vitals: [],
            avatar_url: profileData.avatar_url,
            gender: profileData.gender
          });
          
          console.log("UserProvider - User data set with onboarding status:", profileData.onboarding_completed);
        } else {
          console.log("UserProvider - No session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("UserProvider - Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const completeOnboarding = async (onboardingData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
  }) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
            email: onboardingData.email,
            date_of_birth: onboardingData.dateOfBirth,
            gender: onboardingData.gender,
            height_feet: onboardingData.heightFeet,
            height_inches: onboardingData.heightInches,
            weight_lbs: onboardingData.weightLbs,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;

        setUser({
          ...user,
          name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          email: onboardingData.email,
          onboardingCompleted: true,
          gender: onboardingData.gender
        });
      } catch (error) {
        console.error("Error completing onboarding:", error);
        throw error;
      }
    }
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    console.log("Goals are now assigned by the system, this operation is not supported");
  };

  const updateGoal = (goalId: string, updatedValues: Partial<Goal>) => {
    console.log("Goals are now managed by the system, this operation is not supported");
  };

  const addVital = (vital: Omit<Vital, "id" | "date">) => {
    if (user) {
      const newVital: Vital = {
        ...vital,
        id: crypto.randomUUID(),
        date: new Date(),
      };
      
      setUser({
        ...user,
        vitals: [...user.vitals, newVital],
      });
    }
  };

  const updateVital = (vitalId: string, updatedValues: Partial<Vital>) => {
    if (user) {
      const updatedVitals = user.vitals.map((vital) => 
        vital.id === vitalId ? { ...vital, ...updatedValues } : vital
      );
      
      setUser({
        ...user,
        vitals: updatedVitals,
      });
    }
  };

  const saveMotivationalResponse = (category: string, response: string) => {
    setMotivationalResponses(prev => ({
      ...prev,
      [category]: response
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        onboardingStep,
        setOnboardingStep,
        completeOnboarding,
        addGoal,
        updateGoal,
        addVital,
        updateVital,
        saveMotivationalResponse,
        motivationalResponses
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
