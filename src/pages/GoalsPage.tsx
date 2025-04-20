
import React from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const GoalsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Track your body transformation journey</p>
        </div>
        
        <Button
          onClick={() => navigate("/body-type")}
        >
          Body Type Selection
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About Transformation Goals</CardTitle>
          <CardDescription>Goals are automatically created based on your body type selection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">
                  Your transformation goals are assigned by the system when you select your current and goal body types.
                  Each goal represents a 100-day journey to transform your body. Progress is tracked automatically based
                  on your check-ins and activity.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Transformation Goals</CardTitle>
          <CardDescription>Track your body transformation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Goal</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Days Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.goals && user.goals.length > 0 ? (
                user.goals.map((goal) => {
                  const totalDays = differenceInDays(new Date(goal.targetDate), new Date(goal.startedDate));
                  const daysPassed = differenceInDays(new Date(), new Date(goal.startedDate));
                  const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
                  const daysRemaining = differenceInDays(new Date(goal.targetDate), new Date());
                  
                  return (
                    <TableRow key={goal.id}>
                      <TableCell>Body Transformation</TableCell>
                      <TableCell>{format(new Date(goal.startedDate), 'PP')}</TableCell>
                      <TableCell>{format(new Date(goal.targetDate), 'PP')}</TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <Progress value={progressPercent} className="h-2" />
                          <span className="text-xs text-muted-foreground mt-1 inline-block">
                            {Math.round(progressPercent)}% complete
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{daysRemaining > 0 ? `${daysRemaining} days` : 'Completed'}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    You don't have any active transformation goals yet.
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        onClick={() => navigate("/body-type")}
                      >
                        Set Body Type Goals
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsPage;
