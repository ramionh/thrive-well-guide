
import React from 'react';
import EnvisioningChange from "../../../EnvisioningChange";
import type { StepConfig } from "../../../types/motivation";

export const envisioningSteps: StepConfig[] = [
  {
    id: 57,
    title: "Envisioning Change",
    description: "Create a clear vision of your successful change",
    component: (onComplete) => <EnvisioningChange onComplete={onComplete} />
  }
];
