
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface HelpfulIdeasProps {
  onComplete?: () => void;
}

interface HelpfulIdea {
  idea: string;
  rank: number;
}

const HelpfulIdeas: React.FC<HelpfulIdeasProps> = ({ onComplete }) => {
  const [ideas, setIdeas] = useState<HelpfulIdea[]>([
    { idea: "", rank: 1 },
    { idea: "", rank: 2 },
    { idea: "", rank: 3 },
    { idea: "", rank: 4 },
    { idea: "", rank: 5 },
    { idea: "", rank: 6 },
  ]);

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_helpful_ideas",
    initialState: {
      helpful_ideas: []
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData && Array.isArray(formData.helpful_ideas) && formData.helpful_ideas.length > 0) {
      // Fill the existing ideas, ensuring we have at least 6 rows
      const savedIdeas = [...formData.helpful_ideas];
      
      while (savedIdeas.length < 6) {
        savedIdeas.push({ idea: "", rank: savedIdeas.length + 1 });
      }
      
      setIdeas(savedIdeas);
    }
  }, [formData]);

  const handleIdeaChange = (index: number, value: string) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index] = { ...updatedIdeas[index], idea: value };
    setIdeas(updatedIdeas);
  };

  const handleRankChange = (index: number, value: string) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index] = { ...updatedIdeas[index], rank: parseInt(value, 10) };
    setIdeas(updatedIdeas);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty ideas
    const filteredIdeas = ideas.filter(item => item.idea.trim() !== "");
    updateForm("helpful_ideas", filteredIdeas);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Helpful Ideas</h2>
              
              <p className="text-gray-600 mb-6">
                Write down any skills, techniques, or other ideas you've gained from the exercises in this journey that appeal to you. 
                Rank them in order from most to least helpful. The most helpful ideas are likely those you feel most confident about 
                or those you think have the potential for the biggest benefit.
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">SKILL, TECHNIQUE, OR IDEA</TableHead>
                    <TableHead className="font-semibold w-24 text-center">RANK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ideas.map((idea, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={idea.idea}
                          onChange={(e) => handleIdeaChange(index, e.target.value)}
                          placeholder={index === 0 ? "Mindfulness (taking time each day to clear my mind and set fitness intentions)" : 
                                      index === 1 ? "Small steps" : 
                                      index === 2 ? "Inspiration (making a vision board)" : ""}
                          className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={idea.rank.toString()}
                          onValueChange={(value) => handleRankChange(index, value)}
                        >
                          <SelectTrigger className="w-16 mx-auto">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
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

export default HelpfulIdeas;
