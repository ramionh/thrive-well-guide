
import React from 'react';
import { prioritizingChangeSteps } from './active-change/prioritizing-change-steps';
import { whereAreYouNowSteps } from './active-change/where-are-you-now-steps';
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  ...prioritizingChangeSteps,
  ...whereAreYouNowSteps,
  // Additional active change steps can be added here
];
