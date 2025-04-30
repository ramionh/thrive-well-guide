
import React from 'react';
import RewardsCreateIncentive from "@/components/motivation/RewardsCreateIncentive";
import RewardsFromPeopleWhoMatter from "@/components/motivation/RewardsFromPeopleWhoMatter";
import RewardsEventsActivities from "@/components/motivation/RewardsEventsActivities";
import NarrowingDownRewards from "@/components/motivation/NarrowingDownRewards";
import GetOrganized from "@/components/motivation/GetOrganized";
import SeekPositiveInformation from "@/components/motivation/SeekPositiveInformation";
import ThinkAboutBigPicture from "@/components/motivation/ThinkAboutBigPicture";
import Control from "@/components/motivation/Control";
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
  },
  {
    id: 72,
    title: "Get Organized",
    description: "Create a system to organize your action plan",
    component: (onComplete) => <GetOrganized onComplete={onComplete} />
  },
  {
    id: 73,
    title: "Seek Positive Information Daily",
    description: "Find sources that reinforce your commitment to fitness",
    component: (onComplete) => <SeekPositiveInformation onComplete={onComplete} />
  },
  {
    id: 74,
    title: "Think About the Big Picture and Your Big Why",
    description: "Revisit your ultimate goal and motivations",
    component: (onComplete) => <ThinkAboutBigPicture onComplete={onComplete} />
  },
  {
    id: 75,
    title: "Control",
    description: "Focus on what you can control and let go of what you can't",
    component: (onComplete) => <Control onComplete={onComplete} />
  }
];
