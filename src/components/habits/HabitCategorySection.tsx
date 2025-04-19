
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Habit } from '@/types/habit';

interface HabitCategorySectionProps {
  category: string;
  description: string;
  habits: Habit[];
}

const HabitCategorySection = ({ category, description, habits }: HabitCategorySectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {category.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
        </CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="font-medium mb-2">
                {habit.habit_number}. {habit.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {habit.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCategorySection;
