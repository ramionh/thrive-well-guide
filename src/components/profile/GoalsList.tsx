
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "@/context/UserContext";

interface GoalsListProps {
  goals: Goal[];
}

const GoalsList: React.FC<GoalsListProps> = ({ goals }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Goals</CardTitle>
        <CardDescription>What you're working towards</CardDescription>
      </CardHeader>
      <CardContent>
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Target: {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                  <div className="text-sm px-2 py-1 rounded-full bg-thrive-blue/10 text-thrive-blue">
                    {goal.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You don't have any goals set yet. Head to the dashboard to add some!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsList;
