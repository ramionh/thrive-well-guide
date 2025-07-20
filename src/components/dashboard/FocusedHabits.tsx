
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Habit {
  id: string;
  name: string;
  description: string;
}

interface FocusedHabitsProps {
  habits: Habit[];
}

const FocusedHabits: React.FC<FocusedHabitsProps> = ({ habits }) => {
  if (!habits || habits.length === 0) return null;

  return (
    <div className="mb-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Focused Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <div key={habit.id} className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">{habit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusedHabits;
