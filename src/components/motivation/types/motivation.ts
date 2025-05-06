
import { ReactNode } from "react";

export interface Step {
  id: number;
  title: string;
  description: string;
  component: ReactNode;
  completed: boolean;
  hideFromNavigation?: boolean;
  available?: boolean;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  component: (onComplete: () => void) => ReactNode;
  hideFromNavigation?: boolean;
  defaultCompleted?: boolean;
  available?: boolean;  // Added this property to match our usage
}
