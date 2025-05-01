
import React from "react";
import { List } from "lucide-react";

const PrioritizingChangeHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <List className="w-6 h-6 text-purple-600" />
      <h2 className="text-xl font-bold text-purple-800">Prioritizing the Change</h2>
    </div>
  );
};

export default PrioritizingChangeHeader;
