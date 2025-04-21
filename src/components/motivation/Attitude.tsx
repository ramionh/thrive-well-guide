
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAttitudeAssessment } from "@/hooks/useAttitudeAssessment";

const ATTITUDE_OPTIONS = [
  { value: 'VERY_NEGATIVE', label: 'Very Negative', description: 'I absolutely do not want to work on this goal at all.' },
  { value: 'NEGATIVE', label: 'Negative', description: 'I am not interested in working on this goal.' },
  { value: 'SOMEWHAT_NEGATIVE', label: 'Somewhat Negative', description: 'I\'d rather not work on this goal.' },
  { value: 'NEUTRAL', label: 'Neutral', description: 'I have a lot of mixed feelings about working on this goal.' },
  { value: 'SOMEWHAT_POSITIVE', label: 'Somewhat Positive', description: 'I\'m thinking I should work on this goal.' },
  { value: 'POSITIVE', label: 'Positive', description: 'I would like to work on this goal.' },
  { value: 'VERY_POSITIVE', label: 'Very Positive', description: 'I\'m very interested in working on this goal.' },
];

interface AttitudeProps {
  onComplete?: () => void;
}

const Attitude: React.FC<AttitudeProps> = ({ onComplete }) => {
  const [explanation, setExplanation] = useState('');
  const { saveAttitudeMutation } = useAttitudeAssessment(onComplete);
  const [selectedAttitude, setSelectedAttitude] = useState<string | null>(null);

  const handleSave = () => {
    if (selectedAttitude) {
      saveAttitudeMutation.mutate({
        attitude_rating: selectedAttitude,
        explanation: explanation || 'No additional explanation provided.'
      });
    }
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Understanding Your Attitude</h2>
            <div className="prose mb-6">
              <p>
                Attitude can be one of the biggest internal obstacles to changing a
                behavior. A negative attitude ("I don't want to do this" or "This is a
                waste of time") can shape all your actions, fuel fears and
                apprehensions, and undermine your ability to actually reach your goal.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attitude Assessment</h2>
            <div className="prose mb-6">
              <p>
                Based on your goal, how strong is your attitude toward taking
                action? Check the rating that most applies and write a brief
                explanation.
              </p>
            </div>
            
            <RadioGroup 
              value={selectedAttitude || ''} 
              onValueChange={setSelectedAttitude}
              className="space-y-3 mb-6"
            >
              {ATTITUDE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex flex-col">
                    <span className="font-bold">{option.label}</span>
                    <span className="text-sm text-gray-500">{option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div>
              <Label htmlFor="explanation" className="block mb-2">Brief Explanation:</Label>
              <textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Share your thoughts on your selected attitude..."
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSave}
              disabled={!selectedAttitude}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
            >
              Complete This Step
            </Button>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default Attitude;
