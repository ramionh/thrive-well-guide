
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ExcuseProps {
  excuse: string;
  index: number;
  onChange: (index: number, value: string) => void;
}

const ExcuseInput: React.FC<ExcuseProps> = ({ excuse, index, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-purple-700 mb-1">
        Excuse {index + 1}
      </label>
      <Textarea
        value={excuse}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Enter excuse ${index + 1}`}
        className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
      />
    </div>
  );
};

interface ObstaclesFormProps {
  goal?: { title: string } | null;
  excuses: string[];
  isStepCompleted: boolean;
  onExcuseChange: (index: number, value: string) => void;
  onSave: () => void;
}

const ObstaclesForm: React.FC<ObstaclesFormProps> = ({
  goal,
  excuses,
  isStepCompleted,
  onExcuseChange,
  onSave
}) => {
  const hasAtLeastOneExcuse = excuses.some(e => e.trim() !== '');

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-300">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Identify Your Internal Obstacles</h2>
        
        <div className="mb-6">
          <p className="text-purple-900/80 mb-4">
            What thoughts might get in the way of achieving your goal:
            <span className="font-medium text-purple-700"> {goal?.title || "your fitness goal"}</span>?
          </p>
          <p className="text-purple-900/80 mb-4">
            List at least one but up to five excuses, rationalizations, or other things you tell yourself
            that might prevent you from reaching your goal or changing your behavior.
          </p>
        </div>

        {excuses.map((excuse, index) => (
          <ExcuseInput
            key={index}
            excuse={excuse}
            index={index}
            onChange={onExcuseChange}
          />
        ))}

        <Button
          onClick={onSave}
          disabled={!hasAtLeastOneExcuse}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isStepCompleted ? "Update Your Responses" : "Complete This Step"}
        </Button>
      </div>
    </Card>
  );
};

export default ObstaclesForm;
