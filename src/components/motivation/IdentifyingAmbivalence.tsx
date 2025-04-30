
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
import { useIdentifyingAmbivalence } from "@/hooks/useIdentifyingAmbivalence";

interface IdentifyingAmbivalenceProps {
  onComplete?: () => void;
}

const IdentifyingAmbivalence: React.FC<IdentifyingAmbivalenceProps> = ({ onComplete }) => {
  const { entries, handleEntryChange, saveIdentifyingAmbivalenceMutation } = useIdentifyingAmbivalence(onComplete);

  const handleSave = () => {
    saveIdentifyingAmbivalenceMutation.mutate(entries);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Identifying Ambivalence</h2>
            <div className="prose mb-6">
              <p className="text-purple-700 leading-relaxed">
                Even though you've taken steps to identify your goals and possible obstacles, 
                you still might not feel completely committed. Perhaps you recognize something 
                needs to change, yet something is in the way. Ambivalence can derail goals, 
                so it's important to understand the roots of it and work through it. 
                The next few exercises will help you do so.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-white shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Write Your Ambivalent Statements</h2>
            <div className="prose mb-6">
              <p className="text-purple-700">
                Write your own ambivalent sentences here. Start the sentence with "I want to" 
                and the change you're thinking about making, then add "but" and the obstacle 
                that makes you feel ambivalent. Use an obstacle you've identified in one of the 
                previous exercises.
              </p>
              <p className="italic text-purple-600">
                Ex. I want to lower my blood pressure, but I enjoy eating too many unhealthy foods.
                Ex. I want to build muscle strength, but I'm afraid of looking awkward at the gym.
              </p>
            </div>
            
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <Textarea
                  key={index}
                  value={entry.ambivalence_statement}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  placeholder={`Ambivalence statement ${index + 1}`}
                  className="w-full bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              ))}

              <Button 
                onClick={handleSave}
                disabled={entries.every(e => e.ambivalence_statement.trim() === '') || saveIdentifyingAmbivalenceMutation.isPending}
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

export default IdentifyingAmbivalence;
