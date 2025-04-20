
import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Moon, Apple, Target } from "lucide-react";
import { format, differenceInDays } from "date-fns";

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
        return <Target className="h-4 w-4 text-thrive-teal" />;
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
        return "bg-blue-500";
    }
  };
  
  // If no goals, show empty state
  if (!user?.goals || user.goals.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          You don't have any transformation goals set yet.
        </p>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {user.goals.map((goal) => {
        // Calculate progress as percentage of time passed
        const totalDays = differenceInDays(new Date(goal.targetDate), new Date(goal.startedDate));
        const daysPassed = differenceInDays(new Date(), new Date(goal.startedDate));
        const progressPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
        const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
        
        return (
          <Card key={goal.id} className="overflow-hidden card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full bg-blue-500/10`}>
                  {getCategoryIcon(goal.category || "other")}
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-medium">Body Transformation Goal</h3>
                  <div className="mt-2">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>
                      Started: {format(new Date(goal.startedDate), 'PP')}
                    </span>
                    <span>{daysRemaining} days remaining</span>
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
