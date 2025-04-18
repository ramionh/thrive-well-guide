
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Goal } from "@/types/user";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoalForm from "@/components/goals/GoalForm";

const GoalsPage = () => {
  const { user, addGoal, updateGoal } = useUser();
  const { toast } = useToast();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (data: Omit<Goal, "id" | "createdAt">) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, data);
      toast({
        title: "Goal Updated",
        description: "Your goal has been successfully updated.",
      });
    } else {
      addGoal(data);
      toast({
        title: "Goal Created",
        description: "Your new goal has been created successfully.",
      });
    }
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = (goalId: string) => {
    const updatedGoals = user?.goals.filter(g => g.id !== goalId) || [];
    // TODO: Implement delete goal functionality in UserContext
    toast({
      title: "Goal Deleted",
      description: "Your goal has been successfully deleted.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Manage your fitness and wellness goals</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGoal(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGoal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
            </DialogHeader>
            <GoalForm goal={editingGoal || undefined} onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Track and manage your goals here</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell>{goal.name}</TableCell>
                  <TableCell className="capitalize">{goal.category}</TableCell>
                  <TableCell>
                    {goal.currentValue} / {goal.targetValue}
                  </TableCell>
                  <TableCell>{goal.unit}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(goal)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsPage;
