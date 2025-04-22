
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
import { useCulturalObstacles } from "@/hooks/useCulturalObstacles";

interface CulturalObstaclesProps {
  onComplete?: () => void;
}

const CulturalObstacles: React.FC<CulturalObstaclesProps> = ({ onComplete }) => {
  const { entries, handleEntryChange, saveCulturalObstaclesMutation } = useCulturalObstacles(onComplete);

  const handleSave = () => {
    saveCulturalObstaclesMutation.mutate(entries);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 border-2 border-purple-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Cultural Obstacles</h2>
            <div className="prose mb-6">
              <p className="text-purple-900/80 leading-relaxed">
                Social and cultural obstacles are rooted in the social and cultural groups we belong to. 
                These groups help us define who we are and where we belong, and help us understand the 
                unwritten rules of life through norms, or shared rules and expectations. Change that is 
                consistent with the norms of our social and cultural groups is easier to adopt, while 
                change that runs counter can be challenging.
              </p>
              
              <p className="text-purple-900/80 leading-relaxed mt-4">
                For example, consider Ryan, who started eating fast food daily when he was 14. At 25, 
                Ryan was diagnosed with high cholesterol and needed to adopt a healthier diet and exercise 
                routine. Over the past nine years, Ryan has spent Friday and Saturday nights eating pizza 
                and burgers with his friends while watching sports. In addition, Ryan had always taken 
                pride in his ability to eat more than anyone else in the group. He struggled with giving 
                up unhealthy eating because it was part of not only his own identity, but also that of 
                his social group.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Identify Cultural Obstacles</h2>
            <div className="prose mb-6">
              <p>
                What social or cultural groups or norms would make it challenging 
                for you to reach your goal? Think of as many as you can.
              </p>
            </div>
            
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <Textarea
                  key={index}
                  value={entry.obstacle}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  placeholder={`Cultural obstacle ${index + 1}`}
                  className="w-full"
                />
              ))}

              <Button 
                onClick={handleSave}
                disabled={entries.every(e => e.obstacle.trim() === '') || saveCulturalObstaclesMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              >
                Complete This Step
              </Button>
            </div>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CulturalObstacles;
