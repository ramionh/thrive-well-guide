
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Habit } from '@/types/habit';

interface FocusedHabitCardProps {
  habit: Habit;
  isFocused: boolean;
  onSelect: (habitId: string) => void;
}

const FocusedHabitCard = ({ habit, isFocused, onSelect }: FocusedHabitCardProps) => (
  <Card 
    className={`p-4 cursor-pointer transition-all bg-white
      ${isFocused 
        ? 'border-2 border-purple-500' 
        : 'hover:bg-purple-50 border border-purple-200'
      }`}
    onClick={() => onSelect(habit.id)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-purple-800">{habit.name}</h3>
        <p className="text-sm text-purple-600">{habit.description}</p>
      </div>
      {isFocused && (
        <CheckCircle className="text-purple-500" />
      )}
    </div>
  </Card>
);

export default FocusedHabitCard;
