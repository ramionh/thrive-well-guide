
import React from 'react';
import EnvisioningChange from "../../../EnvisioningChange";
import ThinkAboutBigPicture from "../../../ThinkAboutBigPicture";
import VisualizeResults from "../../../VisualizeResults";
import type { StepConfig } from "../../../types/motivation";

export const envisioningSteps: StepConfig[] = [
  {
    id: 57,
    title: "Envisioning Change",
    description: "Create a clear vision of your successful change",
    component: (onComplete) => <EnvisioningChange onComplete={onComplete} />
  },
  {
    id: 58,
    title: "Think About Big Picture",
    description: "Connect your changes to larger goals",
    component: (onComplete) => <ThinkAboutBigPicture onComplete={onComplete} />
  },
  {
    id: 59,
    title: "Visualize Results",
    description: "Create mental images of success",
    component: (onComplete) => <VisualizeResults onComplete={onComplete} />
  }
];
