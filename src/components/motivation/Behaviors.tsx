
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
import { useBehaviors } from "@/hooks/useBehaviors";

interface BehaviorsProps {
  onComplete?: () => void;
}

const Behaviors: React.FC<BehaviorsProps> = ({ onComplete }) => {
  const { behaviors, setBehaviors, saveBehaviorsMutation } = useBehaviors(onComplete);

  const handleSave = () => {
    saveBehaviorsMutation.mutate(behaviors);
  };

  const handleBehaviorsChange = (value: string) => {
    setBehaviors(value.split('\n').filter(b => b.trim() !== ''));
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 border-2 border-purple-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Understanding Your Behaviors</h2>
            <div className="prose mb-6">
              <p className="text-purple-900/80 leading-relaxed">
                Our behaviors are the result of what we tell ourselves. If you keep going to
                the movies instead of exercising, it isn't an accident. It's not unusual
                for internal messaging to say you lack the skill or confidence needed to
                adopt the new behavior, so you keep doing what you've been doing. This
                kind of thinking is a big internal obstacle.
              </p>
              
              <div className="space-y-4 mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex flex-col space-y-2">
                  <p className="text-purple-900/80">→ Thought: <span className="italic">"I should buy healthier foods, but I don't know how to start."</span></p>
                  <p className="text-purple-700">→ Result: Buying unhealthy foods</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <p className="text-purple-900/80">→ Thought: <span className="italic">"If I sign up for that fitness class, I'll probably just embarrass myself."</span></p>
                  <p className="text-purple-700">→ Result: Not signing up for the fitness class</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <p className="text-purple-900/80">→ Thought: <span className="italic">"I know I should be exercising, but I don't know how to do it correctly."</span></p>
                  <p className="text-purple-700">→ Result: Watching a movie</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <p className="text-purple-900/80">→ Thought: <span className="italic">"Sure, my current fitness routine isn't very effective, but I don't think I could handle something more challenging."</span></p>
                  <p className="text-purple-700">→ Result: Sticking with an ineffective workout routine</p>
                </div>
              </div>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">List Your Behaviors</h2>
            <div className="prose mb-6">
              <p>
                What are some of your current behaviors that keep you stuck and
                work against your intended change? List as many as you can.
              </p>
            </div>
            
            <div className="space-y-6">
              <Textarea
                value={behaviors.join('\n')}
                onChange={(e) => handleBehaviorsChange(e.target.value)}
                placeholder="Enter each behavior on a new line..."
                className="min-h-[200px]"
              />

              <Button 
                onClick={handleSave}
                disabled={behaviors.length === 0 || saveBehaviorsMutation.isPending}
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

export default Behaviors;
