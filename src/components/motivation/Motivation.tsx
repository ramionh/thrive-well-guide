import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ambivalence from "./Ambivalence";
import FocusedHabitsSelector from "./focused-habits/FocusedHabitsSelector";
import InternalObstacles from "./InternalObstacles";
import Attitude from "./Attitude";
import Behaviors from "./Behaviors";
import Knowledge from "./Knowledge";
import SocialNetwork from "./SocialNetwork";
import CulturalObstacles from "./CulturalObstacles";
import MotivationSplash from "./MotivationSplash";
import MotivationStepsSidebar from "./MotivationStepsSidebar";
import EnvironmentalStressors from "./EnvironmentalStressors";
import IdentifyingAmbivalence from "./IdentifyingAmbivalence";
import { useMotivationSteps } from "@/hooks/useMotivationSteps";
import AddressingAmbivalence from "./AddressingAmbivalence";
import ExternalObstacles from "./ExternalObstacles";
import ThinkingAssertively from "./ThinkingAssertively";
import ExploringValues from "./ExploringValues";
import ClarifyingValues from "./ClarifyingValues";
import ExceptionsToRule from "./ExceptionsToRule";

const Motivation = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  const { steps, currentStepId, currentStep, handleStepClick, markStepComplete } = useMotivationSteps([
    {
      id: 1,
      title: "Ambivalence",
      description: "Understanding mixed feelings about change",
      component: <Ambivalence onComplete={() => markStepComplete(1)} />,
      completed: false,
    },
    {
      id: 2,
      title: "Focus Habits",
      description: "Select your key transformation habits",
      component: <FocusedHabitsSelector onComplete={() => markStepComplete(2)} />,
      completed: false,
    },
    {
      id: 3,
      title: "Internal Obstacles",
      description: "Identify your internal barriers",
      component: <InternalObstacles onComplete={() => markStepComplete(3)} />,
      completed: false,
    },
    {
      id: 4,
      title: "Attitude Check",
      description: "Assess your attitude towards your goal",
      component: <Attitude onComplete={() => markStepComplete(4)} />,
      completed: false,
    },
    {
      id: 5,
      title: "Behaviors",
      description: "Identify behaviors that may hold you back",
      component: <Behaviors onComplete={() => markStepComplete(5)} />,
      completed: false,
    },
    {
      id: 6,
      title: "Knowledge Gaps",
      description: "Identify areas of uncertainty",
      component: <Knowledge onComplete={() => markStepComplete(6)} />,
      completed: false,
    },
    {
      id: 7,
      title: "Social Network",
      description: "Evaluate your support system",
      component: <SocialNetwork onComplete={() => markStepComplete(7)} />,
      completed: false,
    },
    {
      id: 8,
      title: "Cultural Obstacles",
      description: "Identify cultural barriers to change",
      component: <CulturalObstacles onComplete={() => markStepComplete(8)} />,
      completed: false,
    },
    {
      id: 9,
      title: "Environmental Stressors",
      description: "Identify environmental barriers",
      component: <EnvironmentalStressors onComplete={() => markStepComplete(9)} />,
      completed: false,
    },
    {
      id: 10,
      title: "Identifying Ambivalence",
      description: "Explore your mixed feelings about change",
      component: <IdentifyingAmbivalence onComplete={() => markStepComplete(10)} />,
      completed: false,
    },
    {
      id: 11,
      title: "Addressing Ambivalence",
      description: "Develop strategies for managing emotions",
      component: <AddressingAmbivalence onComplete={() => markStepComplete(11)} />,
      completed: false,
    },
    {
      id: 12,
      title: "External Obstacles",
      description: "Identify and solve external barriers to your goal",
      component: <ExternalObstacles onComplete={() => markStepComplete(12)} />,
      completed: false,
    },
    {
      id: 13,
      title: "Thinking Assertively",
      description: "Develop assertiveness skills",
      component: <ThinkingAssertively onComplete={() => markStepComplete(13)} />,
      completed: false,
    },
    {
      id: 14,
      title: "Exploring Values",
      description: "Identify and prioritize your core values",
      component: <ExploringValues onComplete={() => markStepComplete(14)} />,
      completed: false,
    },
    {
      id: 15,
      title: "Clarifying Values",
      description: "Define and align your core values",
      component: <ClarifyingValues onComplete={() => markStepComplete(15)} />,
      completed: false,
    },
    {
      id: 16,
      title: "Exceptions to the Rule",
      description: "Document your success in overcoming obstacles",
      component: <ExceptionsToRule onComplete={() => markStepComplete(16)} />,
      completed: false,
    }
  ]);

  if (showSplash) {
    return <MotivationSplash onContinue={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <MotivationStepsSidebar
        steps={steps}
        currentStepId={currentStepId}
        onStepClick={handleStepClick}
      />
      
      <div className="md:w-3/4">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">{currentStep?.title}</h2>
            {currentStep?.component}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Motivation;
