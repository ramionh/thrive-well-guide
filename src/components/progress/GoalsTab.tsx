
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressTabLayout from "./ProgressTabLayout";
import { useUser } from "@/context/UserContext";

interface GoalsTabProps {
  selectedGoal: string;
  setSelectedGoal: (value: string) => void;
  goalProgress: string;
  setGoalProgress: (value: string) => void;
  goalsAdherence: "red" | "yellow" | "green";
  setGoalsAdherence: (value: "red" | "yellow" | "green") => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
  selectedGoal,
  setSelectedGoal,
  goalProgress,
  setGoalProgress,
  goalsAdherence,
  setGoalsAdherence,
}) => {
  const { user } = useUser();

  return (
    <ProgressTabLayout
      title="Update Goal Progress"
      description="Track your progress towards your goals"
      adherenceValue={goalsAdherence}
      onAdherenceChange={setGoalsAdherence}
      adherenceLabel="Overall Goals Adherence"
    >
      <div className="space-y-2">
        <Label htmlFor="goalSelect">Select Goal</Label>
        <Select value={selectedGoal} onValueChange={setSelectedGoal}>
          <SelectTrigger id="goalSelect">
            <SelectValue placeholder="Select a goal to update" />
          </SelectTrigger>
          <SelectContent>
            {user?.goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.name} ({goal.targetValue} {goal.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedGoal && (
        <div className="space-y-2">
          <Label htmlFor="goalProgress">Current Progress</Label>
          <div className="flex space-x-2">
            <Input 
              id="goalProgress"
              type="number"
              min="0"
              value={goalProgress}
              onChange={(e) => setGoalProgress(e.target.value)}
            />
            <span className="flex items-center">
              {user?.goals.find(g => g.id === selectedGoal)?.unit}
            </span>
          </div>
        </div>
      )}
    </ProgressTabLayout>
  );
};

export default GoalsTab;

