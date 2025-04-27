
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Goal {
  current_body_type?: { name: string };
  goal_body_type?: { name: string };
}

interface ObstaclesFormProps {
  goal: Goal | null;
  excuses: string[];
  isStepCompleted: boolean;
  onExcuseChange: (index: number, value: string) => void;
  onSave: () => void;
}

const ObstaclesForm = ({ 
  goal,
  excuses, 
  isStepCompleted,
  onExcuseChange,
  onSave
}: ObstaclesFormProps) => {
  return (
    <Card className="p-6 bg-purple-50 border-2 border-purple-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Let's take a look at the negative messages relating to your goal.</h2>
      
      {goal && (
        <div className="mb-6 p-4 bg-purple-100/50 rounded-lg border border-purple-200">
          <p className="font-semibold text-purple-800">Your Goal:</p>
          <p className="text-purple-700">Transform from {goal.current_body_type?.name || 'Current'} to {goal.goal_body_type?.name || 'Goal'}</p>
        </div>
      )}

      <p className="mb-6 text-lg text-purple-700">
        As you look at your goal, think of up to five reasons, rationalizations, 
        or excuses for not taking action and write them below.
      </p>

      <div className="space-y-4">
        {excuses.map((excuse, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={`excuse-${index}`} className="text-purple-800">Excuse {index + 1}</Label>
            <Input
              id={`excuse-${index}`}
              value={excuse}
              onChange={(e) => onExcuseChange(index, e.target.value)}
              placeholder={`Enter excuse ${index + 1}`}
              className="bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={onSave}
        className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
        disabled={isStepCompleted}
      >
        {isStepCompleted ? "Completed" : "Complete This Step"}
      </Button>
    </Card>
  );
};

export default ObstaclesForm;
