
import React from 'react';
import ExploringChange from "../../ExploringChange";
import FindingHope from "../../FindingHope";
import RealisticChange from "../../RealisticChange";
import PastSuccess from "../../PastSuccess";
import PastSuccessesAreas from "../../PastSuccessesAreas";
import SelfObservation from "../../SelfObservation";
import DefiningConfidence from "../../DefiningConfidence";
import CreatingConfidenceScale from "../../CreatingConfidenceScale";
import GivingConfidenceScore from "../../GivingConfidenceScore";
import ImportanceConfidence from "../../ImportanceConfidence";
import ObstaclesToOpportunities from "../../ObstaclesToOpportunities";
import ExternalObstacles from "../../ExternalObstacles";
import InternalObstacles from "../../InternalObstacles";
import CulturalObstacles from "../../CulturalObstacles";
import ConfidenceTalk from "../../ConfidenceTalk";
import Mindfulness from "../../Mindfulness";
import EnvironmentalResources from "../../EnvironmentalResources";
import FinancialResources from "../../FinancialResources";
import SocialSupport from "../../SocialSupport";
import FamilyStrengths from "../../FamilyStrengths";
import SocialCulturalResources from "../../SocialCulturalResources";
import ResourceDevelopment from "../../ResourceDevelopment";
import CopingMechanisms from "../../CopingMechanisms";
import Control from "../../Control";
import SocialNetwork from "../../SocialNetwork";
import SupportSystemRoles from "../../SupportSystemRoles";
import SocialSystemBoundaries from "../../SocialSystemBoundaries";
import FindingCommunity from "../../FindingCommunity";
import AssessingConfidenceSteps from "../../AssessingConfidenceSteps";
import TheChangePlan from "../../TheChangePlan";
import HowStressedAmI from "../../HowStressedAmI";
import EnvironmentalStressors from "../../EnvironmentalStressors";
import IdentifyingStressTypes from "../../IdentifyingStressTypes";
import ManagingStress from "../../ManagingStress";
import PartialChangeFeelings from "../../PartialChangeFeelings";
import TimeManagement from "../../TimeManagement";
import Priorities from "../../Priorities";
import FindingInspiration from "../../FindingInspiration";
import BuildOnYourStrengths from "../../BuildOnYourStrengths";
import EnvisioningChange from "../../EnvisioningChange";
import ThinkAboutBigPicture from "../../ThinkAboutBigPicture";
import VisualizeResults from "../../VisualizeResults";
import TheySeeYourStrengths from "../../TheySeeYourStrengths";
import GrowthMindset from "../../GrowthMindset";
import YouHaveWhatItTakes from "../../YouHaveWhatItTakes";

import type { StepConfig } from "../../types/motivation";
import WhatWouldChangeLookLike from '../../WhatWouldChangeLookLike';
import UnderstandingValues from '../../UnderstandingValues';
import HowImportantIsIt from '../../HowImportantIsIt';

export const chartingYourPathSteps: StepConfig[] = [
  {
    id: 18,
    title: "Exploring Change",
    description: "Begin charting your path to transformation",
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
    title: "Understanding Vlaues",
    description: "Explore and understand your core values",
    component: (onComplete) => <UnderstandingValues onComplete={onComplete} />
  },
  {
    id: 22,
    title: "Finding Hope",
    description: "Discover sources of hope and motivation",
    component: (onComplete) => <FindingHope onComplete={onComplete} />
  },
  {
    id: 23,
    title: "Realistic Change",
    description: "Set realistic expectations for change",
    component: (onComplete) => <RealisticChange onComplete={onComplete} />
  },
  {
    id: 24,
    title: "Past Success",
    description: "Reflect on past achievements",
    component: (onComplete) => <PastSuccess onComplete={onComplete} />
  },
  {
    id: 25,
    title: "Past Successes Areas",
    description: "Identify areas where you've succeeded before",
    component: (onComplete) => <PastSuccessesAreas onComplete={onComplete} />
  },
  {
    id: 26,
    title: "Self Observation",
    description: "Develop awareness of your patterns",
    component: (onComplete) => <SelfObservation onComplete={onComplete} />
  },
  {
    id: 27,
    title: "Defining Confidence",
    description: "Understand what confidence means to you",
    component: (onComplete) => <DefiningConfidence onComplete={onComplete} />
  },
  {
    id: 28,
    title: "Creating Confidence Scale",
    description: "Build a personal scale to measure confidence",
    component: (onComplete) => <CreatingConfidenceScale onComplete={onComplete} />
  },
  {
    id: 29,
    title: "Giving Confidence Score",
    description: "Assess your current confidence level",
    component: (onComplete) => <GivingConfidenceScore onComplete={onComplete} />
  },
  {
    id: 30,
    title: "Importance-Confidence",
    description: "Balance importance with confidence",
    component: (onComplete) => <ImportanceConfidence onComplete={onComplete} />
  },
  {
    id: 31,
    title: "Obstacles to Opportunities",
    description: "Transform challenges into possibilities",
    component: (onComplete) => <ObstaclesToOpportunities onComplete={onComplete} />
  },
  {
    id: 32,
    title: "External Obstacles",
    description: "Identify external barriers to change",
    component: (onComplete) => <ExternalObstacles onComplete={onComplete} />
  },
  {
    id: 33,
    title: "Internal Obstacles",
    description: "Recognize internal resistance to change",
    component: (onComplete) => <InternalObstacles onComplete={onComplete} />
  },
  {
    id: 34,
    title: "Cultural Obstacles",
    description: "Identify cultural barriers to change",
    component: (onComplete) => <CulturalObstacles onComplete={onComplete} />
  },
  {
    id: 35,
    title: "Confidence Talk",
    description: "Develop positive self-talk for confidence",
    component: (onComplete) => <ConfidenceTalk onComplete={onComplete} />
  },
  {
    id: 36,
    title: "Mindfulness",
    description: "Practice mindfulness for change",
    component: (onComplete) => <Mindfulness onComplete={onComplete} />
  },
  {
    id: 37,
    title: "Environmental Resources",
    description: "Identify resources in your environment",
    component: (onComplete) => <EnvironmentalResources onComplete={onComplete} />
  },
  {
    id: 38,
    title: "Financial Resources",
    description: "Assess financial resources for your journey",
    component: (onComplete) => <FinancialResources onComplete={onComplete} />
  },
  {
    id: 39,
    title: "Social Support",
    description: "Build your social support network",
    component: (onComplete) => <SocialSupport onComplete={onComplete} />
  },
  {
    id: 40,
    title: "Family Strengths",
    description: "Leverage family support and strengths",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  },
  {
    id: 41,
    title: "Social-Cultural Resources",
    description: "Utilize social and cultural resources",
    component: (onComplete) => <SocialCulturalResources onComplete={onComplete} />
  },
  {
    id: 42,
    title: "Resource Development",
    description: "Develop and grow your resources",
    component: (onComplete) => <ResourceDevelopment onComplete={onComplete} />
  },
  {
    id: 43,
    title: "Coping Mechanisms",
    description: "Develop healthy coping strategies",
    component: (onComplete) => <CopingMechanisms onComplete={onComplete} />
  },
  {
    id: 44,
    title: "Control",
    description: "Identify what you can and cannot control",
    component: (onComplete) => <Control onComplete={onComplete} />
  },
  {
    id: 45,
    title: "Social Network",
    description: "Map your social connections",
    component: (onComplete) => <SocialNetwork onComplete={onComplete} />
  },
  {
    id: 46,
    title: "Support System Roles",
    description: "Define roles in your support system",
    component: (onComplete) => <SupportSystemRoles onComplete={onComplete} />
  },
  {
    id: 47,
    title: "Social System Boundaries",
    description: "Establish healthy boundaries",
    component: (onComplete) => <SocialSystemBoundaries onComplete={onComplete} />
  },
  {
    id: 48,
    title: "Finding Community",
    description: "Connect with supportive communities",
    component: (onComplete) => <FindingCommunity onComplete={onComplete} />
  },
  {
    id: 49,
    title: "Assessing Confidence Steps",
    description: "Evaluate confidence in your plan steps",
    component: (onComplete) => <AssessingConfidenceSteps onComplete={onComplete} />
  },
  {
    id: 50,
    title: "The Change Plan",
    description: "Develop your comprehensive change plan",
    component: (onComplete) => <TheChangePlan onComplete={onComplete} />
  },
  {
    id: 51,
    title: "How Stressed Am I",
    description: "Assess your current stress levels",
    component: (onComplete) => <HowStressedAmI onComplete={onComplete} />
  },
  {
    id: 52,
    title: "Environmental Stressors",
    description: "Identify stressors in your environment",
    component: (onComplete) => <EnvironmentalStressors onComplete={onComplete} />
  },
  {
    id: 53,
    title: "Identifying Stress Types",
    description: "Recognize different types of stress",
    component: (onComplete) => <IdentifyingStressTypes onComplete={onComplete} />
  },
  {
    id: 54,
    title: "Managing Stress",
    description: "Develop strategies to manage stress",
    component: (onComplete) => <ManagingStress onComplete={onComplete} />
  },
  {
    id: 55,
    title: "Partial Change Feelings",
    description: "Handle emotions during partial progress",
    component: (onComplete) => <PartialChangeFeelings onComplete={onComplete} />
  },
  {
    id: 56,
    title: "Time Management",
    description: "Manage your time effectively for change",
    component: (onComplete) => <TimeManagement onComplete={onComplete} />
  },
  {
    id: 57,
    title: "Priorities",
    description: "Set clear priorities for your journey",
    component: (onComplete) => <Priorities onComplete={onComplete} />
  },
  {
    id: 58,
    title: "Finding Inspiration",
    description: "Discover sources of ongoing inspiration",
    component: (onComplete) => <FindingInspiration onComplete={onComplete} />
  },
  {
    id: 59,
    title: "Build on Your Strengths",
    description: "Leverage your personal strengths",
    component: (onComplete) => <BuildOnYourStrengths onComplete={onComplete} />
  },
  {
    id: 60,
    title: "Envisioning Change",
    description: "Visualize your transformation journey",
    component: (onComplete) => <EnvisioningChange onComplete={onComplete} />
  },
  {
    id: 61,
    title: "Think About Big Picture",
    description: "Connect your changes to larger goals",
    component: (onComplete) => <ThinkAboutBigPicture onComplete={onComplete} />
  },
  {
    id: 62,
    title: "Visualize Results",
    description: "Create mental images of success",
    component: (onComplete) => <VisualizeResults onComplete={onComplete} />
  },
  {
    id: 63,
    title: "They See Your Strengths",
    description: "Recognize how others see your potential",
    component: (onComplete) => <TheySeeYourStrengths onComplete={onComplete} />
  },
  {
    id: 64,
    title: "Growth Mindset",
    description: "Develop a mindset for continuous growth",
    component: (onComplete) => <GrowthMindset onComplete={onComplete} />
  },
  {
    id: 65,
    title: "You Have What It Takes",
    description: "Build confidence in your capabilities",
    component: (onComplete) => <YouHaveWhatItTakes onComplete={onComplete} />
  }
];
