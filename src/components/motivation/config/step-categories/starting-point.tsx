
import React from 'react';
import Ambivalence from "../../Ambivalence";
import FocusedHabitsSelector from "../../focused-habits/FocusedHabitsSelector";
import InternalObstacles from "../../InternalObstacles";
import Attitude from "../../Attitude";
import Behaviors from "../../Behaviors";
import Knowledge from "../../Knowledge";
import SocialNetwork from "../../SocialNetwork";
import CulturalObstacles from "../../CulturalObstacles";
import EnvironmentalStressors from "../../EnvironmentalStressors";
import IdentifyingAmbivalence from "../../IdentifyingAmbivalence";
import AddressingAmbivalence from "../../AddressingAmbivalence";
import ExternalObstacles from "../../ExternalObstacles";
import ThinkingAssertively from "../../ThinkingAssertively";
import ExploringValues from "../../ExploringValues";
import ClarifyingValues from "../../ClarifyingValues";
import ExceptionsToRule from "../../ExceptionsToRule";
import PastSuccess from "../../PastSuccess";

import type { StepConfig } from "../../types/motivation";

export const startingPointSteps: StepConfig[] = [
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
  }
];
