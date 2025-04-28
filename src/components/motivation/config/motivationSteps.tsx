
import React from 'react';
import FindingInspiration from '../FindingInspiration';
import Ambivalence from "../Ambivalence";
import FocusedHabitsSelector from "../focused-habits/FocusedHabitsSelector";
import InternalObstacles from "../InternalObstacles";
import Attitude from "../Attitude";
import Behaviors from "../Behaviors";
import Knowledge from "../Knowledge";
import SocialNetwork from "../SocialNetwork";
import CulturalObstacles from "../CulturalObstacles";
import EnvironmentalStressors from "../EnvironmentalStressors";
import IdentifyingAmbivalence from "../IdentifyingAmbivalence";
import AddressingAmbivalence from "../AddressingAmbivalence";
import ExternalObstacles from "../ExternalObstacles";
import ThinkingAssertively from "../ThinkingAssertively";
import ExploringChange from "../ExploringChange";
import ExploringValues from "../ExploringValues";
import ClarifyingValues from "../ClarifyingValues";
import ExceptionsToRule from "../ExceptionsToRule";
import PastSuccess from "../PastSuccess";
import HowImportantIsIt from "../HowImportantIsIt";
import WhatWouldChangeLookLike from "../WhatWouldChangeLookLike";
import UnderstandingValues from "../UnderstandingValues";
import DefiningImportance from "../DefiningImportance";
import ImportanceScale from "../ImportanceScale";
import GivingGoalScore from "../GivingGoalScore";
import TakingAnotherStepTowardChange from "../TakingAnotherStepTowardChange";
import AssessingImportanceStepsForward from "../AssessingImportanceStepsForward";
import SettingCeilingFloor from "../SettingCeilingFloor";
import DefiningConfidence from "../DefiningConfidence";
import CreatingConfidenceScale from "../CreatingConfidenceScale";
import GivingConfidenceScore from "../GivingConfidenceScore";
import AssessingConfidenceSteps from "../AssessingConfidenceSteps";
import ImportanceConfidence from "../ImportanceConfidence";
import ConfidenceTalk from "../ConfidenceTalk";
import PastSuccessesAreas from "../PastSuccessesAreas";
import FindingHope from "../FindingHope";
import RevisitValues from "../RevisitValues";
import ValuesConflict from "../ValuesConflict";
import YouHaveWhatItTakes from "../YouHaveWhatItTakes";

export const motivationSteps = [
  {
    id: 1,
    title: "Ambivalence",
    description: "Understanding mixed feelings about change",
    component: (onComplete) => <Ambivalence onComplete={onComplete} />
  },
  {
    id: 2,
    title: "Focus Habits",
    description: "Select your key transformation habits",
    component: (onComplete) => <FocusedHabitsSelector onComplete={onComplete} />
  },
  {
    id: 3,
    title: "Internal Obstacles",
    description: "Identify your internal barriers",
    component: (onComplete) => <InternalObstacles onComplete={onComplete} />
  },
  {
    id: 4,
    title: "Attitude Check",
    description: "Assess your attitude towards your goal",
    component: (onComplete) => <Attitude onComplete={onComplete} />
  },
  {
    id: 5,
    title: "Behaviors",
    description: "Identify behaviors that may hold you back",
    component: (onComplete) => <Behaviors onComplete={onComplete} />
  },
  {
    id: 6,
    title: "Knowledge Gaps",
    description: "Identify areas of uncertainty",
    component: (onComplete) => <Knowledge onComplete={onComplete} />
  },
  {
    id: 7,
    title: "Social Network",
    description: "Evaluate your support system",
    component: (onComplete) => <SocialNetwork onComplete={onComplete} />
  },
  {
    id: 8,
    title: "Cultural Obstacles",
    description: "Identify cultural barriers to change",
    component: (onComplete) => <CulturalObstacles onComplete={onComplete} />
  },
  {
    id: 9,
    title: "Environmental Stressors",
    description: "Identify environmental barriers",
    component: (onComplete) => <EnvironmentalStressors onComplete={onComplete} />
  },
  {
    id: 10,
    title: "Identifying Ambivalence",
    description: "Explore your mixed feelings about change",
    component: (onComplete) => <IdentifyingAmbivalence onComplete={onComplete} />
  },
  {
    id: 11,
    title: "Addressing Ambivalence",
    description: "Develop strategies for managing emotions",
    component: (onComplete) => <AddressingAmbivalence onComplete={onComplete} />
  },
  {
    id: 12,
    title: "External Obstacles",
    description: "Identify and solve external barriers to your goal",
    component: (onComplete) => <ExternalObstacles onComplete={onComplete} />
  },
  {
    id: 13,
    title: "Thinking Assertively",
    description: "Develop assertiveness skills",
    component: (onComplete) => <ThinkingAssertively onComplete={onComplete} />
  },
  {
    id: 14,
    title: "Exploring Values",
    description: "Identify and prioritize your core values",
    component: (onComplete) => <ExploringValues onComplete={onComplete} />
  },
  {
    id: 15,
    title: "Clarifying Values",
    description: "Define and align your core values",
    component: (onComplete) => <ClarifyingValues onComplete={onComplete} />
  },
  {
    id: 16,
    title: "Exceptions to the Rule",
    description: "Document your success in overcoming obstacles",
    component: (onComplete) => <ExceptionsToRule onComplete={onComplete} />
  },
  {
    id: 17,
    title: "Past Success",
    description: "Reflect on past achievements to build confidence",
    component: (onComplete) => <PastSuccess onComplete={onComplete} />
  },
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
    component: (onComplete?: () => void) => <FindingInspiration onComplete={onComplete} />,
  },
  {
    id: 38,
    title: "Revisit Values",
    description: "Reassess your prioritized values",
    component: (onComplete?: () => void) => <RevisitValues onComplete={onComplete} />,
  },
  {
    id: 39,
    title: "Values Conflict",
    description: "Explore values prioritization conflicts",
    component: (onComplete?: () => void) => <ValuesConflict onComplete={onComplete} />,
  },
  {
    id: 40,
    title: "You Have What It Takes",
    description: "Identify your personal strengths",
    component: (onComplete?: () => void) => <YouHaveWhatItTakes onComplete={onComplete} />,
  }
];
