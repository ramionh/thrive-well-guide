
import React from 'react';
import PrioritizingChange from "@/components/motivation/PrioritizingChange";
import GettingReady from "@/components/motivation/GettingReady";
import MakingGoalMeasurable from "@/components/motivation/MakingGoalMeasurable";
import type { StepConfig } from "@/components/motivation/types/motivation";

export const prioritizingChangeSteps: StepConfig[] = [
  {
    id: 62,
    title: "Prioritizing Change",
    description: "Identify your priority activities",
    component: (onComplete) => <PrioritizingChange onComplete={onComplete} />
  },
  {
    id: 63,
    title: "Getting Ready",
    description: "Self-persuasion for change",
    component: (onComplete) => <GettingReady onComplete={onComplete} />
  },
  {
    id: 64,
    title: "Making Your Goal Measurable",
    description: "Define measurable success metrics",
    component: (onComplete) => <MakingGoalMeasurable onComplete={onComplete} />
  }
];
