
import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Moon, Apple } from "lucide-react";

const GoalProgress: React.FC = () => {
  const { user } = useUser();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sleep":
        return <Moon className="h-4 w-4 text-thrive-blue" />;
      case "nutrition":
        return <Apple className="h-4 w-4 text-thrive-orange" />;
      case "exercise":
        return <Dumbbell className="h-4 w-4 text-thrive-teal" />;
      default:
        return null;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sleep":
        return "bg-thrive-blue";
      case "nutrition":
        return "bg-thrive-orange";
      case "exercise":
        return "bg-thrive-teal";
      default:
        return "bg-gray-500";
    }
  };
  
  // If no goals, show empty state
  if (!user?.goals || user.goals.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          You don't have any goals set yet. Add goals to track your progress.
        </p>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {user.goals.map((goal) => {
        const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
        
        return (
          <Card key={goal.id} className="overflow-hidden card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${getCategoryColor(goal.category)}/10`}>
                  {getCategoryIcon(goal.category)}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">{goal.name}</h3>
                  <div className="mt-2">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>
                      {goal.currentValue} of {goal.targetValue} {goal.unit}
                    </span>
                    <span>{progressPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalProgress;
