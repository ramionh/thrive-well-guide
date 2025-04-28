import React from 'react';
import { prioritizingChangeSteps } from './active-change/prioritizing-change-steps';
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  ...prioritizingChangeSteps,
  // Additional active change steps can be added here
];
