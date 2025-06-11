
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, Target } from "lucide-react";

interface HabitsJourneyOptionsProps {
  onSelectOption: (option: 'existing' | 'repurpose' | 'core') => void;
}

const HabitsJourneyOptions: React.FC<HabitsJourneyOptionsProps> = ({ onSelectOption }) => {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Habit Journey Path</h1>
        <p className="text-lg text-gray-600">
          Start with the Core Optimal Habits survey, move to Learn your existing habits and finish with Repurpose your habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Learn Your Existing Habits</CardTitle>
            <CardDescription>
              Discover and understand the habits you already have in your daily routine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectOption('existing')}
              className="w-full"
              variant="outline"
            >
              Explore Existing Habits
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Repurpose Your Habits</CardTitle>
            <CardDescription>
              Transform existing habits to better align with your fitness goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectOption('repurpose')}
              className="w-full"
              variant="outline"
            >
              Repurpose Habits
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-500">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>Core Optimal Habits</CardTitle>
            <CardDescription>
              Learn the essential habits for achieving optimal fitness and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectOption('core')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Core Optimal Habits
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HabitsJourneyOptions;
