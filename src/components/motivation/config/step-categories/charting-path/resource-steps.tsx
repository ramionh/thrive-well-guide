
import React from 'react';
import SocialCulturalResources from "../../../SocialCulturalResources";
import EnvironmentalResources from "../../../EnvironmentalResources";
import ResourceDevelopment from "../../../ResourceDevelopment";
import FinancialResources from "../../../FinancialResources";
import SocialSupport from "../../../SocialSupport";
import FamilyStrengths from "../../../FamilyStrengths";
import TimeManagement from "../../../TimeManagement";
import type { StepConfig } from "../../../types/motivation";

export const resourceSteps: StepConfig[] = [
  {
    id: 50,
    title: "Financial and Economic Resources",
    description: "Identify financial resources that support your fitness goals",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
  },
  {
    id: 51,
    title: "Social Support and Social Competence",
    description: "Identify your social support system and competence",
    component: (onComplete) => <SocialSupport onComplete={onComplete} />
  },
  {
    id: 52,
    title: "Family Strengths",
    description: "Leverage your family strengths for motivation",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  },
  {
    id: 53,
    title: "Time Management and Personal Structure",
    description: "Learn to manage your time effectively for fitness goals",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  },
  {
    id: 54,
    title: "Social and Cultural Resources",
    description: "Leverage your cultural background for motivation",
    component: (onComplete) => <SocialCulturalResources onComplete={onComplete} />
  },
  {
    id: 55,
    title: "Environmental or Situational Supports and Resources",
    description: "Identify resources in your environment that support your fitness goals",
    component: (onComplete) => <EnvironmentalResources onComplete={onComplete} />
  },
  {
    id: 56,
    title: "Resource Development",
    description: "Develop and enhance your resources for achieving fitness goals",
    component: (onComplete) => <ResourceDevelopment onComplete={onComplete} />
  }
];
