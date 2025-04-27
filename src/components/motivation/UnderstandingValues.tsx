
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UnderstandingValuesProps {
  onComplete?: () => void;
}

const UnderstandingValues: React.FC<UnderstandingValuesProps> = ({ onComplete }) => {
  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Establishing Values</h2>
            <div className="prose max-w-none space-y-4">
              <p className="text-purple-900/80 leading-relaxed">
                Values help determine what's most important when we're considering different fitness goals or decisions. 
                Identifying and defining those top values is the first step to understanding the role they play. 
                Let's explore Richard's and Margaret's values.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                Richard has two values he can easily identify and explain. His first value is family. He believes it's important to be a healthy 
                and energetic father and a good fitness role model for his teenagers. Life wouldn't be the same without seeing them grow and being 
                able to participate in active family outings. Richard grew up with a father who suffered from preventable health issues, and he 
                remembers watching him struggle with basic activities and being unable to participate in sports with him. Having the stamina and 
                fitness level to play basketball with his kids and go hiking on family vacations is Richard's most important value.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                Margaret has always felt that family is important. If there was ever anything her late husband or her son, Nathan, needed, she 
                provided whatever she could. She spent her adult life caring for her family, often neglecting her own physical health and self-care. 
                At age 62, she has come to value independence. Margaret and her husband never established regular exercise habits, and she looked 
                forward to enjoying retirement without health limitations. While she sometimes misses her son, she knows Nathan has his own family, 
                career, and busy schedule.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Conflicting Values</h2>
            <div className="prose max-w-none space-y-4">
              <p className="text-purple-900/80 leading-relaxed">
                Values guide our fitness decisions and actions, but they can also conflict. In Margaret's example, family is one of her primary values, 
                yet she also values independence, which means she may not choose to join the senior fitness center where her son lives, despite his 
                encouragement. These competing priorities make her decision about adopting a regular exercise program even more difficult.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                It isn't always possible to honor all our values when making difficult decisions about health and fitness. Sometimes we have to choose 
                one value over another in order to follow through.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                While weighing the pros and cons of each possible fitness decision is helpful, it's key to assign guiding values to each benefit and 
                consequence to see what is most important. Margaret values independence. She is in her retirement years and does not want to start over 
                with unfamiliar workout routines, meet new exercise partners, and learn new fitness techniques from different instructors. Yet, Margaret 
                does not have reliable motivation in her current city. Her friends are also struggling with mobility issues or moving closer to their 
                adult children. She often has no one with whom to take walks or attend water aerobics classes. Her son and family visit twice a year. 
                She is feeling more isolated and physically declining. Having a structured fitness program with social support is becoming more important. 
                Margaret has to decide which value is more important.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Tapping into Your Strengths</h2>
            <div className="prose max-w-none space-y-4">
              <p className="text-purple-900/80 leading-relaxed">
                Many fitness coaching models and interventions use a strengths-based approach. Identifying what exercise modalities work for you, 
                what your physical and mental strengths are, and what fitness foundation you can build on puts you on the road to confidence in 
                your ability to change your health.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                Strengths include characteristics and personal factors such as positive body image, healthy attitudes toward aging, the ability to 
                work through discomfort and muscle soreness, and having a sense of purpose in your fitness journey. All these factors predict 
                healthier outcomes.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                How do you assess your fitness strengths? You might be able to identify a few natural abilities, especially those you've maintained 
                since youth. How do those strengths benefit your current fitness goals? Maybe there are other physical capabilities you haven't 
                thought of, and finding them might boost your confidence. Exploring your current fitness strengths and identifying new ways to 
                improve will help you tackle the challenges you will face while working toward your midlife health goals.
              </p>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6 bg-purple-50 border-2 border-purple-200">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Tapping into Your Resources</h2>
            <div className="prose max-w-none space-y-4">
              <p className="text-purple-900/80 leading-relaxed">
                External obstacles like finances, social support, and sociocultural, environmental, and scheduling factors might stand in the way 
                of achieving your fitness goal. On the other hand, you may have strengths and resources in these areas. Your workout buddies and 
                your internal motivation are important predictors of successful physical transformation. Identifying who is in your fitness support 
                system and how they can assist you will help you mobilize their encouragement.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                Identifying other possible resources for addressing fitness obstacles and putting an exercise plan into action can help you build 
                hope and look forward to achieving steps toward your health goal.
              </p>
              <p className="text-purple-900/80 leading-relaxed">
                The exercises in this section help you build attitudes, thoughts, beliefs, values, coping skills, strengths, and resources. 
                Reevaluating your values and building physical and mental strengths will help you develop the necessary hope and confidence to 
                make successful fitness changes in midlife. Once you complete this section, you will have identified the importance of health 
                transformation, recognized your abilities and positive physical traits, and pinpointed how you can use these to help you face 
                your current fitness challenges.
              </p>
              <Button 
                onClick={handleComplete}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
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

export default UnderstandingValues;
