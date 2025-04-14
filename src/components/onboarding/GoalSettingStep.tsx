
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface GoalSettingStepProps {
  onNext: () => void;
}

const GoalSettingStep: React.FC<GoalSettingStepProps> = ({ onNext }) => {
  const { addGoal, user } = useUser();
  const { toast } = useToast();
  
  const [goalName, setGoalName] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState<"sleep" | "nutrition" | "exercise" | "other">("sleep");
  
  const handleAddGoal = () => {
    if (!goalName || !targetValue || !unit) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to add a goal.",
        variant: "destructive"
      });
      return;
    }
    
    addGoal({
      name: goalName,
      targetValue: parseFloat(targetValue),
      currentValue: 0,
      unit,
      category,
    });
    
    // Reset form
    setGoalName("");
    setTargetValue("");
    setUnit("");
    
    toast({
      title: "Goal added",
      description: "Your goal has been added successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goalName">Goal Name</Label>
          <Input 
            id="goalName" 
            placeholder="e.g., Sleep longer, Drink more water" 
            value={goalName} 
            onChange={(e) => setGoalName(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as any)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sleep">Sleep</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="exercise">Exercise</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value</Label>
            <Input 
              id="targetValue" 
              type="number" 
              placeholder="e.g., 8, 2000" 
              value={targetValue} 
              onChange={(e) => setTargetValue(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input 
              id="unit" 
              placeholder="e.g., hours, steps" 
              value={unit} 
              onChange={(e) => setUnit(e.target.value)} 
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={handleAddGoal}
          className="w-full bg-thrive-blue hover:bg-thrive-blue/90 flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>
      
      {user?.goals && user.goals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Your Goals:</h3>
          <div className="space-y-2">
            {user.goals.map((goal) => (
              <Card key={goal.id} className="p-2 bg-muted/50">
                <CardContent className="p-2 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Target: {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-thrive-teal text-white">
                    {goal.category}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        type="button" 
        onClick={onNext}
        className="w-full bg-thrive-green"
      >
        Continue
      </Button>
    </div>
  );
};

export default GoalSettingStep;
