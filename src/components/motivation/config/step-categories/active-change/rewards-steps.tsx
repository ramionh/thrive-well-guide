
import { StepConfig } from "../../../types/motivation";
import RewardsCreateIncentive from "../../../RewardsCreateIncentive";
import NarrowingDownRewards from "../../../NarrowingDownRewards";
import RewardsEventsActivities from "../../../RewardsEventsActivities";
import RewardsFromPeopleWhoMatter from "../../../RewardsFromPeopleWhoMatter";
import AFinalWord from "../../../AFinalWord";

export const rewardsSteps: StepConfig[] = [
  {
    id: 66,
    title: "Rewards Create an Incentive to Change",
    description: "How rewards strengthen motivation",
    component: (onComplete) => <RewardsCreateIncentive onComplete={onComplete} />,
    nextStepNumber: 69,
    nextStepName: "Rewards from People Who Matter",
    stepName: "Rewards Create an Incentive to Change"
  },
  {
    id: 67,
    title: "Narrowing Down Rewards",
    description: "Selecting your top motivating rewards",
    component: (onComplete) => <NarrowingDownRewards onComplete={onComplete} />,
    stepName: "Narrowing Down Rewards"
  },
  {
    id: 68,
    title: "Rewards: Events and Activities",
    description: "Using activities as motivation",
    component: (onComplete) => <RewardsEventsActivities onComplete={onComplete} />,
    stepName: "Rewards: Events and Activities"
  },
  {
    id: 69,
    title: "Rewards from People Who Matter",
    description: "Social support as motivation",
    component: (onComplete) => <RewardsFromPeopleWhoMatter onComplete={onComplete} />,
    stepName: "Rewards from People Who Matter"
  },
  {
    id: 91,
    title: "A Final Word: Your Fitness Journey Begins Now!",
    description: "Complete your motivation journey",
    component: (onComplete) => <AFinalWord onComplete={onComplete} />,
    stepName: "A Final Word: Your Fitness Journey Begins Now!"
  }
];
