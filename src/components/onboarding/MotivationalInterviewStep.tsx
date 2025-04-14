
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
      question: "What changes do you want to make to your sleep habits? Why is this important to you?",
    },
    {
      id: "nutrition",
      title: "Nutrition",
      question: "How do you feel about your current eating habits? What would you like to change?",
    },
    {
      id: "exercise",
      title: "Exercise",
      question: "What type of physical activity do you enjoy? How would increasing your activity benefit you?",
    },
    {
      id: "mindfulness",
      title: "Mindfulness",
      question: "How do you currently manage stress? What practices would you like to incorporate?",
    },
  ];
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Take some time to reflect on these questions. Your answers will help us understand your motivations and customize your experience.
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
              placeholder="Your thoughts..."
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
