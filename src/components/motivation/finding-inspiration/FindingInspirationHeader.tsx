
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const FindingInspirationHeader: React.FC = () => {
  return (
    <CardHeader className="px-0">
      <div className="flex items-center gap-3 mb-1">
        <Lightbulb className="w-6 h-6 text-purple-600" />
        <CardTitle className="text-2xl font-bold text-purple-800">Finding Inspiration</CardTitle>
      </div>
    </CardHeader>
  );
};

export default FindingInspirationHeader;
