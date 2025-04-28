
import React from 'react';
import PartialChangeFeelings from "../../../PartialChangeFeelings";
import type { StepConfig } from "../../../types/motivation";

export const partialChangeFeelingsSteps: StepConfig[] = [
  {
    id: 59,
    title: "Feelings Around Partial Change",
    description: "Acknowledge and celebrate your progress towards your goals",
    component: (onComplete) => <PartialChangeFeelings onComplete={onComplete} />
  }
];
