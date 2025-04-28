
import React from 'react';
import ExploringChange from "../../../ExploringChange";
import HowImportantIsIt from "../../../HowImportantIsIt";
import WhatWouldChangeLookLike from "../../../WhatWouldChangeLookLike";
import UnderstandingValues from "../../../UnderstandingValues";
import DefiningImportance from "../../../DefiningImportance";
import ImportanceScale from "../../../ImportanceScale";
import GivingGoalScore from "../../../GivingGoalScore";
import TakingAnotherStepTowardChange from "../../../TakingAnotherStepTowardChange";
import AssessingImportanceStepsForward from "../../../AssessingImportanceStepsForward";
import type { StepConfig } from "../../../types/motivation";

export const exploringSteps: StepConfig[] = [
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
  }
];
