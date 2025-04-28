
import React from 'react';
import FinancialResources from "../../FinancialResources";
import SocialSupport from "../../SocialSupport";
import FamilyStrengths from "../../FamilyStrengths";
import TimeManagement from "../../TimeManagement";
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  {
    id: 58,
    title: "Financial and Economic Resources",
    description: "Identify financial resources that can support your fitness goals",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
  },
  {
    id: 59,
    title: "Social Support and Social Competence",
    description: "Explore your social support network and social skills",
    component: (onComplete) => <SocialSupport onComplete={onComplete} />
  },
  {
    id: 60,
    title: "Family Strengths",
    description: "Identify family strengths that can help you achieve your goals",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  },
  {
    id: 61,
    title: "Time Management and Personal Structure",
    description: "Find time in your schedule for fitness activities",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  }
];
