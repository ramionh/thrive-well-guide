import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface SelfObservationProps {
  onComplete?: () => void;
}

interface Observation {
  when: string;
  happening: string;
}

const SelfObservation: React.FC<SelfObservationProps> = ({ onComplete }) => {
  const [observations, setObservations] = useState<Observation[]>(Array(5).fill({ when: "", happening: "" }));

  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_self_observation",
    initialState: {
      observations: []
    },
    onSuccess: onComplete
  });

  // Load saved observations when data is fetched
  React.useEffect(() => {
    if (formData && Array.isArray(formData.observations) && formData.observations.length > 0) {
      // Keep at least 5 rows
      const savedObservations = [...formData.observations];
      
      while (savedObservations.length < 5) {
        savedObservations.push({ when: "", happening: "" });
      }
      
      setObservations(savedObservations);
    }
  }, [formData]);

  const handleInputChange = (index: number, field: keyof Observation, value: string) => {
    const updatedObservations = [...observations];
    updatedObservations[index] = { 
      ...updatedObservations[index], 
      [field]: value 
    };
    setObservations(updatedObservations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty observations
    const filteredObservations = observations.filter(
      obs => obs.when.trim() !== "" || obs.happening.trim() !== ""
    );
    updateForm("observations", filteredObservations);
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Self-Observation</h2>
        
        <div className="space-y-5">
          <p className="text-gray-700">
            As you are working on creating your own specific, detailed plan of action, for at least one week keep a daily journal of observations about the behavior you'd like to change. This is also helpful when you notice you are struggling to put your plan into action. It will give you greater insight into your lifestyle and habits, and you might find patterns you can alter. For example, you may notice that the later in the day it gets, the less motivated you feel to exercise.
          </p>
          
          <p className="text-gray-700">
            This activity can help you strengthen your plan by making you more aware of what is working in your current life and what is not.
          </p>
          
          <p className="text-gray-700 mb-4">
            Each day, write down some observations about your day, then answer these questions:
          </p>

          <form onSubmit={handleSubmit}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">WHEN DO YOU ENGAGE IN THE BEHAVIOR OR SITUATION?</TableHead>
                  <TableHead className="font-semibold">WHAT IS HAPPENING AROUND YOU AND INSIDE YOU?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {observations.map((observation, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-2">
                      <Input
                        value={observation.when}
                        onChange={(e) => handleInputChange(index, "when", e.target.value)}
                        placeholder={index === 0 ? "I find myself feeling tired and unmotivated to work out after work." : ""}
                        className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        value={observation.happening}
                        onChange={(e) => handleInputChange(index, "happening", e.target.value)}
                        placeholder={index === 0 ? "Often I'm sitting down to 'rest for a minute' and end up scrolling through social media for an hour instead of changing into my workout clothes." : ""}
                        className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? "Saving..." : "Complete Step"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfObservation;
