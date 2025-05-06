
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
  available?: boolean;  // This property is already here, which is good
  nextStepNumber?: number; // Add this property to support explicit next step navigation
  nextStepName?: string;   // Add this property to support naming the next step
  stepName?: string;       // Add this property for clarity
}
