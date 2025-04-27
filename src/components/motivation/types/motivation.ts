
import { ReactNode } from "react";

export interface Step {
  id: number;
  title: string;
  description: string;
  component: ReactNode;
  completed: boolean;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  component: (onComplete: () => void) => ReactNode;
}
