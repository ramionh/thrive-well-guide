
import React from "react";
import { Card } from "@/components/ui/card";

interface CoreValuesProps {
  values: {
    selected_value_1: string;
    selected_value_2: string;
  };
}

const CoreValues: React.FC<CoreValuesProps> = ({ values }) => {
  return (
    <Card className="shadow-sm mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Core Values</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <span className="text-purple-800">{values.selected_value_1}</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <span className="text-purple-800">{values.selected_value_2}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CoreValues;
