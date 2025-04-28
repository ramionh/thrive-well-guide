
import React from 'react';
import PrioritizingChange from "../../../PrioritizingChange";
import type { StepConfig } from "../../../types/motivation";

export const prioritizingChangeSteps: StepConfig[] = [
  {
    id: 61,
    title: "Prioritizing the Change",
    description: "Making your fitness goals a priority",
    component: (onComplete) => <PrioritizingChange onComplete={onComplete} />
  }
];
