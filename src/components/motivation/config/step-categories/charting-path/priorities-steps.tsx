
import React from 'react';
import PrioritizingChange from "@/components/motivation/PrioritizingChange";
import type { StepConfig } from "@/components/motivation/types/motivation";

export const prioritiesSteps: StepConfig[] = [
  {
    id: 61,
    title: "Prioritizing Change",
    description: "Identify your priority activities",
    component: (onComplete) => <PrioritizingChange onComplete={onComplete} />
  }
];
