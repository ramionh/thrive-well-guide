
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch additional profile data from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setUser(null);
          } else {
            setUser({
              id: session.user.id,
              name: profileData.full_name || '',
              email: session.user.email || '',
              onboardingCompleted: profileData.onboarding_completed || false,
              goals: [], // TODO: Implement goal fetching
              vitals: [], // TODO: Implement vitals fetching
              avatar_url: profileData.avatar_url
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const completeOnboarding = async (onboardingData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
  }) => {
    if (user) {
      try {
        // Update profiles table with onboarding information
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: `${onboardingData.firstName} ${onboardingData.lastName}`,
            email: onboardingData.email,
            date_of_birth: onboardingData.dateOfBirth,
            height_feet: onboardingData.heightFeet,
            height_inches: onboardingData.heightInches,
            weight_lbs: onboardingData.weightLbs,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;

        // Update local user state
        setUser({
          ...user,
          name: `${onboardingData.firstName} ${onboardingData.lastName}`,
          email: onboardingData.email,
          onboardingCompleted: true
        });
      } catch (error) {
        console.error("Error completing onboarding:", error);
        throw error;
      }
    }
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    if (user) {
      const newGoal: Goal = {
        ...goal,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      
      setUser({
        ...user,
        goals: [...user.goals, newGoal],
      });
    }
  };

  const updateGoal = (goalId: string, updatedValues: Partial<Goal>) => {
    if (user) {
      const updatedGoals = user.goals.map((goal) => 
        goal.id === goalId ? { ...goal, ...updatedValues } : goal
      );
      
      setUser({
        ...user,
        goals: updatedGoals,
      });
    }
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
