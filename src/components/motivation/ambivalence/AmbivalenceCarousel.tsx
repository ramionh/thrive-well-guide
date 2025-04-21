
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const AmbivalenceCarousel = () => {
  const screens = [
    {
      id: 1,
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">EVERYONE FEELS AMBIVALENT</h3>
          <p>
            Ambivalence is a fancy way of saying you have contradictory feelings about
            a situation and aren't sure what to do. It basically means, "I want to, but I
            don't."
          </p>
          <ul className="list-none pl-0 space-y-2">
            <li>→ I want to exercise more often in the mornings, but I also want to sleep in.</li>
            <li>→ I know I should eat less junk food, but healthy foods are boring.</li>
            <li>→ I need to stop scrolling social media and go to bed, but my mind is racing</li>
          </ul>
          <p className="mt-4">
            Part of you recognizes you should change something about your actions,
            but another part is still attached to the old ways, no matter how
            uncomfortable they are. This is normal. This is part of being human.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">The Power of "Yet"</h3>
          <p>
            Ambivalence is feeling two different ways at the same time. An ambivalent
            thought might sound something like this: "I'd like to make a change, but it's
            too hard / I don't have time / nothing works."
          </p>
          <div className="my-6">
            <h4 className="text-lg font-medium mb-2">How you talk to yourself matters!</h4>
            <p className="font-medium">Saying:</p>
            <p className="pl-4">"I'm good with exercising, but I need to get my diet in order."</p>
            <p className="font-medium mt-4">Instead of saying "yes, but," try "yet."</p>
            <p className="pl-4">→ I'm good with exercising, yet I need to work on my diet.</p>
          </div>
          <p>
            "I can't get my eating under control. It's aggravating to me that I can't resist tempting
            foods." These thoughts are filled with self-doubt and diminish our hopes
            about making a change. A more helpful thought would be, "I'm feeling
            frustrated with my struggle to resist tempting foods, yet I can work on ways
            to overcome this challenge." How we talk to ourselves helps us reframe our
            struggles with change and motivation.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4">Time for Reflection</h3>
          <p>
            Now it's time to reflect on your goals. In the exercise below, you'll create a list
            of pros and cons related to achieving your fitness goals. This will help you
            understand your motivation and any potential obstacles you might face.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardContent className="p-6">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {screens.map((screen) => (
              <CarouselItem key={screen.id} className="p-4">
                {screen.content}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-4" />
          <CarouselNext className="mr-4" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default AmbivalenceCarousel;
