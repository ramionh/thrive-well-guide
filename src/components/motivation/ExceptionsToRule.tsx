
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useExceptionsToRule } from '@/hooks/useExceptionsToRule';

interface ExceptionsToRuleProps {
  onComplete: () => void;
}

const ExceptionsToRule: React.FC<ExceptionsToRuleProps> = ({ onComplete }) => {
  const {
    formData,
    setFormData,
    internalObstacles,
    externalObstacles,
    saveExceptionMutation
  } = useExceptionsToRule(onComplete);

  const handleSave = () => {
    saveExceptionMutation.mutate(formData);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border-2 border-purple-200">
            <h3 className="text-2xl font-bold mb-4 text-purple-800">Exceptions to the Rule</h3>
            <p className="text-purple-700 mb-4">
              Think of a time you successfully faced one of the obstacles you identified:
            </p>
            
            {internalObstacles && internalObstacles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-purple-800">Internal Obstacles:</h4>
                <ul className="list-disc pl-6 text-purple-700">
                  {internalObstacles.map((obstacle, index) => (
                    <li key={index}>{obstacle.excuse}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {externalObstacles && externalObstacles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-purple-800">External Obstacles:</h4>
                <ul className="list-disc pl-6 text-purple-700">
                  {externalObstacles.map((obstacle, index) => (
                    <li key={index}>{obstacle.obstacle}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border-2 border-purple-200">
            <h3 className="text-2xl font-bold mb-4 text-purple-800">Document Your Success</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">What did you do?</label>
                <Textarea
                  value={formData.behavior}
                  onChange={(e) => setFormData(prev => ({ ...prev, behavior: e.target.value }))}
                  placeholder="Describe the behavior..."
                  className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">Who were you with?</label>
                <Textarea
                  value={formData.who}
                  onChange={(e) => setFormData(prev => ({ ...prev, who: e.target.value }))}
                  placeholder="Who was involved..."
                  className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">When did this happen?</label>
                <Textarea
                  value={formData.when_context}
                  onChange={(e) => setFormData(prev => ({ ...prev, when_context: e.target.value }))}
                  placeholder="When did this occur..."
                  className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">Where were you and what was happening?</label>
                <Textarea
                  value={formData.where_what}
                  onChange={(e) => setFormData(prev => ({ ...prev, where_what: e.target.value }))}
                  placeholder="Describe the situation and location..."
                  className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-purple-800">What were you thinking and feeling?</label>
                <Textarea
                  value={formData.thoughts_feelings}
                  onChange={(e) => setFormData(prev => ({ ...prev, thoughts_feelings: e.target.value }))}
                  placeholder="Describe your thoughts and feelings..."
                  className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={saveExceptionMutation.isPending || 
                  !formData.behavior || 
                  !formData.who || 
                  !formData.when_context || 
                  !formData.where_what || 
                  !formData.thoughts_feelings}
              >
                Complete Step
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

export default ExceptionsToRule;
