import React, { createContext, useContext, useState, useEffect } from "react";

// Define the types for our app
export type Goal = {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category: "sleep" | "nutrition" | "exercise" | "other";
  createdAt: Date;
};

export type Vital = {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: Date;
  category: "sleep" | "nutrition" | "exercise" | "other";
};

export type User = {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  goals: Goal[];
  vitals: Vital[];
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (goalId: string, updatedValues: Partial<Goal>) => void;
  addVital: (vital: Omit<Vital, "id" | "date">) => void;
  updateVital: (vitalId: string, updatedValues: Partial<Vital>) => void;
  saveMotivationalResponse: (category: string, response: string) => void;
  motivationalResponses: Record<string, string>;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock initial user data with valid UUID
const initialUser: User = {
  id: "00000000-0000-0000-0000-000000000000", // Valid UUID format
  name: "",
  email: "",
  onboardingCompleted: false,
  goals: [],
  vitals: [],
};

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [motivationalResponses, setMotivationalResponses] = useState<Record<string, string>>({});

  // Simulate loading user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        // In a real app, this would be an API call
        const savedUser = localStorage.getItem("thrivewell_user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Ensure the user has a valid UUID format
          setUser({
            ...initialUser,
            id: crypto.randomUUID() // Generate a proper UUID
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Ensure the user has a valid UUID format
        setUser({
          ...initialUser,
          id: crypto.randomUUID() // Generate a proper UUID
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user data to localStorage whenever it changes
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
        id: crypto.randomUUID(), // Use proper UUID
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
        id: crypto.randomUUID(), // Use proper UUID
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

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
