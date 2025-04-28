
import React from 'react';
import FinancialResources from "../../FinancialResources";
import SocialSupport from "../../SocialSupport";
import FamilyStrengths from "../../FamilyStrengths";
import TimeManagement from "../../TimeManagement";
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  {
    id: 56,
    title: "Resource Development",
    description: "Develop and enhance your resources for achieving fitness goals",
    component: (onComplete) => (
      <div className="p-4">
        <p className="text-lg text-gray-700">
          This is a placeholder for the Resource Development component. 
          This component will be implemented in a future update.
        </p>
        <button 
          onClick={onComplete}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Complete Step
        </button>
      </div>
    )
  },
  {
    id: 57,
    title: "Financial and Economic Resources",
    description: "Identify financial resources that can support your fitness goals",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
  },
  {
    id: 58,
    title: "Social Support and Social Competence",
    description: "Explore your social support network and social skills",
    component: (onComplete) => <SocialSupport onComplete={onComplete} />
  },
  {
    id: 59,
    title: "Family Strengths",
    description: "Identify family strengths that can help you achieve your goals",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  },
  {
    id: 60,
    title: "Time Management and Personal Structure",
    description: "Find time in your schedule for fitness activities",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  }
];
