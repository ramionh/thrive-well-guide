
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledge } from "@/hooks/useKnowledge";

interface KnowledgeProps {
  onComplete?: () => void;
}

const Knowledge: React.FC<KnowledgeProps> = ({ onComplete }) => {
  const { knowledgeQuestions, handleQuestionsChange, saveKnowledgeMutation } = useKnowledge(onComplete);

  const handleSave = () => {
    saveKnowledgeMutation.mutate(knowledgeQuestions);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Knowledge Roadblocks</h2>
            <div className="prose mb-6">
              <p className="text-purple-700 leading-relaxed">
                A final internal roadblock is not knowing which actions or behaviors will bring you closer to your goal. Simply put, you cannot be successful if you don't have the facts. Sometimes people fail to adopt a new behavior simply because they don't have the necessary knowledge or information to be successful. For example:
              </p>
              
              <div className="space-y-4 mt-6 bg-purple-50/50 p-4 rounded-lg border border-purple-200">
                <p className="text-purple-700">→ I don't know how to create a balanced workout routine.</p>
                <p className="text-purple-700">→ I don't understand all the steps needed to properly track my nutrition and caloric intake.</p>
                <p className="text-purple-700">→ I don't know how much progress I could make with weight training compared with focusing on cardio exercise.</p>
              </div>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Your Knowledge Gaps</h2>
            <div className="prose mb-6">
              <p className="text-purple-700">
                What are some questions you have about your goal, or in what
                areas do you lack information that might keep you from being
                successful?
              </p>
            </div>
            
            <div className="space-y-6">
              {knowledgeQuestions.map((question, index) => (
                <Textarea
                  key={index}
                  value={question}
                  onChange={(e) => handleQuestionsChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="min-h-[80px] bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              ))}

              <Button 
                onClick={handleSave}
                disabled={knowledgeQuestions.every(q => q.trim() === '') || saveKnowledgeMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              >
                Complete This Step
              </Button>
            </div>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="text-purple-600" />
      <CarouselNext className="text-purple-600" />
    </Carousel>
  );
};

export default Knowledge;
