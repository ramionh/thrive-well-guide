
import React from 'react';
import RealisticChange from "../../../RealisticChange";
import type { StepConfig } from "../../../types/motivation";

export const realisticChangeSteps: StepConfig[] = [
  {
    id: 58,
    title: "Realistic Change",
    description: "Set a realistic goal based on your strengths and resources",
    component: (onComplete) => <RealisticChange onComplete={onComplete} />
  }
];
