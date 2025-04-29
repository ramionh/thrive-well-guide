
import React from "react";
import WhereAreYouNow from "../../../WhereAreYouNow";
import IdentifyingStepsToGoal from "../../../IdentifyingStepsToGoal";
import type { StepConfig } from "../../../types/motivation";

export const whereAreYouNowSteps: StepConfig[] = [
  {
    id: 64,
    title: "Where Are You Now?",
    description: "Assess your current progress and motivation level",
    component: (onComplete) => <WhereAreYouNow onComplete={onComplete} />,
  },
  {
    id: 65,
    title: "Identifying the Steps to Reach Your Goal",
    description: "Brainstorm actions to achieve your goal",
    component: (onComplete) => <IdentifyingStepsToGoal onComplete={onComplete} />,
  },
];
