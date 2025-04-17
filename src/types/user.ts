
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
  avatar_url?: string;
  motivationalResponses?: Record<string, string>;
};

export type UserContextType = {
  user: User | null;
  isLoading: boolean;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: (onboardingData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
  }) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (goalId: string, updatedValues: Partial<Goal>) => void;
  addVital: (vital: Omit<Vital, "id" | "date">) => void;
  updateVital: (vitalId: string, updatedValues: Partial<Vital>) => void;
  saveMotivationalResponse: (category: string, response: string) => void;
  motivationalResponses: Record<string, string>;
};
