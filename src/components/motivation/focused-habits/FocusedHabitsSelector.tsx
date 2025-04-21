
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFocusedHabits } from '@/hooks/useFocusedHabits';
import FocusedHabitsIntro from './FocusedHabitsIntro';
import FocusedHabitCard from './FocusedHabitCard';

interface FocusedHabitsSelectorProps {
  onComplete?: () => void;
}

const FocusedHabitsSelector = ({ onComplete }: FocusedHabitsSelectorProps) => {
  const {
    allHabits,
    isLoading,
    focusedHabits,
    completionMutation,
    focusHabitMutation
  } = useFocusedHabits(onComplete);

  if (isLoading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="space-y-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <FocusedHabitsIntro />
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What are my concerns?</h2>
              <div className="prose mb-6">
                <p className="mb-4">
                  You might have a general idea that you need to change one aspect of
                  your fitness but are unsure what the change should be. You
                  don't have to address all the following topics, as we have plenty of
                  time to narrow things down later.
                </p>
                <p className="font-semibold mb-6">
                  Pick one or two core habits to focus on:
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allHabits?.map((habit) => (
                  <FocusedHabitCard
                    key={habit.id}
                    habit={habit}
                    isFocused={focusedHabits?.includes(habit.id)}
                    onSelect={(habitId) => focusHabitMutation.mutate(habitId)}
                  />
                ))}
              </div>

              <Button 
                onClick={() => completionMutation.mutate()}
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
    </div>
  );
};

export default FocusedHabitsSelector;
