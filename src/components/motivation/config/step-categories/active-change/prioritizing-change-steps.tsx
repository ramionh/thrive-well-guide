
import React from 'react';
import GettingReady from "@/components/motivation/GettingReady";
import MakingGoalMeasurable from "@/components/motivation/MakingGoalMeasurable";
import DevelopingObjectives from "@/components/motivation/DevelopingObjectives";
import type { StepConfig } from "@/components/motivation/types/motivation";

export const prioritizingChangeSteps: StepConfig[] = [
  {
    id: 62,
    title: "Getting Ready",
    description: "Self-persuasion for change",
    component: (onComplete) => <GettingReady onComplete={onComplete} />
  },
  {
    id: 63,
    title: "Making Your Goal Measurable",
    description: "Define measurable success metrics",
    component: (onComplete) => <MakingGoalMeasurable onComplete={onComplete} />
  },
  {
    id: 66,
    title: "Developing Objectives for Your Goal",
    description: "Create SMART objectives for your goal",
    component: (onComplete) => <DevelopingObjectives onComplete={onComplete} />
  }
];
