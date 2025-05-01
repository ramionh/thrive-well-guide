
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

interface ExploringChangeProps {
  onComplete?: () => void;
}

const ExploringChange: React.FC<ExploringChangeProps> = ({ onComplete }) => {
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
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">Exploring Change</h2>
                
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    You've come this far because you are interested in
                    making a change in your body type. After completing the previous
                    sections, you've probably figured out that making
                    this change is at least somewhat important to you.
                  </p>
                  
                  <p className="mb-4">
                    And after looking at the benefits of changing and the
                    costs of not changing, you may be more interested in
                    addressing the issue you're concerned about.
                  </p>
                  
                  <p className="mb-4">
                    Although you're more aware of the reasons you
                    want to change, you still may not be 100 percent
                    committed. As you probably realize, awareness isn't
                    enough to carry out a successful change plan.
                  </p>
                  
                  <p className="mb-4">
                    Motivation to make change requires a few elements:
                  </p>
                  
                  <div className="bg-purple-100 p-4 rounded-lg my-4">
                    <p className="font-bold text-purple-900">
                      Motivation = problem recognition (awareness) +
                      importance (priority) + confidence and hope
                    </p>
                  </div>
                  
                  <p className="mb-4">
                    This section focuses on how to establish the
                    importance of changing your body type. Recognizing your
                    strengths and resources will help you build
                    confidence, develop motivation, and believe change
                    is possible.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleComplete}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Complete This Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="text-purple-600" />
        <CarouselNext className="text-purple-600" />
      </Carousel>
    </div>
  );
};

export default ExploringChange;
