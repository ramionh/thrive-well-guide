
import React from 'react';
import PastSuccessesAreas from "../../../PastSuccessesAreas";
import FindingHope from "../../../FindingHope";
import FindingInspiration from "../../../FindingInspiration";
import RevisitValues from "../../../RevisitValues";
import ValuesConflict from "../../../ValuesConflict";
import YouHaveWhatItTakes from "../../../YouHaveWhatItTakes";
import TheySeeYourStrengths from "../../../TheySeeYourStrengths";
import BuildOnYourStrengths from "../../../BuildOnYourStrengths";
import FamilyStrengths from "../../../FamilyStrengths";
import type { StepConfig } from "../../../types/motivation";

export const strengthSteps: StepConfig[] = [
  {
    id: 35,
    title: "Past Successes",
    description: "Reflect on small changes you've made",
    component: (onComplete) => <PastSuccessesAreas onComplete={onComplete} />
  },
  {
    id: 36,
    title: "Finding Hope",
    description: "Explore what gives you hope for change",
    component: (onComplete) => <FindingHope onComplete={onComplete} />
  },
  {
    id: 37,
    title: "Finding Inspiration",
    description: "Finding sources of inspiration",
    component: (onComplete) => <FindingInspiration onComplete={onComplete} />
  },
  {
    id: 38,
    title: "Revisit Values",
    description: "Reassess your prioritized values",
    component: (onComplete) => <RevisitValues onComplete={onComplete} />
  },
  {
    id: 39,
    title: "Values Conflict",
    description: "Explore values prioritization conflicts",
    component: (onComplete) => <ValuesConflict onComplete={onComplete} />
  },
  {
    id: 40,
    title: "You Have What It Takes",
    description: "Identify your personal strengths",
    component: (onComplete) => <YouHaveWhatItTakes onComplete={onComplete} />
  },
  {
    id: 41,
    title: "They See Your Strengths",
    description: "Collect feedback on your strengths from others",
    component: (onComplete) => <TheySeeYourStrengths onComplete={onComplete} />
  },
  {
    id: 42,
    title: "Build on Your Strengths",
    description: "Apply your strengths to achieve your goals",
    component: (onComplete) => <BuildOnYourStrengths onComplete={onComplete} />
  },
  {
    id: 52,
    title: "Family Strengths",
    description: "Leverage your family strengths",
    component: (onComplete) => <FamilyStrengths onComplete={onComplete} />
  }
];
