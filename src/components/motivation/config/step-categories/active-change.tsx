
import React from 'react';
import FinancialResources from "../../FinancialResources";
import SocialSupport from "../../SocialSupport";
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  {
    id: 50,
    title: "Financial and Economic Resources",
    description: "Identify financial resources that can support your fitness goals",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
  },
  {
    id: 51,
    title: "Social Support and Social Competence",
    description: "Explore your social support network and social skills",
    component: (onComplete) => <SocialSupport onComplete={onComplete} />
  },
  // Step 52: Family Strengths will be added here
];
