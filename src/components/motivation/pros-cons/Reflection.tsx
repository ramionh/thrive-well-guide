
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ReflectionProps {
  onComplete?: () => void;
}

const Reflection: React.FC<ReflectionProps> = ({ onComplete }) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Reflect on Your List</h3>
      <p className="mb-6">
        Looking at your pros and cons, how do they influence your decision to
        change? Consider which reasons for change (pros) are most important to you,
        and which barriers (cons) you'll need to overcome.
      </p>
      
      {onComplete && (
        <Button 
          onClick={onComplete}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Complete This Step
        </Button>
      )}
    </Card>
  );
};

export default Reflection;
