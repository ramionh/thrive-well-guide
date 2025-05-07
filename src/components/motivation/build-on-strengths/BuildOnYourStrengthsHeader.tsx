
import React from 'react';
import { Dumbbell } from "lucide-react";

const BuildOnYourStrengthsHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <Dumbbell className="h-5 w-5 text-purple-600" />
      <h2 className="text-xl font-semibold text-purple-800">Build on Your Strengths</h2>
    </div>
  );
};

export default BuildOnYourStrengthsHeader;
