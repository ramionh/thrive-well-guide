
import React from "react";
import MakingYourGoalMeasurable from "./MakingYourGoalMeasurable";

interface MakingGoalMeasurableProps {
  onComplete?: () => void;
}

// This component is a simple wrapper around MakingYourGoalMeasurable
// to maintain backward compatibility with imports
const MakingGoalMeasurable: React.FC<MakingGoalMeasurableProps> = ({ onComplete }) => {
  return <MakingYourGoalMeasurable onComplete={onComplete} />;
};

export default MakingGoalMeasurable;
