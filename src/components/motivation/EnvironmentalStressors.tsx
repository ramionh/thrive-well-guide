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
import { useEnvironmentalStressors } from "@/hooks/useEnvironmentalStressors";

interface EnvironmentalStressorsProps {
  onComplete?: () => void;
}

const EnvironmentalStressors: React.FC<EnvironmentalStressorsProps> = ({ onComplete }) => {
  const { entries, handleEntryChange, saveEnvironmentalStressorsMutation } = useEnvironmentalStressors(onComplete);

  const handleSave = () => {
    saveEnvironmentalStressorsMutation.mutate(entries);
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Environmental Stressors</h2>
            <div className="prose mb-6">
              <p className="text-purple-700 leading-relaxed">
                Factors in your current living situation can become obstacles to achieving your fitness goals. 
                Daily stresses, much like a lack of social support, can wear you down. Environmental stressors 
                include demanding work schedules that leave little time for exercise, living in a neighborhood 
                without safe walking paths or parks, limited access to fresh and healthy food options, sharing 
                living space with others who don't prioritize healthy eating, long commutes that cut into 
                potential workout time, and seasonal weather conditions that make outdoor activities difficult.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Identify Environmental Stressors</h2>
            <div className="prose mb-6">
              <p className="text-purple-700">
                What environmental stressors could interfere with your efforts to achieve your fitness goals? 
                Think of as many as you can.
              </p>
            </div>
            
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <Textarea
                  key={index}
                  value={entry.stressor}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  placeholder={`Environmental stressor ${index + 1}`}
                  className="w-full bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              ))}

              <Button 
                onClick={handleSave}
                disabled={entries.every(e => e.stressor.trim() === '') || saveEnvironmentalStressorsMutation.isPending}
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

export default EnvironmentalStressors;
