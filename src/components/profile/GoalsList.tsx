
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "@/types/user";
import { format } from "date-fns";

interface GoalsListProps {
  goals: Goal[];
}

const GoalsList: React.FC<GoalsListProps> = ({ goals }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Goals</CardTitle>
        <CardDescription>Track your body transformation journey</CardDescription>
      </CardHeader>
      <CardContent>
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-md p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Body Transformation Goal</h3>
                    <span className="text-sm text-muted-foreground">
                      {Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Started: {format(new Date(goal.startedDate), 'PPP')}</p>
                    <p>Target: {format(new Date(goal.targetDate), 'PPP')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You don't have any active transformation goals yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsList;
