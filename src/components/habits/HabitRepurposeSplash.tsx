
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

interface HabitRepurposeSplashProps {
  onGetStarted: () => void;
}

const HabitRepurposeSplash: React.FC<HabitRepurposeSplashProps> = ({ onGetStarted }) => {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card className="text-center">
        <CardContent className="p-12 space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <RotateCcw className="h-8 w-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Habit Repurpose
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
            Lasting change is a skill. This short guide will walk you through an evidence-based plan to understand your old habits and build new ones that stick.
          </p>
          
          <div className="pt-6">
            <Button 
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full max-w-xs"
            >
              Let's Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitRepurposeSplash;
