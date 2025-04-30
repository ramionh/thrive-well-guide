
import React from 'react';
import RewardsCreateIncentive from "@/components/motivation/RewardsCreateIncentive";
import RewardsFromPeopleWhoMatter from "@/components/motivation/RewardsFromPeopleWhoMatter";
import RewardsEventsActivities from "@/components/motivation/RewardsEventsActivities";
import NarrowingDownRewards from "@/components/motivation/NarrowingDownRewards";
import GetOrganized from "@/components/motivation/GetOrganized";
import SeekPositiveInformation from "@/components/motivation/SeekPositiveInformation";
import ThinkAboutBigPicture from "@/components/motivation/ThinkAboutBigPicture";
import Control from "@/components/motivation/Control";
import SmallSteps from "@/components/motivation/SmallSteps";
import BeConsistent from "@/components/motivation/BeConsistent";
import SupportSystemRoles from "@/components/motivation/SupportSystemRoles";
import SocialSystemBoundaries from "@/components/motivation/SocialSystemBoundaries";
import FindingCommunity from "@/components/motivation/FindingCommunity";
import VisualizeResults from "@/components/motivation/VisualizeResults";
import HelpfulIdeas from "@/components/motivation/HelpfulIdeas";
import SelfObservation from "@/components/motivation/SelfObservation";
import ObstaclesToOpportunities from "@/components/motivation/ObstaclesToOpportunities";
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
  },
  {
    id: 76,
    title: "Small Steps",
    description: "Break down large goals into achievable small steps",
    component: (onComplete) => <SmallSteps onComplete={onComplete} />
  },
  {
    id: 77,
    title: "Be Consistent",
    description: "Create a schedule for consistently working on your goals",
    component: (onComplete) => <BeConsistent onComplete={onComplete} />
  },
  {
    id: 78,
    title: "Support System Roles",
    description: "Define how people in your support system can help you",
    component: (onComplete) => <SupportSystemRoles onComplete={onComplete} />
  },
  {
    id: 79,
    title: "Social System Boundaries",
    description: "Set boundaries with people who may not support your goals",
    component: (onComplete) => <SocialSystemBoundaries onComplete={onComplete} />
  },
  {
    id: 80,
    title: "Finding Community",
    description: "Connect with groups that can support your fitness journey",
    component: (onComplete) => <FindingCommunity onComplete={onComplete} />
  },
  {
    id: 81,
    title: "Visualize Results",
    description: "Imagine your progress at different time milestones",
    component: (onComplete) => <VisualizeResults onComplete={onComplete} />
  },
  {
    id: 82,
    title: "Helpful Ideas",
    description: "Rank the most helpful techniques you've learned",
    component: (onComplete) => <HelpfulIdeas onComplete={onComplete} />
  },
  {
    id: 83,
    title: "Self-Observation",
    description: "Journal your daily observations about behavior patterns",
    component: (onComplete) => <SelfObservation onComplete={onComplete} />
  },
  {
    id: 84,
    title: "Obstacles to Opportunities",
    description: "Transform potential barriers into chances for growth",
    component: (onComplete) => <ObstaclesToOpportunities onComplete={onComplete} />
  }
];
