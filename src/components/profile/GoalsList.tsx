
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "@/types/user";
import { format, differenceInDays } from "date-fns";
import CreateGoalDialog from "@/components/goals/CreateGoalDialog";
import { useUser } from "@/context/UserContext";

interface GoalsListProps {
  goals: Goal[];
}

const GoalsList: React.FC<GoalsListProps> = ({ goals }) => {
  const { user } = useUser();
  
  // Function to refresh goals after creating a new one
  const handleGoalCreated = () => {
    // Since goals are managed by the UserContext, it will update automatically
    // when the database changes
  };

  const currentBodyTypeId = goals.length > 0 ? goals[0].currentBodyTypeId : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Track your body transformation journey</CardDescription>
        </div>
        {user && currentBodyTypeId && (
          <CreateGoalDialog
            userId={user.id}
            currentBodyTypeId={currentBodyTypeId}
            onGoalCreated={handleGoalCreated}
          />
        )}
      </CardHeader>
      <CardContent>
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => {
              const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
              
              return (
                <div key={goal.id} className="border rounded-md p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Body Transformation Goal</h3>
                      <span className="text-sm text-muted-foreground">
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Goal completed'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Started: {format(new Date(goal.startedDate), 'PPP')}</p>
                      <p>Target: {format(new Date(goal.targetDate), 'PPP')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
