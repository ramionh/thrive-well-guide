
import React from "react";
import WhereAreYouNow from "../../../WhereAreYouNow";
import GettingReady from "../../../GettingReady";
import MakingGoalMeasurable from "../../../MakingGoalMeasurable";
import IdentifyingStepsToGoal from "../../../IdentifyingStepsToGoal";
import type { StepConfig } from "../../../types/motivation";

export const whereAreYouNowSteps: StepConfig[] = [
  {
    id: 62,
    title: "Where Are You Now?",
    description: "Assess your current progress and motivation level",
    component: (onComplete) => <WhereAreYouNow onComplete={onComplete} />,
  },
  {
    id: 63,
    title: "Getting Ready for Change",
    description: "Prepare yourself mentally for making changes",
    component: (onComplete) => <GettingReady onComplete={onComplete} />,
  },
  {
    id: 64,
    title: "Making Your Goal Measurable",
    description: "Define your goal in specific, measurable terms",
    component: (onComplete) => <MakingGoalMeasurable onComplete={onComplete} />,
  },
  {
    id: 65,
    title: "Identifying the Steps to Reach Your Goal",
    description: "Brainstorm actions to achieve your goal",
    component: (onComplete) => <IdentifyingStepsToGoal onComplete={onComplete} />,
  },
];
