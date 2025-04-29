
import React from 'react';
import ManagingStress from "../../../ManagingStress";
import IdentifyingStressTypes from "../../../IdentifyingStressTypes";
import HowStressedAmI from "../../../HowStressedAmI";
import CopingMechanisms from "../../../CopingMechanisms";
import Mindfulness from "../../../Mindfulness";
import GrowthMindset from "../../../GrowthMindset";
import Affirmations from "../../../Affirmations";
import type { StepConfig } from "../../../types/motivation";

export const stressSteps: StepConfig[] = [
  {
    id: 43,
    title: "Managing Stress",
    description: "Learn about stress management techniques",
    component: (onComplete) => <ManagingStress onComplete={onComplete} />
  },
  {
    id: 44,
    title: "Identifying Your Type of Stress",
    description: "Understand different types of stress in your life",
    component: (onComplete) => <IdentifyingStressTypes onComplete={onComplete} />
  },
  {
    id: 45,
    title: "How Stressed Am I?",
    description: "Rate the intensity of your stressors",
    component: (onComplete) => <HowStressedAmI onComplete={onComplete} />
  },
  {
    id: 46,
    title: "Coping Mechanisms",
    description: "Develop strategies to cope with stress",
    component: (onComplete) => <CopingMechanisms onComplete={onComplete} />
  },
  {
    id: 47,
    title: "Mindfulness",
    description: "Practice mindfulness meditation techniques",
    component: (onComplete) => <Mindfulness onComplete={onComplete} />
  },
  {
    id: 48,
    title: "Growth Mindset",
    description: "Develop a mindset that embraces learning and growth",
    component: (onComplete) => <GrowthMindset onComplete={onComplete} />
  },
  {
    id: 49,
    title: "Affirmations",
    description: "Create positive self-affirmations",
    component: (onComplete) => <Affirmations onComplete={onComplete} />
  }
];
