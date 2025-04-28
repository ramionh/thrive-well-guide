import React from 'react';
import ExploringChange from "../../ExploringChange";
import HowImportantIsIt from "../../HowImportantIsIt";
import WhatWouldChangeLookLike from "../../WhatWouldChangeLookLike";
import UnderstandingValues from "../../UnderstandingValues";
import DefiningImportance from "../../DefiningImportance";
import ImportanceScale from "../../ImportanceScale";
import GivingGoalScore from "../../GivingGoalScore";
import TakingAnotherStepTowardChange from "../../TakingAnotherStepTowardChange";
import AssessingImportanceStepsForward from "../../AssessingImportanceStepsForward";
import SettingCeilingFloor from "../../SettingCeilingFloor";
import DefiningConfidence from "../../DefiningConfidence";
import CreatingConfidenceScale from "../../CreatingConfidenceScale";
import GivingConfidenceScore from "../../GivingConfidenceScore";
import AssessingConfidenceSteps from "../../AssessingConfidenceSteps";
import ImportanceConfidence from "../../ImportanceConfidence";
import ConfidenceTalk from "../../ConfidenceTalk";
import PastSuccessesAreas from "../../PastSuccessesAreas";
import FindingHope from "../../FindingHope";
import FindingInspiration from "../../FindingInspiration";
import RevisitValues from "../../RevisitValues";
import ValuesConflict from "../../ValuesConflict";
import YouHaveWhatItTakes from "../../YouHaveWhatItTakes";
import TheySeeTourStrengths from "../../TheySeeTourStrengths";
import BuildOnYourStrengths from "../../BuildOnYourStrengths";
import ManagingStress from "../../ManagingStress";
import IdentifyingStressTypes from "../../IdentifyingStressTypes";
import HowStressedAmI from "../../HowStressedAmI";
import CopingMechanisms from "../../CopingMechanisms";
import Mindfulness from "../../Mindfulness";
import GrowthMindset from "../../GrowthMindset";
import Affirmations from "../../Affirmations";
import SocialCulturalResources from "../../SocialCulturalResources";

import type { StepConfig } from "../../types/motivation";

export const chartingPathSteps: StepConfig[] = [
  {
    id: 18,
    title: "Exploring Change",
    description: "Understanding the elements of motivation",
    component: (onComplete) => <ExploringChange onComplete={onComplete} />
  },
  {
    id: 19,
    title: "How Important Is It?",
    description: "Understanding the importance of change",
    component: (onComplete) => <HowImportantIsIt onComplete={onComplete} />
  },
  {
    id: 20,
    title: "What Would Change Look Like?",
    description: "Visualizing your fitness transformation",
    component: (onComplete) => <WhatWouldChangeLookLike onComplete={onComplete} />
  },
  {
    id: 21,
    title: "Understanding Values",
    description: "Explore and understand your core values",
    component: (onComplete) => <UnderstandingValues onComplete={onComplete} />
  },
  {
    id: 22,
    title: "Defining Importance",
    description: "Understanding the significance of your goals",
    component: (onComplete) => <DefiningImportance onComplete={onComplete} />
  },
  {
    id: 23,
    title: "Importance Scale",
    description: "Rate the importance of your fitness goal",
    component: (onComplete) => <ImportanceScale onComplete={onComplete} />
  },
  {
    id: 24,
    title: "Giving Your Goal a Score",
    description: "Rate the importance of your fitness goal",
    component: (onComplete) => <GivingGoalScore onComplete={onComplete} />
  },
  {
    id: 25,
    title: "Taking Another Step Toward Change",
    description: "Consider what it would take to increase your score",
    component: (onComplete) => <TakingAnotherStepTowardChange onComplete={onComplete} />
  },
  {
    id: 26,
    title: "Assessing the Importance of My Steps Forward",
    description: "Rate and choose your next steps forward",
    component: (onComplete) => <AssessingImportanceStepsForward onComplete={onComplete} />
  },
  {
    id: 27,
    title: "Setting Your Ceiling and Floor",
    description: "Define best and worst possible outcomes",
    component: (onComplete) => <SettingCeilingFloor onComplete={onComplete} />
  },
  {
    id: 28,
    title: "Defining Confidence",
    description: "Explore what confidence means to you",
    component: (onComplete) => <DefiningConfidence onComplete={onComplete} />
  },
  {
    id: 29,
    title: "Creating a Confidence Scale",
    description: "Define your confidence scale",
    component: (onComplete) => <CreatingConfidenceScale onComplete={onComplete} />
  },
  {
    id: 30,
    title: "Giving Yourself a Score",
    description: "Rate your current confidence level",
    component: (onComplete) => <GivingConfidenceScore onComplete={onComplete} />
  },
  {
    id: 31,
    title: "Taking Another Step Toward Change",
    description: "Consider what it would take to increase your score",
    component: (onComplete) => <TakingAnotherStepTowardChange onComplete={onComplete} />
  },
  {
    id: 32,
    title: "Assessing Your Confidence in Your Steps Forward",
    description: "Rate your confidence in each step forward",
    component: (onComplete) => <AssessingConfidenceSteps onComplete={onComplete} />
  },
  {
    id: 33,
    title: "Importance x Confidence",
    description: "Identify which quadrant you belong in",
    component: (onComplete) => <ImportanceConfidence onComplete={onComplete} />
  },
  {
    id: 34,
    title: "Building Confidence—Confidence Talk",
    description: "Create positive self-talk to build confidence",
    component: (onComplete) => <ConfidenceTalk onComplete={onComplete} />
  },
  {
    id: 35,
    title: "Past Successes",
    description: "Reflect on small changes you've made",
    component: (onComplete) => <PastSuccessesAreas onComplete={onComplete} />
  },
  {
    id: 36,
    title: "Finding Hope",
    description: "Explore what gives you hope for change",
    component: (onComplete) => <FindingHope onComplete={onComplete} />
  },
  {
    id: 37,
    title: "Finding Inspiration",
    description: "Finding sources of inspiration",
    component: (onComplete) => <FindingInspiration onComplete={onComplete} />
  },
  {
    id: 38,
    title: "Revisit Values",
    description: "Reassess your prioritized values",
    component: (onComplete) => <RevisitValues onComplete={onComplete} />
  },
  {
    id: 39,
    title: "Values Conflict",
    description: "Explore values prioritization conflicts",
    component: (onComplete) => <ValuesConflict onComplete={onComplete} />
  },
  {
    id: 40,
    title: "You Have What It Takes",
    description: "Identify your personal strengths",
    component: (onComplete) => <YouHaveWhatItTakes onComplete={onComplete} />
  },
  {
    id: 41,
    title: "They See Your Strengths",
    description: "Collect feedback on your strengths from others",
    component: (onComplete) => <TheySeeTourStrengths onComplete={onComplete} />
  },
  {
    id: 42,
    title: "Build on Your Strengths",
    description: "Apply your strengths to achieve your goals",
    component: (onComplete) => <BuildOnYourStrengths onComplete={onComplete} />
  },
  {
    id: 43,
    title: "Managing Stress",
    description: "Identify and understand your key stressors",
    component: (onComplete) => <ManagingStress onComplete={onComplete} />
  },
  {
    id: 44,
    title: "Identifying Your Type of Stress",
    description: "Understand different types of stress in your life",
    component: (onComplete) => <IdentifyingStressTypes onComplete={onComplete} />
  },
  {
    id: 45,
    title: "How Stressed Am I?",
    description: "Rate the intensity of your stressors",
    component: (onComplete) => <HowStressedAmI onComplete={onComplete} />
  },
  {
    id: 46,
    title: "Coping Mechanisms",
    description: "Develop strategies to cope with stress",
    component: (onComplete) => <CopingMechanisms onComplete={onComplete} />
  },
  {
    id: 47,
    title: "Mindfulness",
    description: "Practice mindfulness meditation techniques",
    component: (onComplete) => <Mindfulness onComplete={onComplete} />
  },
  {
    id: 48,
    title: "Growth Mindset",
    description: "Develop a mindset that embraces learning and growth",
    component: (onComplete) => <GrowthMindset onComplete={onComplete} />
  },
  {
    id: 49,
    title: "Affirmations",
    description: "Create positive self-affirmations",
    component: (onComplete) => <Affirmations onComplete={onComplete} />
  },
  {
    id: 50,
    title: "Social and Cultural Resources",
    description: "Leverage your cultural background for motivation",
    component: (onComplete) => <SocialCulturalResources onComplete={onComplete} />
  }
];
