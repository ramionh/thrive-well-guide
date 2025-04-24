
import React from 'react';
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
import { useAddressingAmbivalence } from "@/hooks/useAddressingAmbivalence";

interface AddressingAmbivalenceProps {
  onComplete?: () => void;
}

const AddressingAmbivalence: React.FC<AddressingAmbivalenceProps> = ({ onComplete }) => {
  const {
    positiveExperiences,
    setPositiveExperiences,
    masteryPursuits,
    setMasteryPursuits,
    copingStrategies,
    setCopingStrategies,
    saveAddressingAmbivalenceMutation
  } = useAddressingAmbivalence(onComplete);

  const handleSave = () => {
    saveAddressingAmbivalenceMutation.mutate();
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 border-2 border-purple-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Managing Emotions</h2>
            <div className="prose mb-6">
              <p className="text-purple-900/80 leading-relaxed">
                Learning how to manage those emotions in a helpful, healthy way is a key component of achieving
                your goal. There is no simple shortcut to better coping skills, but you
                can use these proven strategies to better manage your negative
                emotions.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Positive Experiences</h2>
            <div className="prose mb-6">
              <p>
                Accumulate positive experiences by participating in physical activities you enjoy. Enjoyable 
                workouts (positive experiences) will help boost your mood and your confidence about getting fit.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                List some exercise activities that make you feel better when you're experiencing negative 
                emotions about your fitness journey. Examples might include hiking, dancing, swimming, or 
                playing recreational sports.
              </p>
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <Textarea
                  key={index}
                  value={positiveExperiences[index] || ''}
                  onChange={(e) => {
                    const newExperiences = [...positiveExperiences];
                    newExperiences[index] = e.target.value;
                    setPositiveExperiences(newExperiences.filter(Boolean));
                  }}
                  placeholder={`Positive experience ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Building Mastery</h2>
            <div className="prose mb-6">
              <p>
                Build mastery by consistently working on improving your fitness level and trying new workout 
                routines. Fitness-skill-acquisition can build confidence and increase your ability to overcome 
                physical plateaus.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                List some fitness pursuits that might make you feel more confident. For example, learning proper 
                weightlifting technique or taking private yoga lessons so you can advance to more challenging poses.
              </p>
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <Textarea
                  key={index}
                  value={masteryPursuits[index] || ''}
                  onChange={(e) => {
                    const newPursuits = [...masteryPursuits];
                    newPursuits[index] = e.target.value;
                    setMasteryPursuits(newPursuits.filter(Boolean));
                  }}
                  placeholder={`Mastery pursuit ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Coping Strategies</h2>
            <div className="prose mb-6">
              <p>
                Cope ahead by preparing to deal with workout situations you know will make you uncomfortable. 
                If you identify ways to cope with and accept challenging exercises, you will be more likely to 
                complete the workout and your physical self-confidence will grow.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                List some ways you might plan in advance for fitness situations you know will be physically 
                difficult. For example, if you're intimidated by group fitness classes but want to try one, 
                you might mentally prepare yourself for the new environment by accepting this reality, planning 
                to position yourself where you feel comfortable in the room, and thinking about the health 
                benefits you'll gain from participating.
              </p>
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <Textarea
                  key={index}
                  value={copingStrategies[index] || ''}
                  onChange={(e) => {
                    const newStrategies = [...copingStrategies];
                    newStrategies[index] = e.target.value;
                    setCopingStrategies(newStrategies.filter(Boolean));
                  }}
                  placeholder={`Coping strategy ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>

            <Button 
              onClick={handleSave}
              disabled={saveAddressingAmbivalenceMutation.isPending}
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

export default AddressingAmbivalence;

