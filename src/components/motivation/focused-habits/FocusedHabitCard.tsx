
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
    className={`p-4 cursor-pointer transition-all 
      ${isFocused 
        ? 'border-2 border-green-500 bg-green-50' 
        : 'hover:bg-gray-100'
      }`}
    onClick={() => onSelect(habit.id)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{habit.name}</h3>
        <p className="text-sm text-gray-500">{habit.description}</p>
      </div>
      {isFocused && (
        <CheckCircle className="text-green-500" />
      )}
    </div>
  </Card>
);

export default FocusedHabitCard;
