
import React, { createContext, useState, useEffect } from "react";
import { User, UserContextType, Goal, Vital } from "@/types/user";

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
        const savedUser = localStorage.getItem("thrivewell_user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser({
            ...initialUser,
            id: crypto.randomUUID()
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser({
          ...initialUser,
          id: crypto.randomUUID()
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("thrivewell_user", JSON.stringify(user));
    }
  }, [user]);

  const completeOnboarding = () => {
    if (user) {
      setUser({
        ...user,
        onboardingCompleted: true,
      });
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
