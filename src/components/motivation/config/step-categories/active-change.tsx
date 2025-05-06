
import React from 'react';
import GettingReady from "../../GettingReady";
import WhereAreYouNow from "../../WhereAreYouNow";
import DevelopingObjectives from "../../DevelopingObjectives";
import RewardsCreateIncentive from "../../RewardsCreateIncentive";
import NarrowingDownRewards from "../../NarrowingDownRewards";
import RewardsEventsActivities from "../../RewardsEventsActivities";
import RewardsFromPeopleWhoMatter from "../../RewardsFromPeopleWhoMatter";
import DealingWithSetbacksStressCheck from "../../DealingWithSetbacksStressCheck";
import DealingWithSetbacksSelfCare from "../../DealingWithSetbacksSelfCare";
import DealingWithSetbacksRecommit from "../../DealingWithSetbacksRecommit";
import TakingAnotherStepTowardChange from "../../TakingAnotherStepTowardChange";
import BeConsistent from "../../BeConsistent";
import GetOrganized from "../../GetOrganized";
import SeekPositiveInformation from "../../SeekPositiveInformation";
import SmallSteps from "../../SmallSteps";
import SettingCeilingFloor from "../../SettingCeilingFloor";
import ThinkingAssertively from "../../ThinkingAssertively";
import HelpfulIdeas from "../../HelpfulIdeas";
import ExceptionsToRule from "../../ExceptionsToRule";
import MonitoringYourProgress from "../../MonitoringYourProgress";
import Affirmations from "../../Affirmations";
import RevisitValues from "../../RevisitValues";
import AssessingImportanceStepsForward from "../../AssessingImportanceStepsForward";
import IdentifyingStepsToGoal from "../../IdentifyingStepsToGoal";
import ChangeYourPlan from "../../ChangeYourPlan";
import PrioritizingChange from "../../PrioritizingChange";
import MakingYourGoalMeasurable from "../../MakingYourGoalMeasurable";
import FocusedHabitsSelector from "../../focused-habits/FocusedHabitsSelector";
import FitnessJourneyFinalWord from "../../FitnessJourneyFinalWord";

import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  {
    id: 63,
    title: "Getting Ready",
    description: "Prepare for active change implementation",
    component: (onComplete) => <GettingReady onComplete={onComplete} />
  },
  {
    id: 64,
    title: "Where Are You Now",
    description: "Assess your current position",
    component: (onComplete) => <WhereAreYouNow onComplete={onComplete} />
  },
  {
    id: 65,
    title: "Developing Objectives for Your Goal",
    description: "Create specific, measurable objectives",
    component: (onComplete) => <DevelopingObjectives onComplete={onComplete} />
  },
  {
    id: 66,
    title: "Rewards Create an Incentive to Change",
    description: "Understand the power of rewards",
    component: (onComplete) => <RewardsCreateIncentive onComplete={onComplete} />
  },
  {
    id: 67,
    title: "Narrowing Down Rewards",
    description: "Select effective personal rewards",
    component: (onComplete) => <NarrowingDownRewards onComplete={onComplete} />
  },
  {
    id: 68,
    title: "Rewards: Events and Activities",
    description: "Plan rewarding events and activities",
    component: (onComplete) => <RewardsEventsActivities onComplete={onComplete} />
  },
  {
    id: 69,
    title: "Rewards from People Who Matter",
    description: "Involve important people in your rewards",
    component: (onComplete) => <RewardsFromPeopleWhoMatter onComplete={onComplete} />
  },
  {
    id: 70,
    title: "Dealing With Setbacks: Stress Check",
    description: "Monitor stress during setbacks",
    component: (onComplete) => <DealingWithSetbacksStressCheck onComplete={onComplete} />
  },
  {
    id: 71,
    title: "Dealing With Setbacks: Self-Care",
    description: "Practice self-care during challenges",
    component: (onComplete) => <DealingWithSetbacksSelfCare onComplete={onComplete} />
  },
  {
    id: 72,
    title: "Dealing With Setbacks: Recommit",
    description: "Renew your commitment after setbacks",
    component: (onComplete) => <DealingWithSetbacksRecommit onComplete={onComplete} />
  },
  {
    id: 73,
    title: "Taking Another Step Toward Change",
    description: "Continue moving forward on your journey",
    component: (onComplete) => <TakingAnotherStepTowardChange onComplete={onComplete} />
  },
  {
    id: 74,
    title: "Be Consistent",
    description: "Develop consistency in your habits",
    component: (onComplete) => <BeConsistent onComplete={onComplete} />
  },
  {
    id: 75,
    title: "Get Organized",
    description: "Create systems to support your change",
    component: (onComplete) => <GetOrganized onComplete={onComplete} />
  },
  {
    id: 76,
    title: "Seek Positive Information",
    description: "Find supportive knowledge and guidance",
    component: (onComplete) => <SeekPositiveInformation onComplete={onComplete} />
  },
  {
    id: 77,
    title: "Small Steps",
    description: "Break changes into manageable actions",
    component: (onComplete) => <SmallSteps onComplete={onComplete} />
  },
  {
    id: 78,
    title: "Setting Ceiling & Floor",
    description: "Establish realistic boundaries",
    component: (onComplete) => <SettingCeilingFloor onComplete={onComplete} />
  },
  {
    id: 79,
    title: "Thinking Assertively",
    description: "Develop assertive thought patterns",
    component: (onComplete) => <ThinkingAssertively onComplete={onComplete} />
  },
  {
    id: 80,
    title: "Helpful Ideas",
    description: "Generate supportive thoughts and concepts",
    component: (onComplete) => <HelpfulIdeas onComplete={onComplete} />
  },
  {
    id: 81,
    title: "Exceptions to Rule",
    description: "Identify when change patterns are broken",
    component: (onComplete) => <ExceptionsToRule onComplete={onComplete} />
  },
  {
    id: 82,
    title: "Monitoring Your Progress",
    description: "Track and assess your journey",
    component: (onComplete) => <MonitoringYourProgress onComplete={onComplete} />
  },
  {
    id: 83,
    title: "Affirmations",
    description: "Create powerful positive statements",
    component: (onComplete) => <Affirmations onComplete={onComplete} />
  },
  {
    id: 84,
    title: "Revisit Values",
    description: "Reconnect with your core values",
    component: (onComplete) => <RevisitValues onComplete={onComplete} />
  },
  {
    id: 85,
    title: "Assessing Importance: Steps Forward",
    description: "Evaluate the importance of next steps",
    component: (onComplete) => <AssessingImportanceStepsForward onComplete={onComplete} />
  },
  {
    id: 86,
    title: "Identifying Steps to Goal",
    description: "Map the path to your objectives",
    component: (onComplete) => <IdentifyingStepsToGoal onComplete={onComplete} />
  },
  {
    id: 87,
    title: "Change Your Plan",
    description: "Adapt your approach as needed",
    component: (onComplete) => <ChangeYourPlan onComplete={onComplete} />
  },
  {
    id: 88,
    title: "Prioritizing Change",
    description: "Focus on the most important changes",
    component: (onComplete) => <PrioritizingChange onComplete={onComplete} />
  },
  {
    id: 89,
    title: "Making Your Goal Measurable",
    description: "Create trackable metrics for success",
    component: (onComplete) => <MakingYourGoalMeasurable onComplete={onComplete} />
  },
  {
    id: 90,
    title: "Focused Habits Selector",
    description: "Choose key habits for transformation",
    component: (onComplete) => <FocusedHabitsSelector onComplete={onComplete} />
  },
  {
    id: 91,
    title: "A Final Word: Your Fitness Journey Begins Now!",
    description: "Celebrate your progress and look forward",
    component: (onComplete) => <FitnessJourneyFinalWord onComplete={onComplete} />
  }
];
