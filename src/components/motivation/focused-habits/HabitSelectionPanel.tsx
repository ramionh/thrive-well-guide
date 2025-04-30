
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FocusedHabitCard from './FocusedHabitCard';
import { Habit } from '@/types/habit';

interface HabitSelectionPanelProps {
  habits: Habit[] | undefined;
  focusedHabits: string[] | undefined;
  onHabitSelect: (habitId: string) => void;
  onComplete: () => void;
}

const HabitSelectionPanel = ({
  habits,
  focusedHabits,
  onHabitSelect,
  onComplete,
}: HabitSelectionPanelProps) => {
  return (
    <Card className="p-6 bg-white border-purple-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">What are my concerns?</h2>
      <div className="prose mb-6">
        <p className="mb-4 text-purple-600">
          You might have a general idea that you need to change one aspect of
          your fitness but are unsure what the change should be. You
          don't have to address all the following topics, as we have plenty of
          time to narrow things down later.
        </p>
        <p className="font-semibold mb-6 text-purple-700">
          Pick one or two core habits to focus on:
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {habits?.map((habit) => (
          <FocusedHabitCard
            key={habit.id}
            habit={habit}
            isFocused={focusedHabits?.includes(habit.id)}
            onSelect={onHabitSelect}
          />
        ))}
      </div>

      <Button 
        onClick={onComplete}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
      >
        Complete This Step
      </Button>
    </Card>
  );
};

export default HabitSelectionPanel;
