
import React from 'react';
import SocialCulturalResources from "../../../SocialCulturalResources";
import EnvironmentalResources from "../../../EnvironmentalResources";
import ResourceDevelopment from "../../../ResourceDevelopment";
import FinancialResources from "../../../FinancialResources";
import type { StepConfig } from "../../../types/motivation";

export const resourceSteps: StepConfig[] = [
  {
    id: 50,
    title: "Financial and Economic Resources",
    description: "Identify financial resources that support your fitness goals",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
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
