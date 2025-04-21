import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import ProConList from "./ProConList";

const AmbivalenceSlides = [
  {
    title: "EVERYONE FEELS AMBIVALENT",
    content: (
      <>
        <p>
          Ambivalence is a fancy way of saying you have contradictory feelings about
          a situation and aren't sure what to do. It basically means, "I want to, but I
          don't."
        </p>
        <ul className="list-none space-y-2 my-4">
          <li className="flex items-start">
            <span className="text-purple-700 mr-2">→</span>
            <span>I want to exercise more often in the mornings, but I also want to sleep in.</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-700 mr-2">→</span>
            <span>I know I should eat less junk food, but healthy foods are boring.</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-700 mr-2">→</span>
            <span>I need to stop scrolling social media and go to bed, but my mind is racing.</span>
          </li>
        </ul>
        <p>
          Part of you recognizes you should change something about your actions,
          but another part is still attached to the old ways, no matter how
          uncomfortable they are. This is normal. This is part of being human.
        </p>
      </>
    )
  },
  {
    title: "HOW YOU TALK TO YOURSELF MATTERS",
    content: (
      <>
        <p>
          Ambivalence is feeling two different ways at the same time. An ambivalent
          thought might sound something like this: "I'd like to make a change, but it's
          too hard / I don't have time / nothing works."
        </p>
        <h3 className="font-semibold text-lg mt-4 mb-2 text-purple-700">How you talk to yourself matters!</h3>
        <p className="mb-2">Saying: "I'm good with exercising, but I need to get my diet in order."</p>
        <p className="mb-4">Instead of saying "yes, but," try "yet."</p>
        <p className="flex items-start mb-4">
          <span className="text-purple-700 mr-2">→</span>
          <span>I'm good with exercising, yet I need to work on my diet.</span>
        </p>
        <p>
          "I can't get my eating under control. It's aggravating to me that I can't resist tempting
          foods." These thoughts are filled with self-doubt and diminish our hopes
          about making a change. A more helpful thought would be, "I'm feeling
          frustrated with my struggle to resist tempting foods, yet I can work on ways
          to overcome this challenge." How we talk to ourselves helps us reframe our
          struggles with change and motivation.
        </p>
      </>
    )
  },
  {
    title: "WEIGHING THE PROS AND CONS",
    content: (
      <>
        <p>
          Now that you understand ambivalence, let's explore the pros and cons of achieving your fitness goal.
          This will help you see both sides of the change you're considering.
        </p>
        <p className="mt-4">
          In the next step, you'll create a list of the pros (benefits) and cons (drawbacks) of achieving your goal.
          This exercise will help you clarify your thoughts and strengthen your motivation.
        </p>
        <div className="mt-8 flex justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700">Continue to Pro/Con List</Button>
        </div>
      </>
    )
  }
];

const Ambivalence = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProConList, setShowProConList] = useState(false);

  const handleNextSlide = () => {
    if (currentSlide < AmbivalenceSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowProConList(true);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (showProConList) {
    return <ProConList />;
  }

  return (
    <div className="space-y-6">
      <Carousel 
        className="w-full"
        opts={{
          align: "center",
          startIndex: currentSlide,
        }}
      >
        <CarouselContent>
          {AmbivalenceSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="bg-[#F5F0FF] border-purple-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">{slide.title}</h3>
                  <div className="prose">{slide.content}</div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            onClick={handleNextSlide}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentSlide === AmbivalenceSlides.length - 1 ? "Continue" : "Next"}
          </Button>
        </div>
      </Carousel>
    </div>
  );
};

export default Ambivalence;
