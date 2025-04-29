
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface IdentifyingStepsToGoalProps {
  onComplete?: () => void;
}

interface Action {
  text: string;
  rating: number;
}

// Define a parser for actions data
const parseActionsData = (data: any) => {
  console.log("Parsing actions data:", data);
  
  let actions: Action[] = Array(10).fill(0).map(() => ({ text: "", rating: 1 }));
  
  // Parse actions data
  if (data.actions) {
    if (Array.isArray(data.actions)) {
      // Data is already in array format
      actions = data.actions.length > 0 
        ? [...data.actions] 
        : actions;
    } else if (typeof data.actions === 'string') {
      try {
        const parsed = JSON.parse(data.actions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          actions = parsed;
        }
      } catch (e) {
        console.error("Error parsing actions JSON:", e);
      }
    }
    
    // Ensure we have exactly 10 entries
    if (actions.length < 10) {
      const remaining = 10 - actions.length;
      for (let i = 0; i < remaining; i++) {
        actions.push({ text: "", rating: 1 });
      }
    }
  }
  
  console.log("Parsed actions:", actions);
  return { actions };
};

const IdentifyingStepsToGoal: React.FC<IdentifyingStepsToGoalProps> = ({ onComplete }) => {
  const [actions, setActions] = useState<Action[]>(
    Array(10).fill(0).map(() => ({ text: "", rating: 1 }))
  );

  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData, 
    updateForm, 
    submitForm 
  } = useMotivationForm({
    tableName: "motivation_steps_to_goal",
    initialState: {
      actions: [] as Action[]
    },
    onSuccess: onComplete,
    parseData: parseActionsData
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    
    loadData();
  }, []);

  // Update local state when formData changes
  useEffect(() => {
    console.log("Form data updated for actions:", formData);
    if (formData && formData.actions) {
      if (Array.isArray(formData.actions) && formData.actions.length > 0) {
        setActions(formData.actions);
      }
    }
  }, [formData]);

  const handleActionChange = (index: number, value: string) => {
    const updatedActions = [...actions];
    updatedActions[index].text = value;
    setActions(updatedActions);
  };

  const handleRatingChange = (index: number, value: string) => {
    const updatedActions = [...actions];
    updatedActions[index].rating = parseInt(value);
    setActions(updatedActions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("actions", actions);
    submitForm();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Identifying the Steps to Reach Your Goal</h2>
              
              <p className="text-gray-600 mb-4">
                Writing a specific, measurable goal is the essential first step toward successful change. 
                The goal sets your destination, but it does not specify all the actions you are going to take 
                to reach that destination. Let's revisit our example goal: "I'd like to lose 10 pounds in the next eight weeks." 
                While this goal does a good job identifying the destination, it doesn't specify the actions needed to get there. 
                To figure that out, we need to brainstorm the steps that might help us lose 10 pounds over the next two months.
              </p>
              
              <p className="text-gray-600 mb-4">
                There are no right answers when you're brainstorming. You're simply trying to come up with 
                as many potential solutions as possible. They don't have to be perfect. You don't even have 
                to love the ideas. You might want to research before you brainstorm, or simply list some ideas 
                and research them later. The important thing is to let yourself think about all the ways you 
                might achieve your goal.
              </p>
              
              <p className="text-gray-600 mb-6">
                Here's what a brainstorm about losing 10 pounds in eight weeks might look like:
                <br/>1. Start a walking program
                <br/>2. Start a running program
                <br/>3. Join group fitness classes (Zumba, spinning, HIIT)
                <br/>4. Eat fewer carbohydrates
                <br/>5. Eat fewer fats
                <br/>6. Try a ketogenic diet
                <br/>7. Eat fewer calories
                <br/>8. Increase daily steps
                <br/>9. Do more active chores and housework
                <br/>10. Keep a daily food journal
              </p>
            </div>

            <div>
              <p className="text-purple-700 font-medium mb-4">
                Brainstorm a list of 10 actions you could take to reach your goal and write them below. 
                Rate each on a scale of 1 to 5. A score of 1 indicates you are unsure or unwilling to 
                take that action, while a score of 5 indicates you are confident you could take that action.
              </p>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80%]">ACTION</TableHead>
                      <TableHead className="w-[20%]">RATING</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actions.map((action, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={action.text}
                            onChange={(e) => handleActionChange(index, e.target.value)}
                            placeholder={`Action ${index + 1}`}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={action.rating.toString()}
                            onValueChange={(value) => handleRatingChange(index, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Rating" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(rating => (
                                <SelectItem key={rating} value={rating.toString()}>
                                  {rating}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentifyingStepsToGoal;
