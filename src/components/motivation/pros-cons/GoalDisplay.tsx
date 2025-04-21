
import React from "react";

interface GoalDisplayProps {
  goal: string | null;
}

const GoalDisplay = ({ goal }: GoalDisplayProps) => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
    <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Fitness Goal</h3>
    <p className="text-gray-700">{goal || "No specific goal defined yet"}</p>
  </div>
);

export default GoalDisplay;
