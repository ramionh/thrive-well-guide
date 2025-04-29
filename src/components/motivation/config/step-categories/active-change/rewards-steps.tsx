
import React from 'react';
import RewardsCreateIncentive from "@/components/motivation/RewardsCreateIncentive";
import type { StepConfig } from "@/components/motivation/types/motivation";

export const rewardsSteps: StepConfig[] = [
  {
    id: 67,
    title: "Rewards Create an Incentive to Change",
    description: "Plan meaningful rewards for achieving your goals",
    component: (onComplete) => <RewardsCreateIncentive onComplete={onComplete} />
  }
];
