
import React from "react";

interface PrioritizingChangeDescriptionProps {
  goalDescription?: string;
}

const PrioritizingChangeDescription: React.FC<PrioritizingChangeDescriptionProps> = ({ 
  goalDescription 
}) => {
  return (
    <>
      {goalDescription && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-purple-700 text-sm font-medium">Your Goal</p>
          <p className="text-purple-900">{goalDescription}</p>
        </div>
      )}
      
      <p className="text-gray-600 mb-6">
        What are some activities you plan on doing that will help you achieve your goal? 
        (These are activities or tasks you did not list in the previous step.)
      </p>
    </>
  );
};

export default PrioritizingChangeDescription;
