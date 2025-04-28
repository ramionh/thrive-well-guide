
import React from 'react';
import WhereAreYouNow from "../../../WhereAreYouNow";
import type { StepConfig } from "../../../types/motivation";

export const whereAreYouNowSteps: StepConfig[] = [
  {
    id: 62,
    title: "Where Are You Now?",
    description: "Assess your readiness for change",
    component: (onComplete) => <WhereAreYouNow onComplete={onComplete} />
  }
];
