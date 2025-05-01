
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const TimeManagementHeader: React.FC = () => {
  return (
    <CardHeader className="px-0">
      <div className="flex items-center gap-3 mb-1">
        <Clock className="w-6 h-6 text-purple-600" />
        <CardTitle className="text-2xl font-bold text-purple-800">Time Management and Personal Structure</CardTitle>
      </div>
    </CardHeader>
  );
};

export default TimeManagementHeader;
