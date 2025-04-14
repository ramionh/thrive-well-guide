
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MotivationalInterviewStepProps {
  onNext: () => void;
}

const MotivationalInterviewStep: React.FC<MotivationalInterviewStepProps> = ({ onNext }) => {
  const { saveMotivationalResponse, motivationalResponses } = useUser();
  const [activeTab, setActiveTab] = useState("sleep");
  
  const handleSaveResponse = (category: string, response: string) => {
    saveMotivationalResponse(category, response);
  };
  
  const handleNext = () => {
    // Check if at least one response has been provided
    if (Object.keys(motivationalResponses).length > 0) {
      onNext();
    }
  };
  
  const categories = [
    {
      id: "sleep",
      title: "Sleep",
      question: "How can improving your sleep support your fitness goals after 40?",
    },
    {
      id: "nutrition",
      title: "Nutrition",
      question: "What nutritional changes will help you stay fit and energetic?",
    },
    {
      id: "exercise",
      title: "Exercise",
      question: "What type of physical activity motivates you to stay consistent?",
    },
    {
      id: "mindfulness",
      title: "Mindfulness",
      question: "How will mental wellness support your fitness journey?",
    },
  ];
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Take a moment to reflect. Your insights will help us create a personalized 40+Ripped fitness plan.
      </p>
      
      <Tabs defaultValue="sleep" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>{cat.title}</TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Label htmlFor={`response-${category.id}`} className="text-sm font-medium">
              {category.question}
            </Label>
            <Textarea
              id={`response-${category.id}`}
              placeholder="Your thoughts on fitness after 40..."
              rows={5}
              value={motivationalResponses[category.id] || ""}
              onChange={(e) => handleSaveResponse(category.id, e.target.value)}
              className="resize-none"
            />
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            const currentIndex = categories.findIndex(c => c.id === activeTab);
            if (currentIndex > 0) {
              setActiveTab(categories[currentIndex - 1].id);
            }
          }}
          disabled={activeTab === categories[0].id}
        >
          Previous
        </Button>
        
        <Button 
          variant={activeTab === categories[categories.length - 1].id ? "default" : "outline"}
          className={activeTab === categories[categories.length - 1].id ? "bg-thrive-green" : ""}
          onClick={() => {
            const currentIndex = categories.findIndex(c => c.id === activeTab);
            if (currentIndex < categories.length - 1) {
              setActiveTab(categories[currentIndex + 1].id);
            } else {
              handleNext();
            }
          }}
        >
          {activeTab === categories[categories.length - 1].id ? "Complete" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default MotivationalInterviewStep;
