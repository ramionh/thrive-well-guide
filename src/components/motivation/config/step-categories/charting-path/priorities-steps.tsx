
import React from 'react';
import Priorities from "../../../Priorities";
import type { StepConfig } from "../../../types/motivation";

export const prioritiesSteps: StepConfig[] = [
  {
    id: 60,
    title: "Priorities",
    description: "Organize your tasks by importance and urgency",
    component: (onComplete) => <Priorities onComplete={onComplete} />
  }
];
