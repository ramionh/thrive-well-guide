
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HowImportantIsItProps {
  onComplete?: () => void;
}

const HowImportantIsIt: React.FC<HowImportantIsItProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          <CarouselItem>
            <Card className="bg-soft-purple border-purple-200 shadow-md">
              <CardContent className="p-6">
                <div className="prose max-w-none text-purple-900">
                  <p className="mb-4">
                    You can feel a little ambivalence and still take action, but a lot of
                    ambivalence can keep you from acting. In order to prioritize and focus your
                    efforts on a goal, you have to resolve most of your ambivalence and believe
                    your goal is important. You can do this through changing your thoughts and
                    attitudes, accessing your inner strengths and outer resources, and developing
                    new skills and strategies to build hope and confidence.
                  </p>
                  
                  <p className="mb-4 italic text-purple-700">
                    Jack recognizes the importance and urgency he should feel about
                    improving his health. Becoming healthier will help him avoid or minimize
                    the effects of medical conditions such as high blood pressure, saving him
                    money on medications and doctor visits. It also means he will feel better
                    and happier, and have more energy for his family and his job. Yet, he needs
                    to figure out how to fit exercise and meal planning into his already busy
                    and tiring schedule.
                  </p>
                  
                  <p className="mb-4 italic text-purple-700">
                    When Jack was in his 20s, he was physically active. He had fewer
                    obligations, of course, but what really made a difference was that he built
                    gym time into his schedule. He left home early three to four mornings a
                    week to work out on the way to work. He also packed a light lunch, such as
                    chicken breast and a salad with light dressing, instead of buying a less nutritious
                    meal. Jack's determination to get up, his decision not to worry
                    what people at the gym thought about his looks or size, and his enjoyment
                    of weight training helped keep him motivated.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="bg-soft-purple border-purple-200 shadow-md">
              <CardContent className="p-6">
                <div className="prose max-w-none text-purple-900">
                  <h2 className="text-2xl font-bold mb-6 text-thrive-purple">
                    IMPORTANT DECISIONS ARE THE HARDEST TO MAKE
                  </h2>
                  
                  <p className="mb-4">
                    If change were easy, no one would need this program (or any other fitness program). There is comfort in continuing the same behavior, and when you are in the moment, what feels good now is the easy choice. It meets a need, whether it's security, comfort, pleasure, or avoidance. When I'm at the gym trying to decide which exercise to do, doing a comfortable 20-minute walk doesn't feel as good now as skipping the cardio altogether. When I'm tired, getting up early to go for a run doesn't feel as good now as sleeping in. When I'm overwhelmed after work, scrolling fitness influencers on my phone feels good now instead of actually working out.
                  </p>
                  
                  <p className="mb-4">
                    Our brain associates the easy choice—skipping workouts, choosing rest, scrolling fitness content—with pleasure. It doesn't feel good to deny yourself pleasure, even when that behavior gets in the way of your ultimate fitness goals. It's difficult to postpone something pleasurable in order to invest in your health and strength. And consciously changing your exercise habits requires making challenging decisions on a consistent basis, over and over again. It's difficult. But it is possible.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={onComplete}
                    className="bg-thrive-purple hover:bg-thrive-purple/90 text-white"
                  >
                    Complete This Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-2 text-thrive-purple" />
        <CarouselNext className="right-2 text-thrive-purple" />
      </Carousel>
    </div>
  );
};

export default HowImportantIsIt;

