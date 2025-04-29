
import { exploringSteps } from './charting-path/exploring-steps';
import { confidenceSteps } from './charting-path/confidence-steps';
import { strengthSteps } from './charting-path/strength-steps';
import { stressSteps } from './charting-path/stress-steps';
import { resourceSteps } from './charting-path/resource-steps';
import { envisioningSteps } from './charting-path/envisioning-steps';
import { realisticChangeSteps } from './charting-path/realistic-change-steps';
import { partialChangeFeelingsSteps } from './charting-path/partial-change-feelings-steps';
import { prioritiesSteps } from './charting-path/priorities-steps';
import type { StepConfig } from "../../types/motivation";

export const chartingPathSteps: StepConfig[] = [
  ...exploringSteps,
  ...confidenceSteps,
  ...strengthSteps,
  ...stressSteps,
  ...resourceSteps,
  ...envisioningSteps,
  ...realisticChangeSteps,
  ...partialChangeFeelingsSteps,
  ...prioritiesSteps,
];
