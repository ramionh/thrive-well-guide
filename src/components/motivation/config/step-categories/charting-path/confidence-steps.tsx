
import React from 'react';
import SettingCeilingFloor from "../../../SettingCeilingFloor";
import DefiningConfidence from "../../../DefiningConfidence";
import CreatingConfidenceScale from "../../../CreatingConfidenceScale";
import GivingConfidenceScore from "../../../GivingConfidenceScore";
import TakingAnotherStepTowardChange from "../../../TakingAnotherStepTowardChange";
import AssessingConfidenceSteps from "../../../AssessingConfidenceSteps";
import ImportanceConfidence from "../../../ImportanceConfidence";
import ConfidenceTalk from "../../../ConfidenceTalk";
import type { StepConfig } from "../../../types/motivation";

export const confidenceSteps: StepConfig[] = [
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
  }
];
