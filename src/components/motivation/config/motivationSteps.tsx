
import { startingPointSteps } from "./step-categories/starting-point";
import { chartingPathSteps } from "./step-categories/charting-path";
import { activeChangeSteps } from "./step-categories/active-change";

export const motivationSteps = [
  ...startingPointSteps,
  ...chartingPathSteps,
  ...activeChangeSteps
];
