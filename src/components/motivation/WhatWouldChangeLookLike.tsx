
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

interface WhatWouldChangeLookLikeProps {
  onComplete?: () => void;
}

const WhatWouldChangeLookLike: React.FC<WhatWouldChangeLookLikeProps> = ({ onComplete }) => {
  // Simple handler for completing the step
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          <CarouselItem>
            <Card className="bg-white shadow-lg border border-purple-200">
              <CardContent className="p-6">
                <div className="prose max-w-none text-purple-900">
                  <h2 className="text-2xl font-bold mb-6 text-thrive-purple">
                    WHAT WOULD CHANGE LOOK LIKE?
                  </h2>
                  <p className="mb-4">
                    Visualizing yourself meeting a fitness goal can help you build hope and consider how you might make the necessary changes to achieve it.
                  </p>
                  <p className="mb-4">
                    Let's see how Patricia envisions her ultimate goal of completing a half marathon at age 45.
                  </p>
                  <p className="mb-4 italic text-purple-700">
                    I see myself crossing the finish line of the River Valley Half Marathon. I have a consistent training schedule, running four days a week with strength training on two other days. After my weekend long runs, I meet my running group for coffee instead of the heavy brunches I used to have. I allocate part of my budget for proper running shoes and regular massage therapy. Andrea, Tom, and I want to participate in a destination race in Vancouver next year. I will be able to go because I'll have the endurance and my unsupportive husband Daniel can't make me feel guilty about the time I spend training.
                  </p>
                  <p className="mb-4 italic text-purple-700">
                    I might feel better physically and emotionally because I won't be so stressed about my declining health and energy levels. I won't feel anxious every time I climb stairs, wondering if I'll be winded. I will feel better about myself, too, because I don't want to continue gaining weight through my forties. I want to be the kind of parent who can actively participate in activities with my teenagers.
                  </p>
                  <p className="mb-4">
                    Patricia considered the benefits of becoming a regular runner in her mid-forties, and pictured herself wearing a race medal and feeling accomplished, renewed, and in control of her aging process. This is Patricia's ideal future, and it helped her figure out the steps she can take to get there.
                  </p>
                  <p className="mb-4 italic text-purple-700">
                    I need to follow a beginner's half marathon training plan and consult with my doctor about my knee issues. The local running store has group runs on Tuesday evenings, so it looks like I'll have time to join them and still handle my family responsibilities. In about six months, I will build up to the necessary mileage for a half marathon. I can research proper nutrition for endurance athletes my age and adjust my eating habits. Maybe the other parents at my kids' school who run can give me advice about balancing family life with serious training.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="bg-white shadow-lg border border-purple-200">
              <CardContent className="p-6">
                <div className="prose max-w-none text-purple-900">
                  <h2 className="text-2xl font-bold mb-6 text-thrive-purple">
                    IS CHANGE POSSIBLE?
                  </h2>
                  <p className="mb-4">
                    Visualizing your ultimate fitness goal should inspire hope and desire, but you may also notice some obstacles. That's okay. Look at the obstacles and focus on how you might overcome them. Patricia, for example, realizes it will be problematic to train consistently while Daniel complains about her "midlife crisis." He's probably not going to support her new active lifestyle easily. She also needs to address her ongoing knee pain. Patricia needs to take these major steps before she can even begin to consider registering for the half marathon. She decides to modify her goal of racing by first addressing her joint issues with a physical therapist and having an honest conversation with Daniel about her health priorities. She might need to find a running coach who specializes in masters athletes, too. Patricia's fitness goal is possible, but she must focus on injury prevention and family support first before she commits to the race.
                  </p>
                  <p className="mb-4">
                    If you look at your fitness goal and realize it doesn't just have obstacles, but it's actually impractical, you might want to reevaluate. For example, if my goal is to become a competitive bodybuilder at age 48, it's not very practical.
                  </p>
                  <p className="mb-4 italic text-purple-700">
                    I have a full-time management position and family responsibilities, and I've never seriously strength trained before. Even with a lot of work, I probably can't develop a plan to overcome the time and recovery obstacles at my age. Instead, I think I'll modify that goal to building visible muscle definition and being able to do ten unassisted pull-ups by the end of the year.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="bg-white shadow-lg border border-purple-200">
              <CardContent className="p-6">
                <div className="prose max-w-none text-purple-900">
                  <h2 className="text-2xl font-bold mb-6 text-thrive-purple">
                    PARTIAL CHANGE
                  </h2>
                  <p className="mb-4">
                    Change isn't easy. It also isn't fast. When I hold workshops for adults over 40 about fitness motivation, I ask them to think of a physical change they know they should make but are struggling with. Then I ask everyone to stand up. I say, "If it's been 30 days or less since you started working on this fitness change, sit down." I continue asking this question with a longer and longer time frame before saying, "If it's been two years or less, sit down." Usually only a few people are still standing. Then I ask everyone, "What does this tell you about midlife fitness transformation?" The answer: It's hard and it takes a long time.
                  </p>
                  <p className="mb-4">
                    But what if I asked, "What are some small fitness changes you've been able to make toward this goal, now or in the past?" Most people can identify one or two things they've done to cut back, modify, or add to their exercise routine. Although these changes may seem less impressive, they're important, too.
                  </p>
                  <p className="mb-4">
                    Making fitness change in your forties is hard, so reducing some of your counterproductive (or not so helpful) exercise behaviors is still valuable. Small fitness changes put you closer to your goal and reduce potential injury to yourself. Achieving your physical goal at 100 percent takes time, and it's okay if you don't get there. The important thing is the effort.
                  </p>
                  <p className="mb-4">
                    For example, Patricia purchased properly fitted running shoes from a specialty store. Michael started taking the stairs at work instead of the elevator three days a week. Jennifer scheduled a consultation with a nutritionist to talk about her metabolism changes and get professional input. Robert agreed to join the early-bird lap swim program at the community pool in his neighborhood. Catherine made a point of doing at least ten minutes of stretching before watching her evening shows.
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleComplete}
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

export default WhatWouldChangeLookLike;
