
import React from 'react';
import PrioritizingChange from "../../../../PrioritizingChange";
import GettingReady from "../../../../GettingReady";
import MakingGoalMeasurable from "../../../../MakingGoalMeasurable";
import type { StepConfig } from "../../../../types/motivation";

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
