
import React from 'react';
import FinancialResources from "../../FinancialResources";
import SocialSupport from "../../SocialSupport";
import FamilyStrengths from "../../FamilyStrengths";
import TimeManagement from "../../TimeManagement";
import SocialCulturalResources from "../../SocialCulturalResources";
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
  {
    id: 52,
    title: "Family Strengths",
    description: "Identify family strengths that can help you achieve your goals",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  },
  {
    id: 53,
    title: "Time Management and Personal Structure",
    description: "Find time in your schedule for fitness activities",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  },
  {
    id: 54,
    title: "Social and Cultural Resources",
    description: "Leverage your cultural background for motivation",
    component: (onComplete) => <SocialCulturalResources onComplete={onComplete} />
  },
];
