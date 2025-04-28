
import React from 'react';
import PastSuccessesAreas from "../../../PastSuccessesAreas";
import FindingHope from "../../../FindingHope";
import FindingInspiration from "../../../FindingInspiration";
import RevisitValues from "../../../RevisitValues";
import ValuesConflict from "../../../ValuesConflict";
import YouHaveWhatItTakes from "../../../YouHaveWhatItTakes";
import TheySeeTourStrengths from "../../../TheySeeTourStrengths";
import BuildOnYourStrengths from "../../../BuildOnYourStrengths";
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
    component: (onComplete) => <TheySeeTourStrengths onComplete={onComplete} />
  },
  {
    id: 42,
    title: "Build on Your Strengths",
    description: "Apply your strengths to achieve your goals",
    component: (onComplete) => {
      // When this step is completed, we'll mark it and also mark step 43 (removed Managing Stress)
      // and advance to step 44 (Identifying Your Type of Stress)
      const handleCompletion = async () => {
        if (onComplete) {
          onComplete();
          
          // Skip to step 44 by updating the URL
          setTimeout(() => {
            // Force a page refresh to update the current step in the journey
            window.location.reload();
          }, 500);
        }
      };
      
      return <BuildOnYourStrengths onComplete={handleCompletion} />;
    }
  }
];
