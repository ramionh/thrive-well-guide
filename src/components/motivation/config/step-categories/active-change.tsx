
import { whereAreYouNowSteps } from './active-change/where-are-you-now-steps';
import { prioritizingChangeSteps } from './active-change/prioritizing-change-steps';
import { rewardsSteps } from './active-change/rewards-steps';
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  ...whereAreYouNowSteps,
  ...prioritizingChangeSteps,
  ...rewardsSteps
];
