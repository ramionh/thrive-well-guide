
import React from "react";
import { Building } from "lucide-react";

const ResourceDevelopmentHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Building className="w-6 h-6 text-purple-600" />
      <h2 className="text-xl font-bold text-purple-800">Resource Development</h2>
    </div>
  );
};

export default ResourceDevelopmentHeader;
