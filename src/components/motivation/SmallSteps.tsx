
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SmallStepsProps {
  onComplete?: () => void;
}

interface SmallStep {
  objective: string;
  ideas: string;
}

const SmallSteps: React.FC<SmallStepsProps> = ({ onComplete }) => {
  const [smallSteps, setSmallSteps] = useState<SmallStep[]>([
    { objective: "I will limit myself to 1,800 calories a day.", ideas: "I will fill my fridge with healthy foods that are enjoyable and filling. I will decide what kinds of high-calorie foods I am willing to postpone eating for now." },
    { objective: "", ideas: "" },
    { objective: "", ideas: "" },
    { objective: "", ideas: "" }
  ]);

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_small_steps",
    initialState: {
      small_steps: []
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData && formData.small_steps && formData.small_steps.length > 0) {
      setSmallSteps(formData.small_steps);
    }
  }, [formData]);

  const handleObjectiveChange = (index: number, value: string) => {
    const updatedSteps = [...smallSteps];
    updatedSteps[index].objective = value;
    setSmallSteps(updatedSteps);
  };

  const handleIdeasChange = (index: number, value: string) => {
    const updatedSteps = [...smallSteps];
    updatedSteps[index].ideas = value;
    setSmallSteps(updatedSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty rows before saving
    const filteredSteps = smallSteps.filter(step => step.objective.trim() !== '' || step.ideas.trim() !== '');
    updateForm("small_steps", filteredSteps);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Small Steps</h2>

              <p className="text-gray-600 mb-6">
                Think about your SMART goal and objectives. Trying to introduce many big, new changes into your life 
                might mean setting yourself up for failure. Instead, try breaking down some of the larger steps into smaller ones.
              </p>

              <p className="text-gray-600 mb-6">
                What are some small steps you can take? Brainstorm ideas for little things you can start to do and 
                build on as you get more confident.
              </p>

              <div className="overflow-x-auto">
                <Table className="border border-purple-200 rounded-lg">
                  <TableHeader className="bg-purple-50">
                    <TableRow className="hover:bg-purple-100">
                      <TableHead className="w-1/3 font-semibold text-purple-800">OBJECTIVE</TableHead>
                      <TableHead className="w-2/3 font-semibold text-purple-800">IDEAS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smallSteps.map((step, index) => (
                      <TableRow key={index} className="hover:bg-purple-50">
                        <TableCell className="align-top">
                          <Input
                            value={step.objective}
                            onChange={(e) => handleObjectiveChange(index, e.target.value)}
                            placeholder="Enter your objective"
                            className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={step.ideas}
                            onChange={(e) => handleIdeasChange(index, e.target.value)}
                            placeholder="Enter your ideas for small steps"
                            className="min-h-[6rem] resize-none border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                          />
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

export default SmallSteps;
