
import React from 'react';
import TimeManagement from "../../../TimeManagement";
import WhereAreYouNow from "../../../WhereAreYouNow";
import type { StepConfig } from "../../../types/motivation";

export const whereAreYouNowSteps: StepConfig[] = [
  {
    id: 53,
    title: "Time Management",
    description: "Managing your time efficiently for success",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  },
  {
    id: 64,
    title: "Where Are You Now",
    description: "Assess your current progress",
    component: (onComplete) => <WhereAreYouNow onComplete={onComplete} />
  }
];
