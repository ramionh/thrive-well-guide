
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

  // Helper function to ensure arrays always have 3 slots for the form
  const ensureThreeItems = (arr: string[]): string[] => {
    const result = [...(arr || [])];
    while (result.length < 3) {
      result.push('');
    }
    return result.slice(0, 3); // Limit to 3 items
  };

  // Get the display arrays with exactly 3 items each
  const displayPositiveExperiences = ensureThreeItems(positiveExperiences);
  const displayMasteryPursuits = ensureThreeItems(masteryPursuits);
  const displayCopingStrategies = ensureThreeItems(copingStrategies);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
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

        {['Positive Experiences', 'Building Mastery', 'Coping Strategies'].map((section, idx) => (
          <CarouselItem key={section}>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h2 className="text-2xl font-bold mb-4 text-purple-800">{section}</h2>
              <div className="prose mb-6">
                <p className="text-purple-700">
                  {section === 'Positive Experiences' &&
                    "Accumulate positive experiences by participating in physical activities you enjoy. Enjoyable workouts (positive experiences) will help boost your mood and your confidence about getting fit."
                  }
                  {section === 'Building Mastery' &&
                    "Build mastery by consistently working on improving your fitness level and trying new workout routines. Fitness-skill-acquisition can build confidence and increase your ability to overcome physical plateaus."
                  }
                  {section === 'Coping Strategies' &&
                    "Cope ahead by preparing to deal with workout situations you know will make you uncomfortable. If you identify ways to cope with and accept challenging exercises, you will be more likely to complete the workout and your physical self-confidence will grow."
                  }
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  {section === 'Positive Experiences' &&
                    "List some exercise activities that make you feel better when you're experiencing negative emotions about your fitness journey. Examples might include hiking, dancing, swimming, or playing recreational sports."
                  }
                  {section === 'Building Mastery' &&
                    "List some fitness pursuits that might make you feel more confident. For example, learning proper weightlifting technique or taking private yoga lessons so you can advance to more challenging poses."
                  }
                  {section === 'Coping Strategies' &&
                    "List some ways you might plan in advance for fitness situations you know will be physically difficult. For example, if you're intimidated by group fitness classes but want to try one, you might mentally prepare yourself for the new environment by accepting this reality, planning to position yourself where you feel comfortable in the room, and thinking about the health benefits you'll gain from participating."
                  }
                </p>
              </div>

              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <Textarea
                    key={index}
                    value={
                      idx === 0 ? displayPositiveExperiences[index] :
                      idx === 1 ? displayMasteryPursuits[index] :
                      displayCopingStrategies[index]
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (idx === 0) {
                        const newExperiences = [...displayPositiveExperiences];
                        newExperiences[index] = value;
                        setPositiveExperiences(newExperiences.filter(Boolean));
                      } else if (idx === 1) {
                        const newPursuits = [...displayMasteryPursuits];
                        newPursuits[index] = value;
                        setMasteryPursuits(newPursuits.filter(Boolean));
                      } else {
                        const newStrategies = [...displayCopingStrategies];
                        newStrategies[index] = value;
                        setCopingStrategies(newStrategies.filter(Boolean));
                      }
                    }}
                    placeholder={`${section.slice(0, -1)} ${index + 1}`}
                    className="w-full bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                ))}
              </div>

              {idx === 2 && (
                <Button 
                  onClick={handleSave}
                  disabled={saveAddressingAmbivalenceMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                >
                  Complete This Step
                </Button>
              )}
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-purple-600" />
      <CarouselNext className="text-purple-600" />
    </Carousel>
  );
};

export default AddressingAmbivalence;
