
import React from 'react';
import RewardsCreateIncentive from "@/components/motivation/RewardsCreateIncentive";
import RewardsFromPeopleWhoMatter from "@/components/motivation/RewardsFromPeopleWhoMatter";
import RewardsEventsActivities from "@/components/motivation/RewardsEventsActivities";
import NarrowingDownRewards from "@/components/motivation/NarrowingDownRewards";
import type { StepConfig } from "@/components/motivation/types/motivation";

export const rewardsSteps: StepConfig[] = [
  {
    id: 67,
    title: "Rewards Create an Incentive to Change",
    description: "Plan meaningful rewards for achieving your goals",
    component: (onComplete) => <RewardsCreateIncentive onComplete={onComplete} />
  },
  {
    id: 69,
    title: "Rewards from People Who Matter",
    description: "Identify rewards involving praise from important people",
    component: (onComplete) => <RewardsFromPeopleWhoMatter onComplete={onComplete} />
  },
  {
    id: 70,
    title: "Rewards: Events and Activities",
    description: "Plan activity-based rewards for achieving goals",
    component: (onComplete) => <RewardsEventsActivities onComplete={onComplete} />
  },
  {
    id: 71,
    title: "Narrowing Down the Rewards",
    description: "Select your top five most meaningful rewards",
    component: (onComplete) => <NarrowingDownRewards onComplete={onComplete} />
  }
];
